import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { CategoryForm } from '@/components/categories/CategoryForm';

export const metadata: Metadata = {
  title: 'Create Category',
  description: 'Add a new product category',
};

export default function NewCategoryPage() {
  return (
    <div className="container py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Category</h1>
            <p className="text-muted-foreground">
              Add a new product category to your store
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/admin/categories">
              <Icons.chevronLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <CategoryForm />
        </div>
      </div>
    </div>
  );
}
