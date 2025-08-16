import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { CategoryWithDetails } from '@/types/category';
import { getCategories } from '@/lib/api-client/categories';

interface CategoryListProps {
  initialCategories?: CategoryWithDetails[];
  parentId?: string | null;
  className?: string;
  showHeader?: boolean;
  showActions?: boolean;
}

export function CategoryList({
  initialCategories = [],
  parentId = null,
  className,
  showHeader = true,
  showActions = true,
}: CategoryListProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryWithDetails[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(!initialCategories.length);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchCategories();
  }, [parentId, page, sortBy, sortOrder, searchTerm]);

  const fetchCategories = async () => {
    if (initialCategories.length) return;
    
    try {
      setIsLoading(true);
      const data = await getCategories({
        parentId,
        search: searchTerm,
        sortBy,
        sortOrder,
        page,
        limit,
      });
      setCategories(data.categories);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Handle error (e.g., show toast)
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (value: string) => {
    const [field, order] = value.split('_');
    setSortBy(field);
    setSortOrder(order as 'asc' | 'desc');
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCategories();
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      // TODO: Call delete category API
      // await deleteCategory(categoryId);
      // Refresh the list
      fetchCategories();
      // Show success message
    } catch (error) {
      console.error('Failed to delete category:', error);
      // Show error message
    }
  };

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Icons.folder className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No categories found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {searchTerm ? 'Try adjusting your search or filter' : 'Get started by creating a new category'}
        </p>
        {showActions && (
          <Button onClick={() => router.push('/admin/categories/new')}>
            <Icons.plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {showHeader && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          {showActions && (
            <Button onClick={() => router.push('/admin/categories/new')}>
              <Icons.plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          )}
        </div>
      )}

      <div className="grid gap-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={`${sortBy}_${sortOrder}`} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                <SelectItem value="createdAt_desc">Newest First</SelectItem>
                <SelectItem value="createdAt_asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" variant="outline">
              <Icons.search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </form>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <Link href={`/categories/${category.slug}`}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold line-clamp-1">
                      {category.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {category.isFeatured && (
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          Featured
                        </Badge>
                      )}
                      {!category.isActive && (
                        <Badge variant="outline" className="text-muted-foreground">
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {category.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {category.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Icons.package className="h-4 w-4" />
                      <span>{category._count.products} products</span>
                    </div>
                    {category._count.children > 0 && (
                      <div className="flex items-center gap-2">
                        <Icons.folder className="h-4 w-4" />
                        <span>{category._count.children} subcategories</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Link>
              {showActions && (
                <div className="p-4 pt-0 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/categories/${category.id}/edit`)}
                  >
                    <Icons.edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(category.id);
                    }}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Icons.trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <Icons.chevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              <div className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <span className="sr-only">Next</span>
                <Icons.chevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
