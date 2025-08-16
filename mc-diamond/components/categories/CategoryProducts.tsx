'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/products/columns';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';

interface CategoryProductsProps {
  categoryId: string;
}

export function CategoryProducts({ categoryId }: CategoryProductsProps) {
  const router = useRouter();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['category-products', categoryId],
    queryFn: async () => {
      const response = await fetch(`/api/categories/${categoryId}/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch category products');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Icons.loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <Icons.package className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-medium">No products found</h3>
        <p className="text-sm text-muted-foreground">
          Get started by adding a new product to this category.
        </p>
        <Button
          onClick={() => router.push(`/admin/products/new?categoryId=${categoryId}`)}
        >
          <Icons.plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => router.push(`/admin/products/new?categoryId=${categoryId}`)}
        >
          <Icons.plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={products}
        searchKey="name"
        placeholder="Filter products..."
      />
    </div>
  );
}
