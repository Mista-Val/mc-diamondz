import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { 
  getCategories, 
  getCategory, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  getCategoryTree,
  getCategoryBySlug,
  getCategoryProducts,
  addProductsToCategory,
  removeProductsFromCategory,
  getFeaturedCategories,
  getCategoryBreadcrumbs
} from '@/lib/api-client/categories';
import type { 
  Category, 
  CategoryWithDetails, 
  CategoryWithProducts, 
  CreateCategoryInput, 
  UpdateCategoryInput,
  CategoryProductsResponse,
  BreadcrumbItem
} from '@/types/category';

export function useCategories() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  // Get all categories
  const useGetCategories = (params?: {
    parentId?: string | null;
    includeInactive?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
  }) => {
    return useQuery({
      queryKey: ['categories', params],
      queryFn: () => getCategories(params),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Get a single category by ID
  const useGetCategory = (id: string) => {
    return useQuery({
      queryKey: ['categories', id],
      queryFn: () => getCategory(id),
      enabled: !!id,
    });
  };

  // Get a category by slug
  const useGetCategoryBySlug = (slug: string, includeProducts = false) => {
    return useQuery({
      queryKey: ['categories', 'slug', slug, { includeProducts }],
      queryFn: () => getCategoryBySlug(slug, includeProducts),
      enabled: !!slug,
    });
  };

  // Get category tree
  const useGetCategoryTree = (parentId: string | null = null) => {
    return useQuery({
      queryKey: ['categories', 'tree', parentId],
      queryFn: () => getCategoryTree(parentId),
    });
  };

  // Get category breadcrumbs
  const useGetCategoryBreadcrumbs = (categoryId: string) => {
    return useQuery<BreadcrumbItem[]>({
      queryKey: ['categories', categoryId, 'breadcrumbs'],
      queryFn: () => getCategoryBreadcrumbs(categoryId),
      enabled: !!categoryId,
    });
  };

  // Get featured categories
  const useGetFeaturedCategories = (limit = 6) => {
    return useQuery({
      queryKey: ['categories', 'featured', limit],
      queryFn: () => getFeaturedCategories(limit),
    });
  };

  // Get products in a category
  const useGetCategoryProducts = (
    categoryId: string, 
    params?: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      minPrice?: number;
      maxPrice?: number;
      inStock?: boolean;
      featured?: boolean;
    }
  ) => {
    return useQuery<CategoryProductsResponse>({
      queryKey: ['categories', categoryId, 'products', params],
      queryFn: () => getCategoryProducts(categoryId, params),
      enabled: !!categoryId,
    });
  };

  // Create a new category
  const createCategoryMutation = useMutation({
    mutationFn: (data: CreateCategoryInput) => createCategory(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
      router.push(`/admin/categories/${data.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create category',
        variant: 'destructive',
      });
    },
  });

  // Update a category
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryInput }) => 
      updateCategory(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', data.id] });
      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update category',
        variant: 'destructive',
      });
    },
  });

  // Delete a category
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
      router.push('/admin/categories');
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete category',
        variant: 'destructive',
      });
    },
  });

  // Add products to category
  const addProductsToCategoryMutation = useMutation({
    mutationFn: ({ categoryId, productIds }: { categoryId: string; productIds: string[] }) =>
      addProductsToCategory(categoryId, productIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories', variables.categoryId, 'products'] });
      queryClient.invalidateQueries({ queryKey: ['categories', variables.categoryId] });
      toast({
        title: 'Success',
        description: 'Products added to category successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add products to category',
        variant: 'destructive',
      });
    },
  });

  // Remove products from category
  const removeProductsFromCategoryMutation = useMutation({
    mutationFn: ({ categoryId, productIds }: { categoryId: string; productIds: string[] }) =>
      removeProductsFromCategory(categoryId, productIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories', variables.categoryId, 'products'] });
      queryClient.invalidateQueries({ queryKey: ['categories', variables.categoryId] });
      toast({
        title: 'Success',
        description: 'Products removed from category successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove products from category',
        variant: 'destructive',
      });
    },
  });

  return {
    // Queries
    useGetCategories,
    useGetCategory,
    useGetCategoryBySlug,
    useGetCategoryTree,
    useGetCategoryBreadcrumbs,
    useGetFeaturedCategories,
    useGetCategoryProducts,
    
    // Mutations
    createCategory: createCategoryMutation.mutateAsync,
    updateCategory: updateCategoryMutation.mutateAsync,
    deleteCategory: deleteCategoryMutation.mutateAsync,
    addProductsToCategory: addProductsToCategoryMutation.mutateAsync,
    removeProductsFromCategory: removeProductsFromCategoryMutation.mutateAsync,
    
    // Mutation states
    isCreating: createCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
    isAddingProducts: addProductsToCategoryMutation.isPending,
    isRemovingProducts: removeProductsFromCategoryMutation.isPending,
  };
}
