import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { CategoryList } from '@/components/categories/CategoryList';
import { getCategories } from '@/lib/api-client/categories';

export const metadata: Metadata = {
  title: 'Manage Categories',
  description: 'Manage product categories for your store',
};

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Parse query parameters
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const parentId = typeof searchParams.parentId === 'string' ? searchParams.search : undefined;
  const sortBy = typeof searchParams.sortBy === 'string' ? searchParams.sortBy : 'name';
  const sortOrder = typeof searchParams.sortOrder === 'string' ? searchParams.sortOrder : 'asc';

  // Fetch categories
  const { categories, pagination } = await getCategories({
    page,
    search,
    parentId: parentId || null,
    sortBy,
    sortOrder,
    limit: 12,
    includeInactive: true,
  });

  if (!categories) {
    notFound();
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">
              Manage your product categories and subcategories
            </p>
          </div>
          <Button asChild>
            <a href="/admin/categories/new">
              <Icons.plus className="mr-2 h-4 w-4" />
              Add Category
            </a>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <CategoryList 
            initialCategories={categories} 
            showActions={true}
            className="mt-4"
          />
        </div>
      </div>
    </div>
  );
}
