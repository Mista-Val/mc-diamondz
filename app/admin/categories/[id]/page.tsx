'use client';

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/utils';
import { getCategory } from '@/lib/api-client/categories';
import { CategoryProducts } from '@/components/categories/CategoryProducts';
import { CategoryBreadcrumbs } from '@/components/categories/CategoryBreadcrumbs';

export const metadata: Metadata = {
  title: 'Category Details',
  description: 'View and manage category details',
};

export default async function CategoryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const category = await getCategory(params.id, {
    includeProducts: true,
    includeChildren: true,
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
              {!category.isActive && (
                <Badge variant="outline" className="text-muted-foreground">
                  Inactive
                </Badge>
              )}
              {category.isFeatured && (
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  Featured
                </Badge>
              )}
            </div>
            <CategoryBreadcrumbs categoryId={category.id} className="mt-1" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/admin/categories/${params.id}/edit`}>
                <Icons.edit className="mr-2 h-4 w-4" />
                Edit
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

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products ({category._count.products})</TabsTrigger>
            <TabsTrigger value="subcategories">Subcategories ({category._count.children})</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Icons.package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{category._count.products}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Subcategories</CardTitle>
                  <Icons.folder className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{category._count.children}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                  <Icons.activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {category.isActive ? 'Active' : 'Inactive'}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Created</CardTitle>
                  <Icons.calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(category.createdAt)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {category.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Products in {category.name}</CardTitle>
                  <Button size="sm" asChild>
                    <Link href={`/admin/products/new?categoryId=${category.id}`}>
                      <Icons.plus className="mr-2 h-4 w-4" />
                      Add Product
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <CategoryProducts categoryId={category.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subcategories" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Subcategories</CardTitle>
                  <Button size="sm" asChild>
                    <Link href={`/admin/categories/new?parentId=${category.id}`}>
                      <Icons.plus className="mr-2 h-4 w-4" />
                      Add Subcategory
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {category._count.children > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {category.children.map((subcategory) => (
                      <Link 
                        key={subcategory.id} 
                        href={`/admin/categories/${subcategory.id}`}
                        className="block"
                      >
                        <Card className="hover:bg-accent transition-colors">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{subcategory.name}</CardTitle>
                              <div className="flex items-center gap-2">
                                {!subcategory.isActive && (
                                  <Badge variant="outline" className="text-xs">
                                    Inactive
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {subcategory._count.products} products
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {subcategory.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {subcategory.description}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Icons.folder className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No subcategories</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get started by creating a new subcategory
                    </p>
                    <Button asChild>
                      <Link href={`/admin/categories/new?parentId=${category.id}`}>
                        <Icons.plus className="mr-2 h-4 w-4" />
                        Add Subcategory
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-1">
                    <h4 className="text-sm font-medium">Delete this category</h4>
                    <p className="text-sm text-muted-foreground">
                      Once you delete a category, there is no going back. Please be certain.
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    className="w-fit"
                    // TODO: Implement delete functionality
                    onClick={() => {}}
                  >
                    <Icons.trash className="mr-2 h-4 w-4" />
                    Delete Category
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
