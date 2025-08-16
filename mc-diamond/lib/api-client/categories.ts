import axios from 'axios';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  image?: string | null;
  order: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    products: number;
    children: number;
  };
  children?: Category[];
}

export interface GetCategoriesParams {
  parentId?: string | null;
  isActive?: boolean;
  isFeatured?: boolean;
  includeProducts?: boolean;
  includeChildren?: boolean;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  isActive?: boolean;
  isFeatured?: boolean;
  image?: string;
  order?: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

export async function getCategories(params?: GetCategoriesParams): Promise<Category[]> {
  const response = await axios.get('/api/categories', { params });
  return response.data;
}

export async function getCategory(
  id: string,
  options: { includeProducts?: boolean; includeChildren?: boolean } = {}
): Promise<Category> {
  const response = await axios.get(`/api/categories/${id}`, {
    params: {
      includeProducts: options.includeProducts,
      includeChildren: options.includeChildren,
    },
  });
  return response.data;
}

export async function createCategory(data: CreateCategoryData): Promise<Category> {
  const response = await axios.post('/api/categories', data);
  return response.data;
}

export async function updateCategory(
  id: string,
  data: UpdateCategoryData
): Promise<Category> {
  const response = await axios.patch(`/api/categories/${id}`, data);
  return response.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await axios.delete(`/api/categories/${id}`);
}

export async function getCategoryAncestors(categoryId: string): Promise<Array<{ id: string; name: string }>> {
  const response = await axios.get(`/api/categories/${categoryId}/ancestors`);
  return response.data;
}
