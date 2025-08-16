import { Product } from '@prisma/client';

// Base category type from Prisma
export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  image: string | null;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  metadata: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
};

// Category with children (for hierarchical data)
export type CategoryWithChildren = Category & {
  children: Array<{
    id: string;
    name: string;
    slug: string;
    image: string | null;
    _count: {
      products: number;
    };
  }>;
  _count?: {
    products: number;
    children: number;
  };
};

// Category with products (for category pages)
export type CategoryWithProducts = Category & {
  products: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    averageRating?: number;
    reviewCount: number;
  }>;
  _count?: {
    products: number;
  };
};

// Category with full details (for admin)
export type CategoryWithDetails = Category & {
  parent: {
    id: string;
    name: string;
    slug: string;
  } | null;
  children: Array<{
    id: string;
    name: string;
    slug: string;
    image: string | null;
    _count: {
      products: number;
      children: number;
    };
  }>;
  _count: {
    products: number;
    children: number;
  };
};

// Category breadcrumb item
export type BreadcrumbItem = {
  id: string;
  name: string;
  slug: string;
};

// API Response Types
export type CategoriesResponse = {
  categories: Array<CategoryWithChildren>;
};

export type CategoryResponse = {
  category: CategoryWithDetails;
};

export type CategoryProductsResponse = {
  products: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    averageRating: number;
    reviewCount: number;
    variants: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

// Form/Request Types
export type CreateCategoryInput = {
  name: string;
  description?: string;
  parentId?: string | null;
  image?: string | null;
  isActive?: boolean;
  isFeatured?: boolean;
  order?: number;
  metadata?: Record<string, any>;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

// Query Parameters
export type CategoryQueryParams = {
  parentId?: string | null;
  includeInactive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'order' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
};

// Utility types for frontend components
export type CategoryTreeItem = Category & {
  children: CategoryTreeItem[];
  level: number;
  isExpanded?: boolean;
};

export type CategorySelectOption = {
  value: string;
  label: string;
  isDisabled?: boolean;
  options?: CategorySelectOption[];
};
