import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { authOptions } from '@/lib/auth';
import { createErrorResponse, createNotFoundError, createForbiddenError } from '@/types/error';

// Input validation schemas
const updateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  parentId: z.string().uuid('Invalid parent category ID').nullable().optional(),
  image: z.string().url('Invalid image URL').optional().nullable(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
  metadata: z.record(z.any()).optional().nullable(),
}).refine(
  (data) => {
    // Ensure a category is not set as its own parent
    if (data.parentId === undefined) return true;
    return data.parentId !== data.id;
  },
  {
    message: 'A category cannot be its own parent',
    path: ['parentId'],
  }
);

// Generate a URL-friendly slug from a string
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/--+/g, '-') // Replace multiple - with single -
    .trim();
}

// GET /api/categories/[id] - Get a single category by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Find the category with its parent and children
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            _count: {
              select: { products: true },
            },
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
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

// PATCH /api/categories/[id] - Update a category
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and has admin role
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(createForbiddenError('Insufficient permissions'), { status: 403 });
    }

    const { id } = params;
    const body = await request.json();

    // Validate request body
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
    const updateData: any = { ...data };

    // If name is being updated, generate a new slug
    if (data.name) {
      updateData.slug = generateSlug(data.name);
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(createNotFoundError('Category not found'), { status: 404 });
    }

    // Check for circular reference in parentId
    if (data.parentId) {
      if (data.parentId === id) {
        return NextResponse.json(
          createErrorResponse(new Error('A category cannot be its own parent'), {
            defaultMessage: 'Validation failed',
            defaultStatus: 400,
          }),
          { status: 400 }
        );
      }

      // Check if the parent exists and is not a descendant of this category
      const parentCategory = await prisma.category.findUnique({
        where: { id: data.parentId },
        include: { children: { select: { id: true } } },
      });

      if (!parentCategory) {
        return NextResponse.json(
          createErrorResponse(new Error('Parent category not found'), {
            defaultMessage: 'Validation failed',
            defaultStatus: 400,
          }),
          { status: 400 }
        );
      }

      // Check for circular reference (prevent making a category a child of its own descendant)
      const isDescendant = await isCategoryDescendant(data.parentId, id);
      if (isDescendant) {
        return NextResponse.json(
          createErrorResponse(new Error('Cannot set a category as a child of its own descendant'), {
            defaultMessage: 'Validation failed',
            defaultStatus: 400,
          }),
          { status: 400 }
        );
      }
    }

    // Update the category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });

    return NextResponse.json({ category: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
    
    // Handle Prisma unique constraint violation (duplicate slug)
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
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

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and has admin role
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(createForbiddenError('Insufficient permissions'), { status: 403 });
    }

    const { id } = params;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(createNotFoundError('Category not found'), { status: 404 });
    }

    // Prevent deletion if category has products or subcategories
    if (category._count.products > 0) {
      return NextResponse.json(
        createErrorResponse(new Error('Cannot delete category with products'), {
          defaultMessage: 'Cannot delete a category that contains products',
          defaultStatus: 400,
        }),
        { status: 400 }
      );
    }

    if (category._count.children > 0) {
      return NextResponse.json(
        createErrorResponse(new Error('Cannot delete category with subcategories'), {
          defaultMessage: 'Cannot delete a category that has subcategories',
          defaultStatus: 400,
        }),
        { status: 400 }
      );
    }

    // Delete the category
    await prisma.category.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
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
 * Check if a category is a descendant of another category
 */
async function isCategoryDescendant(parentId: string, childId: string): Promise<boolean> {
  let currentId = parentId;
  const visited = new Set<string>();
  
  // Prevent infinite loops in case of circular references
  while (currentId && !visited.has(currentId)) {
    visited.add(currentId);
    
    // If we find the child category while traversing up the tree, it's a descendant
    if (currentId === childId) {
      return true;
    }
    
    // Get the parent of the current category
    const category = await prisma.category.findUnique({
      where: { id: currentId },
      select: { parentId: true },
    });
    
    if (!category || !category.parentId) {
      break;
    }
    
    currentId = category.parentId;
  }
  
  return false;
}
