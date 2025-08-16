import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authOptions } from '@/lib/auth/options';
import { getServerSession } from 'next-auth';
import { handleApiError, successResponse } from '@/lib/api/response';
import { z } from 'zod';

// Input validation schemas
const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  parentId: z.string().optional().nullable(),
  image: z.string().url('Invalid image URL').optional().nullable(),
  isActive: z.boolean().default(true),
  order: z.number().int().default(0),
  metadata: z.record(z.any()).optional(),
});

// GET /api/categories - Get all categories with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');
    const includeInactive = searchParams.get('includeInactive') === 'true';
    
    const categories = await prisma.category.findMany({
      where: {
        ...(parentId === 'null' || parentId === null 
          ? { parentId: null } 
          : parentId ? { parentId } : {}),
        ...(includeInactive ? {} : { isActive: true }),
      },
      include: {
        _count: {
          select: { products: true, children: true },
        },
      },
      orderBy: [
        { order: 'asc' },
        { name: 'asc' },
      ],
    });

    return successResponse({ categories });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/categories - Create a new category (admin only)
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = createCategorySchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;
    
    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();

    // Check if category with same slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      );
    }

    // If parentId is provided, verify it exists
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

    // Create the category
    const category = await prisma.category.create({
      data: {
        ...data,
        slug,
      },
    });

    return successResponse(
      { category },
      'Category created successfully',
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
