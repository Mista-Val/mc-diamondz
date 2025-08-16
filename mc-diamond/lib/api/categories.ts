import { prisma } from '@/lib/db/prisma';
import { CategoryWithChildren, CategoryWithProducts } from '@/types/category';

export async function getCategoryBySlug(slug: string, includeProducts = false): Promise<CategoryWithChildren | null> {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
          image: true,
          _count: {
            select: { products: true },
          },
        },
        orderBy: [
          { order: 'asc' },
          { name: 'asc' },
        ],
      },
      ...(includeProducts ? {
        products: {
          where: { isAvailable: true },
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
            _count: {
              select: { reviews: true },
            },
          },
          orderBy: { name: 'asc' },
          take: 12, // Limit number of products to prevent large payloads
        },
      } : {}),
    },
  });

  if (!category) {
    return null;
  }

  // Calculate average rating for each product if included
  if (includeProducts && 'products' in category) {
    const productsWithRating = await Promise.all(
      category.products.map(async (product) => {
        const reviews = await prisma.review.findMany({
          where: { productId: product.id },
          select: { rating: true },
        });

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

        return {
          ...product,
          averageRating: parseFloat(averageRating.toFixed(1)),
          reviewCount: product._count.reviews,
        };
      })
    );

    return {
      ...category,
      products: productsWithRating,
    };
  }

  return category as CategoryWithChildren;
}

export async function getCategoryTree(parentId: string | null = null): Promise<CategoryWithChildren[]> {
  const categories = await prisma.category.findMany({
    where: { 
      parentId,
      isActive: true,
    },
    include: {
      _count: {
        select: { 
          products: { where: { isAvailable: true } },
          children: true,
        },
      },
    },
    orderBy: [
      { order: 'asc' },
      { name: 'asc' },
    ],
  });

  // Recursively fetch children for each category
  const categoriesWithChildren = await Promise.all(
    categories.map(async (category) => ({
      ...category,
      children: await getCategoryTree(category.id),
    }))
  );

  return categoriesWithChildren;
}

export async function getBreadcrumbs(categoryId: string) {
  const breadcrumbs = [];
  let currentId = categoryId;

  // Traverse up the category hierarchy
  while (currentId) {
    const category = await prisma.category.findUnique({
      where: { id: currentId },
      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true,
      },
    });

    if (!category) break;

    breadcrumbs.unshift({
      id: category.id,
      name: category.name,
      slug: category.slug,
    });

    currentId = category.parentId || '';
  }

  return breadcrumbs;
}

export async function getFeaturedCategories(limit = 6): Promise<CategoryWithChildren[]> {
  const categories = await prisma.category.findMany({
    where: { 
      isActive: true,
      isFeatured: true,
    },
    include: {
      _count: {
        select: { 
          products: { where: { isAvailable: true } },
        },
      },
    },
    orderBy: [
      { order: 'asc' },
      { name: 'asc' },
    ],
    take: limit,
  });

  return categories as CategoryWithChildren[];
}

export async function getCategoryAncestors(categoryId: string): Promise<string[]> {
  const ancestors: string[] = [];
  let currentId: string | null = categoryId;

  while (currentId) {
    const category = await prisma.category.findUnique({
      where: { id: currentId },
      select: { parentId: true },
    });

    if (!category) break;
    
    if (category.parentId) {
      ancestors.unshift(category.parentId);
    }
    
    currentId = category.parentId;
  }

  return ancestors;
}
