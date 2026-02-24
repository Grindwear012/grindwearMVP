'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminOrdersTab from '@/components/admin-orders-tab';
import AdminProductsTab from '@/components/admin-products-tab';

export default function AdminPage() {
    return (
        <div className="container mx-auto py-8 md:py-12">
            <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mb-8">
                Manage your store's orders and products.
            </p>
            <Tabs defaultValue="orders">
                <TabsList className="mb-6">
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                </TabsList>
                <TabsContent value="orders">
                    <AdminOrdersTab />
                </TabsContent>
                <TabsContent value="products">
                    <AdminProductsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
