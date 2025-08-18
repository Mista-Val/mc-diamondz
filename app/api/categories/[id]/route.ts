import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { authOptions } from '@/lib/auth';
import { createErrorResponse, createNotFoundError, createForbiddenError } from '@/types/error';

// Validation schema for updates
const updateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  parentId: z.string().uuid('Invalid parent category ID').nullable().optional(),
  image: z.string().url('Invalid image URL').optional().nullable(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
  metadata: z.record(z.any()).optional().nullable(),
});

// Generate a slug from a name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove invalid chars
    .replace(/\s+/g, '-') // Replace spaces with hyphen
    .replace(/--+/g, '-') // Collapse multiple hyphens
    .trim();
}

/**
 * GET /api/categories/[id]
 * Get category details with parent, children, and counts
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            _count: { select: { products: true } },
          },
          orderBy: { order: 'asc' },
        },
        _count: { select: { products: true, children: true } },
      },
    });

    if (!category) {
      return NextResponse.json(createNotFoundError('Category not found'), { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      createErrorResponse(error, {
        defaultMessage: 'Failed to fetch category',
        defaultStatus: 500,
      }),
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/categories/[id]
 * Update a category (Admin only)
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(createForbiddenError('Insufficient permissions'), { status: 403 });
    }

    const { id } = params;
    const body = await request.json();
    const validation = updateCategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(validation.error, {
          defaultMessage: 'Invalid category data',
          defaultStatus: 400,
        }),
        { status: 400 }
      );
    }

    const data = validation.data;
    const updateData: Prisma.CategoryUpdateInput = { ...data };

    // If name is updated, regenerate slug
    if (data.name) {
      updateData.slug = generateSlug(data.name);
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({ where: { id } });
    if (!existingCategory) {
      return NextResponse.json(createNotFoundError('Category not found'), { status: 404 });
    }

    // Prevent self-parent assignment
    if (data.parentId && data.parentId === id) {
      return NextResponse.json(
        createErrorResponse(new Error('A category cannot be its own parent'), {
          defaultMessage: 'Validation failed',
          defaultStatus: 400,
        }),
        { status: 400 }
      );
    }

    // Ensure parent is valid and not a descendant
    if (data.parentId) {
      const parentExists = await prisma.category.findUnique({ where: { id: data.parentId } });
      if (!parentExists) {
        return NextResponse.json(
          createErrorResponse(new Error('Parent category not found'), {
            defaultMessage: 'Validation failed',
            defaultStatus: 400,
          }),
          { status: 400 }
        );
      }

      const isDescendant = await isCategoryDescendant(data.parentId, id);
      if (isDescendant) {
        return NextResponse.json(
          createErrorResponse(new Error('Cannot set category as a child of its own descendant'), {
            defaultMessage: 'Validation failed',
            defaultStatus: 400,
          }),
          { status: 400 }
        );
      }
    }

    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        _count: { select: { products: true, children: true } },
      },
    });

    return NextResponse.json({ category: updatedCategory });
  } catch (error: any) {
    console.error('Error updating category:', error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002' &&
      error.meta?.target?.includes('slug')
    ) {
      return NextResponse.json(
        createErrorResponse(error, {
          defaultMessage: 'A category with this name already exists',
          defaultStatus: 409,
        }),
        { status: 409 }
      );
    }

    return NextResponse.json(
      createErrorResponse(error, {
        defaultMessage: 'Failed to update category',
        defaultStatus: 500,
      }),
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/categories/[id]
 * Delete a category if empty (Admin only)
 */
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(createForbiddenError('Insufficient permissions'), { status: 403 });
    }

    const { id } = params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true, children: true } } },
    });

    if (!category) {
      return NextResponse.json(createNotFoundError('Category not found'), { status: 404 });
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        createErrorResponse(new Error('Cannot delete category with products'), {
          defaultMessage: 'Category contains products',
          defaultStatus: 400,
        }),
        { status: 400 }
      );
    }

    if (category._count.children > 0) {
      return NextResponse.json(
        createErrorResponse(new Error('Cannot delete category with subcategories'), {
          defaultMessage: 'Category contains subcategories',
          defaultStatus: 400,
        }),
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Category deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      createErrorResponse(error, {
        defaultMessage: 'Failed to delete category',
        defaultStatus: 500,
      }),
      { status: 500 }
    );
  }
}

/**
 * Utility: check if parentId is a descendant of childId
 */
async function isCategoryDescendant(parentId: string, childId: string): Promise<boolean> {
  let currentId = parentId;
  const visited = new Set<string>();

  while (currentId && !visited.has(currentId)) {
    visited.add(currentId);

    if (currentId === childId) return true;

    const category = await prisma.category.findUnique({
      where: { id: currentId },
      select: { parentId: true },
    });

    if (!category?.parentId) break;
    currentId = category.parentId;
  }

  return false;
}
