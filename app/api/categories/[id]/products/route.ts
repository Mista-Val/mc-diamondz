import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { authOptions } from '@/lib/auth';
import { Prisma } from '@prisma/client';

import { 
  createErrorResponse, 
  createNotFoundError, 
  createForbiddenError,
  createValidationErrorResponse,
} from '@/types/error';

// --------------------
// Validation Schemas
// --------------------
const addProductsToCategorySchema = z.object({
  productIds: z.array(z.string().uuid('Invalid product ID')).min(1, 'At least one product ID is required'),
});

const deleteProductsFromCategorySchema = z.object({
  productIds: z.array(z.string().uuid('Invalid product ID')).min(1, 'At least one product ID is required'),
});

// --------------------
// Helpers
// --------------------
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('FORBIDDEN');
  }
  return session;
}

// --------------------
// GET /api/categories/[id]/products
// --------------------
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);

    // Pagination & filters
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc';
    const minPrice = searchParams.has('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.has('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const inStock = searchParams.get('inStock') === 'true' ? true : undefined;
    const featured = searchParams.get('featured') === 'true' ? true : undefined;

    if (isNaN(page) || page < 1) {
      return NextResponse.json(createErrorResponse(new Error('Invalid page number')), { status: 400 });
    }
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(createErrorResponse(new Error('Invalid limit')), { status: 400 });
    }

    // Category check
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return NextResponse.json(createNotFoundError('Category not found'), { status: 404 });
    }

    // Filters
    const where: any = {
      categories: { some: { id } },
      isActive: true,
    };
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    if (inStock !== undefined) where.quantity = inStock ? { gt: 0 } : 0;
    if (featured !== undefined) where.isFeatured = featured;

    // Pagination + sorting
    const total = await prisma.product.count({ where });
    const totalPages = Math.ceil(total / limit);
    const orderBy = ['name', 'price', 'createdAt', 'updatedAt'].includes(sortBy)
      ? { [sortBy]: sortOrder }
      : { name: 'asc' };

    // Query
    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        quantity: true,
        isFeatured: true,
        isActive: true,
        averageRating: true,
        reviewCount: true,
        images: { select: { url: true } }, // safer than `images: true`
        variants: {
          where: { isActive: true },
          select: { id: true, name: true, price: true, quantity: true },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({ products, pagination: { total, page, limit, totalPages } });
  } catch (error) {
    console.error('Error fetching category products:', error);
    return NextResponse.json(
      createErrorResponse(error, { defaultMessage: 'Failed to fetch category products', defaultStatus: 500 }),
      { status: 500 }
    );
  }
}

// --------------------
// POST /api/categories/[id]/products
// --------------------
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const { id } = params;
    const body = await request.json();
    const validation = addProductsToCategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(createValidationErrorResponse(validation.error.errors), { status: 400 });
    }

    const { productIds } = validation.data;

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) return NextResponse.json(createNotFoundError('Category not found'), { status: 404 });

    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true },
    });
    const existingIds = new Set(existingProducts.map(p => p.id));
    const missingIds = productIds.filter(pid => !existingIds.has(pid));

    if (missingIds.length > 0) {
      return NextResponse.json(
        createErrorResponse(new Error('Some products not found'), {
          defaultMessage: 'Some products could not be found',
          defaultStatus: 404,
          details: { missingProductIds: missingIds },
        }),
        { status: 404 }
      );
    }

    // Transaction
    await prisma.$transaction([
      prisma.category.update({
        where: { id },
        data: { products: { disconnect: productIds.map(pid => ({ id: pid })) } },
      }),
      prisma.category.update({
        where: { id },
        data: { products: { connect: productIds.map(pid => ({ id: pid })) } },
      }),
    ]);

    const updatedCategory = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    return NextResponse.json({
      success: true,
      message: 'Products added successfully',
      count: updatedCategory?._count.products ?? 0,
    });
  } catch (error) {
    console.error('Error adding products:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json(
        createErrorResponse(error, { defaultMessage: 'One or more products already exist in category', defaultStatus: 409 }),
        { status: 409 }
      );
    }
    if (error.message === 'FORBIDDEN') {
      return NextResponse.json(createForbiddenError('Insufficient permissions'), { status: 403 });
    }
    return NextResponse.json(
      createErrorResponse(error, { defaultMessage: 'Failed to add products to category', defaultStatus: 500 }),
      { status: 500 }
    );
  }
}

// --------------------
// DELETE /api/categories/[id]/products
// --------------------
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const { id } = params;
    const body = await request.json();
    const validation = deleteProductsFromCategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(createValidationErrorResponse(validation.error.errors), { status: 400 });
    }

    const { productIds } = validation.data;

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) return NextResponse.json(createNotFoundError('Category not found'), { status: 404 });

    await prisma.category.update({
      where: { id },
      data: { products: { disconnect: productIds.map(pid => ({ id: pid })) } },
    });

    const updatedCategory = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    return NextResponse.json({
      success: true,
      message: 'Products removed successfully',
      count: updatedCategory?._count.products ?? 0,
    });
  } catch (error) {
    console.error('Error removing products:', error);
    if (error.message === 'FORBIDDEN') {
      return NextResponse.json(createForbiddenError('Insufficient permissions'), { status: 403 });
    }
    return NextResponse.json(
      createErrorResponse(error, { defaultMessage: 'Failed to remove products from category', defaultStatus: 500 }),
      { status: 500 }
    );
  }
}
