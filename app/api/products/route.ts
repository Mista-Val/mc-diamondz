import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authOptions } from '@/lib/auth/options';
import { getServerSession } from 'next-auth';
import { handleApiError, successResponse } from '@/lib/api/response';
import { z } from 'zod';

// Input validation schemas
const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  compareAtPrice: z.number().positive('Compare at price must be positive').optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  quantity: z.number().int().nonnegative('Quantity must be a non-negative integer'),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  images: z.array(z.string().url('Invalid image URL')).default([]),
  categoryId: z.string().min(1, 'Category ID is required'),
  variants: z.array(z.any()).optional(),
});

// GET /api/products - Get all products with pagination and filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const isAvailable = searchParams.get('isAvailable');
    const isFeatured = searchParams.get('isFeatured');

    // Build the where clause
    const where: any = {};
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    
    if (isAvailable !== null) {
      where.isAvailable = isAvailable === 'true';
    }
    
    if (isFeatured !== null) {
      where.isFeatured = isFeatured === 'true';
    }

    // Execute the query
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          variants: true,
          _count: {
            select: {
              reviews: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return successResponse({
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/products - Create a new product (admin only)
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
    const validation = createProductSchema.safeParse(body);
    
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
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        sku: data.sku,
        barcode: data.barcode,
        quantity: data.quantity,
        isAvailable: data.isAvailable,
        isFeatured: data.isFeatured,
        images: data.images,
        categoryId: data.categoryId,
      },
    });

    // Create variants if provided
    if (data.variants && data.variants.length > 0) {
      await prisma.variant.createMany({
        data: data.variants.map((variant: any) => ({
          ...variant,
          productId: product.id,
        })),
      });
    }

    // Return the created product with variants
    const createdProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        variants: true,
      },
    });

    return successResponse(
      { product: createdProduct },
      'Product created successfully',
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
