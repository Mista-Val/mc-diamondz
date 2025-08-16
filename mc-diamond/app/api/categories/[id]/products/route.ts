import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { authOptions } from '@/lib/auth';
import { 
  createErrorResponse, 
  createNotFoundError, 
  createForbiddenError,
  createValidationErrorResponse,
} from '@/types/error';

// Input validation schemas
const addProductsToCategorySchema = z.object({
  productIds: z.array(z.string().uuid('Invalid product ID')).min(1, 'At least one product ID is required'),
});

// GET /api/categories/[id]/products - Get products in a category
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc';
    const minPrice = searchParams.has('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.has('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const inStock = searchParams.get('inStock') === 'true' ? true : undefined;
    const featured = searchParams.get('featured') === 'true' ? true : undefined;

    // Validate pagination
    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        createErrorResponse(new Error('Page must be a positive integer'), {
          defaultMessage: 'Invalid page number',
          defaultStatus: 400,
        }),
        { status: 400 }
      );
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        createErrorResponse(new Error('Limit must be between 1 and 100'), {
          defaultMessage: 'Invalid limit',
          defaultStatus: 400,
        }),
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return NextResponse.json(createNotFoundError('Category not found'), { status: 404 });
    }

    // Build the where clause for filtering
    const where: any = {
      categories: {
        some: { id },
      },
      isActive: true, // Only include active products
    };

    // Apply price filters if provided
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Apply in-stock filter
    if (inStock !== undefined) {
      where.quantity = inStock ? { gt: 0 } : 0;
    }

    // Apply featured filter
    if (featured !== undefined) {
      where.isFeatured = featured;
    }

    // Get total count for pagination
    const total = await prisma.product.count({ where });
    const totalPages = Math.ceil(total / limit);

    // Build orderBy clause
    let orderBy: any = {};
    if (['name', 'price', 'createdAt', 'updatedAt'].includes(sortBy)) {
      orderBy[sortBy] = sortOrder;
    } else {
      // Default sorting
      orderBy = { name: 'asc' };
    }

    // Get paginated products
    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        images: true,
        quantity: true,
        isFeatured: true,
        isActive: true,
        averageRating: true,
        reviewCount: true,
        variants: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            price: true,
            quantity: true,
          },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching category products:', error);
    return NextResponse.json(
      createErrorResponse(error, {
        defaultMessage: 'Failed to fetch category products',
        defaultStatus: 500,
      }),
      { status: 500 }
    );
  }
}

// POST /api/categories/[id]/products - Add products to a category
export async function POST(
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
    const validation = addProductsToCategorySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        createValidationErrorResponse(validation.error.errors),
        { status: 400 }
      );
    }

    const { productIds } = validation.data;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return NextResponse.json(createNotFoundError('Category not found'), { status: 404 });
    }

    // Check if all products exist
    const existingProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      select: { id: true },
    });

    const existingProductIds = new Set(existingProducts.map(p => p.id));
    const missingProductIds = productIds.filter(id => !existingProductIds.has(id));

    if (missingProductIds.length > 0) {
      return NextResponse.json(
        createErrorResponse(new Error('One or more products not found'), {
          defaultMessage: 'Some products could not be found',
          defaultStatus: 404,
          details: { missingProductIds },
        }),
        { status: 404 }
      );
    }

    // Add products to category (using transaction to ensure consistency)
    await prisma.$transaction(async (tx) => {
      // First, remove any existing associations to prevent duplicates
      await tx.category.update({
        where: { id },
        data: {
          products: {
            disconnect: productIds.map(id => ({ id })),
          },
        },
      });

      // Then add the new associations
      await tx.category.update({
        where: { id },
        data: {
          products: {
            connect: productIds.map(id => ({ id })),
          },
        },
      });
    });

    // Get the updated category with product count
    const updatedCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Products added to category successfully',
      count: updatedCategory?._count.products || 0,
    }, { status: 200 });
  } catch (error) {
    console.error('Error adding products to category:', error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        createErrorResponse(error, {
          defaultMessage: 'One or more products are already in this category',
          defaultStatus: 409,
        }),
        { status: 409 }
      );
    }

    return NextResponse.json(
      createErrorResponse(error, {
        defaultMessage: 'Failed to add products to category',
        defaultStatus: 500,
      }),
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id]/products - Remove products from a category
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
    const { productIds } = await request.json();

    // Validate productIds
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        createErrorResponse(new Error('Invalid product IDs'), {
          defaultMessage: 'At least one product ID is required',
          defaultStatus: 400,
        }),
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return NextResponse.json(createNotFoundError('Category not found'), { status: 404 });
    }

    // Remove products from category
    await prisma.category.update({
      where: { id },
      data: {
        products: {
          disconnect: productIds.map((id: string) => ({ id })),
        },
      },
    });

    // Get the updated category with product count
    const updatedCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Products removed from category successfully',
      count: updatedCategory?._count.products || 0,
    });
  } catch (error) {
    console.error('Error removing products from category:', error);
    return NextResponse.json(
      createErrorResponse(error, {
        defaultMessage: 'Failed to remove products from category',
        defaultStatus: 500,
      }),
      { status: 500 }
    );
  }
}
