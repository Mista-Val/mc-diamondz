import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icons } from '@/components/icons';
import { useToast } from '@/components/ui/use-toast';
import { getCategories } from '@/lib/api-client/categories';
import { Category } from '@/types/category';

// Form validation schema
const categoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  description: z.string().max(500, 'Description must be at most 500 characters').optional(),
  parentId: z.string().uuid('Invalid category').nullable().optional(),
  image: z.string().url('Invalid URL').optional().nullable(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  order: z.coerce.number().int('Must be a whole number').min(0, 'Must be 0 or greater').default(0),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  category?: Category;
  onSuccess?: () => void;
  className?: string;
}

export function CategoryForm({ category, onSuccess, className }: CategoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Initialize form with default values or category data
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      parentId: category?.parentId || null,
      image: category?.image || '',
      isActive: category?.isActive ?? true,
      isFeatured: category?.isFeatured ?? false,
      order: category?.order || 0,
    },
  });

  // Load parent categories
  useEffect(() => {
    const loadParentCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const data = await getCategories({
          includeInactive: false,
          sortBy: 'name',
          sortOrder: 'asc',
        });
        
        // Filter out the current category and its descendants to prevent circular references
        const filteredCategories = category 
          ? data.filter(cat => cat.id !== category.id && !isDescendant(cat, category.id, data))
          : data;
          
        setParentCategories(filteredCategories);
      } catch (error) {
        console.error('Failed to load categories:', error);
        toast({
          title: 'Error',
          description: 'Failed to load parent categories',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadParentCategories();
  }, [category, toast]);

  // Check if a category is a descendant of another category
  const isDescendant = (category: Category, targetId: string, allCategories: Category[]): boolean => {
    if (!category.parentId) return false;
    if (category.parentId === targetId) return true;
    
    const parent = allCategories.find(c => c.id === category.parentId);
    return parent ? isDescendant(parent, targetId, allCategories) : false;
  };

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setIsLoading(true);
      
      // TODO: Call create or update API based on whether we're editing
      // if (category) {
      //   await updateCategory(category.id, data);
      //   toast({
      //     title: 'Success',
      //     description: 'Category updated successfully',
      //   });
      // } else {
      //   await createCategory(data);
      //   toast({
      //     title: 'Success',
      //     description: 'Category created successfully',
      //   });
      // }
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Default behavior: redirect to categories list
        router.push('/admin/categories');
      }
    } catch (error) {
      console.error('Failed to save category:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save category',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a brief description"
                        className="min-h-[100px]"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Category</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === 'null' ? null : value)}
                      value={field.value || 'null'}
                      disabled={isLoadingCategories}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a parent category (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="null">No parent (top-level category)</SelectItem>
                        {parentCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Leave empty to create a top-level category
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="https://example.com/image.jpg"
                            {...field}
                            value={field.value || ''}
                          />
                        </div>
                        {field.value && (
                          <div className="mt-2">
                            <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-md border">
                              <img
                                src={field.value}
                                alt="Category preview"
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 rounded-lg border p-4">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel>Active</FormLabel>
                        <FormDescription>
                          Inactive categories won't be visible to customers
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel>Featured</FormLabel>
                        <FormDescription>
                          Featured categories may be highlighted on the homepage
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormDescription>
                        Lower numbers appear first in lists
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {category ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
