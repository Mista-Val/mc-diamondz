'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCategoryAncestors } from '@/lib/api-client/categories';

interface CategoryBreadcrumbsProps {
  categoryId: string;
  className?: string;
}

export function CategoryBreadcrumbs({ categoryId, className }: CategoryBreadcrumbsProps) {
  const [breadcrumbs, setBreadcrumbs] = React.useState<Array<{ id: string; name: string }>>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchBreadcrumbs() {
      try {
        const ancestors = await getCategoryAncestors(categoryId);
        setBreadcrumbs(ancestors);
      } catch (error) {
        console.error('Failed to fetch category breadcrumbs:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBreadcrumbs();
  }, [categoryId]);

  if (isLoading) {
    return <div className={cn('h-4 w-48 bg-muted rounded animate-pulse', className)} />;
  }

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className={cn('flex items-center text-sm text-muted-foreground', className)}>
      <Link href="/admin/categories" className="hover:text-foreground transition-colors">
        Categories
      </Link>
      {breadcrumbs.map((category) => (
        <div key={category.id} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
          <Link
            href={`/admin/categories/${category.id}`}
            className="hover:text-foreground transition-colors"
          >
            {category.name}
          </Link>
        </div>
      ))}
    </nav>
  );
}
