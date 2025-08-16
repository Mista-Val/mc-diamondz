import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authOptions } from '@/lib/auth/options';
import { getServerSession } from 'next-auth';
import { handleApiError, successResponse } from '@/lib/api/response';
import { z } from 'zod';

// Input validation schemas
const updateProductSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  price: z.number().positive('Price must be positive').optional(),
  compareAtPrice: z.number().positive('Compare at price must be positive').optional().nullable(),
  sku: z.string().optional().nullable(),
  barcode: z.string().optional().nullable(),
  quantity: z.number().int().nonnegative('Quantity must be a non-negative integer').optional(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  images: z.array(z.string().url('Invalid image URL')).optional(),
  categoryId: z.string().min(1, 'Category ID is required').optional(),
});

type Params = {
  params: {
    id: string;
  };
};

// GET /api/products/[id] - Get a single product by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        variants: true,
        reviews: {
          select: {
            id: true,
            rating: true,
            title: true,
            comment: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Calculate average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = product.reviews.length > 0 
      ? totalRating / product.reviews.length 
      : 0;

    return successResponse({
      ...product,
      averageRating: parseFloat(averageRating.toFixed(1)),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/products/[id] - Update a product (admin only)
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = params;
    
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
    const validation = updateProductSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if category exists if categoryId is being updated
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }
    }

    // Generate slug if name is being updated
    let slug = existingProduct.slug;
    if (data.name) {
      slug = data.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        slug,
      },
      include: {
        category: true,
        variants: true,
      },
    });

    return successResponse(
      { product: updatedProduct },
      'Product updated successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/products/[id] - Delete a product (admin only)
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    
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

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete the product (Prisma will handle cascading deletes)
    await prisma.product.delete({
      where: { id },
    });

    return successResponse(
      null,
      'Product deleted successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}
