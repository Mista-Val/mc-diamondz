import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authOptions } from '@/lib/auth/options';
import { getServerSession } from 'next-auth';
import { handleApiError, successResponse } from '@/lib/api/response';
import { z } from 'zod';

/**
 * Validation schema for creating a category
 */
const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().max(500).optional().nullable(),
  parentId: z.string().uuid('Invalid parent category ID').optional().nullable(),
  image: z.string().url('Invalid image URL').optional().nullable(),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
  metadata: z.record(z.any()).optional().nullable(),
});

/**
 * Utility: Generate a slug from a name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove invalid chars
    .replace(/\s+/g, '-') // Replace spaces with hyphen
    .replace(/--+/g, '-') // Collapse multiple hyphens
    .trim();
}

/**
 * GET /api/categories
 * List categories (with optional parentId, active/inactive filter)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const categories = await prisma.category.findMany({
      where: {
        ...(parentId === 'null'
          ? { parentId: null }
          : parentId
          ? { parentId }
          : {}),
        ...(includeInactive ? {} : { isActive: true }),
      },
      include: {
        _count: {
          select: { products: true, children: true },
        },
      },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });

    return successResponse({ categories });
  } catch (error) {
    return handleApiError(error, {
      defaultMessage: 'Failed to fetch categories',
    });
  }
}

/**
 * POST /api/categories
 * Create a new category (Admin only)
 */
export async function POST(request: Request) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse + validate
    const body = await request.json();
    const validation = createCategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;
    const slug = generateSlug(data.name);

    // Ensure slug is unique
    const existingCategory = await prisma.category.findUnique({ where: { slug } });
    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      );
    }

    // If parentId provided, verify existence
    if (data.parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: data.parentId },
      });
      if (!parentCategory) {
        return NextResponse.json(
          { error: 'Parent category not found' },
          { status: 404 }
        );
      }
    }

    // Create category
    const category = await prisma.category.create({
      data: { ...data, slug },
    });

    return successResponse(
      { category },
      'Category created successfully',
      201
    );
  } catch (error) {
    return handleApiError(error, {
      defaultMessage: 'Failed to create category',
    });
  }
}
