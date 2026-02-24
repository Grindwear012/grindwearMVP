'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Short description is required'),
  longDescription: z.string().min(1, 'Long description is required'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  category: z.string().min(1, 'Category is required'),
  sizes: z.string().min(1, 'Please provide comma-separated sizes'),
  colors: z.string().min(1, 'Please provide comma-separated colors'),
  images: z.string().min(1, 'Please provide comma-separated image URLs'),
});

export default function AdminProductsTab() {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            longDescription: '',
            price: 0,
            category: '',
            sizes: '',
            colors: '',
            images: '',
        },
    });

    function onSubmit(values: z.infer<typeof productSchema>) {
        // In a real app, you would send this data to your backend to create a new product.
        console.log('New product submitted:', values);
        toast({
            title: 'Product Added!',
            description: `${values.name} has been added to the store.`,
        });
        form.reset();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Add new products to your store inventory.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Vintage Denim Jacket" {...field} />
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
                                    <FormLabel>Short Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="A timeless wardrobe staple." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="longDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Long Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Detailed description of the product..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price (R)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" placeholder="e.g., 75.00" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Men, Women, Accessories" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <FormField
                                control={form.control}
                                name="sizes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sizes (comma-separated)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., S, M, L, XL" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="colors"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Colors (comma-separated)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Faded Black, Medium Wash" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="images"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URLs (comma-separated)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Add Product</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
