import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { CategoryForm } from '@/components/categories/CategoryForm';
import { getCategory } from '@/lib/api-client/categories';

export const metadata: Metadata = {
  title: 'Edit Category',
  description: 'Edit an existing product category',
};

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const category = await getCategory(params.id);

  if (!category) {
    notFound();
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
            <p className="text-muted-foreground">
              Update the details of this category
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/admin/categories/${params.id}`}>
                <Icons.eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/categories">
                <Icons.chevronLeft className="mr-2 h-4 w-4" />
                Back to Categories
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <CategoryForm category={category} />
        </div>
      </div>
    </div>
  );
}
