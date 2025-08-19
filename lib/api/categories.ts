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
          include: {
            reviews: {
              select: {
                rating: true,
              },
            },
            _count: {
              select: {
                reviews: true,
              },
            },
          },
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
          },
          orderBy: { name: 'asc' },
          take: 12, // Limit number of products to prevent large payloads
        },
      } : {}),
    },
  });

  if (!category) return null;

  if (includeProducts && category.products) {
    const productsWithRating = await Promise.all(
      category.products.map(async (product: { id: string; [key: string]: any }) => {
        const reviews = await prisma.review.findMany({
          where: { productId: product.id },
          select: { rating: true },
        });

        const totalRating = reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0);
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

        return {
          ...product,
          averageRating: parseFloat(averageRating.toFixed(1)),
          reviewCount: product._count?.reviews || 0,
        };
      })
    );

    return {
      ...category,
      products: productsWithRating,
    };
  }

  return category;
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
  }) as unknown as CategoryWithChildren[];

  // Recursively fetch children for each category
  const categoriesWithChildren = await Promise.all(
    categories.map(async (category) => {
      const children = await getCategoryTree(category.id);
      return {
        ...category,
        children: children.map(child => ({
          id: child.id,
          name: child.name,
          slug: child.slug,
          image: child.image,
          _count: {
            products: child._count?.products || 0
          }
        }))
      };
    })
  );

  return categoriesWithChildren;
}

export async function getBreadcrumbs(categoryId: string) {
  const breadcrumbs = [];
  let currentId = categoryId;

  // Traverse up the category hierarchy
  while (currentId) {
    const category: { 
      id: string; 
      name: string; 
      slug: string; 
      parentId: string | null 
    } | null = await prisma.category.findUnique({
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
    const category: { parentId: string | null } | null = await prisma.category.findUnique({
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
