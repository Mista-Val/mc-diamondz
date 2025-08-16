import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authOptions } from '@/lib/auth/options';
import { getServerSession } from 'next-auth';
import { handleApiError, successResponse } from '@/lib/api/response';
import { z } from 'zod';

type Params = {
  params: {
    id: string;
    variantId: string;
  };
};

// Input validation schema
const updateVariantSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  values: z.record(z.any()).optional(),
  price: z.number().positive('Price must be positive').optional(),
  sku: z.string().optional().nullable(),
  barcode: z.string().optional().nullable(),
  quantity: z.number().int().nonnegative('Quantity must be a non-negative integer').optional(),
});

// GET /api/products/[id]/variants/[variantId] - Get a single variant by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id: productId, variantId } = params;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const variant = await prisma.variant.findUnique({
      where: { id: variantId, productId },
    });

    if (!variant) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      );
    }

    return successResponse({ variant });
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/products/[id]/variants/[variantId] - Update a variant (admin only)
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id: productId, variantId } = params;
    
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
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if variant exists
    const existingVariant = await prisma.variant.findUnique({
      where: { id: variantId, productId },
    });

    if (!existingVariant) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = updateVariantSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Update the variant
    const updatedVariant = await prisma.variant.update({
      where: { id: variantId },
      data,
    });

    return successResponse(
      { variant: updatedVariant },
      'Variant updated successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/products/[id]/variants/[variantId] - Delete a variant (admin only)
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id: productId, variantId } = params;
    
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
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if variant exists
    const variant = await prisma.variant.findUnique({
      where: { id: variantId, productId },
    });

    if (!variant) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      );
    }

    // Delete the variant
    await prisma.variant.delete({
      where: { id: variantId },
    });

    return successResponse(
      null,
      'Variant deleted successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}
