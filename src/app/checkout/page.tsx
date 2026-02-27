"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '@/hooks/use-cart';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  zip: z.string().min(5, 'A valid ZIP code is required'),
  cardName: z.string().min(1, 'Name on card is required'),
  cardNumber: z.string().length(16, 'Card number must be 16 digits'),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry date (MM/YY)'),
  cardCvc: z.string().length(3, 'CVC must be 3 digits'),
});

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || '',
      firstName: user?.displayName?.split(' ')[0] || '',
      lastName: user?.displayName?.split(' ').slice(1).join(' ') || '',
      address: '',
      city: '',
      zip: '',
      cardName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !db) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to place an order.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create the Order Document Reference
      const orderRef = doc(collection(db, 'customers', user.uid, 'orders'));
      const orderId = orderRef.id;

      // 2. Prepare Order Data
      const orderData = {
        id: orderId,
        customerId: user.uid,
        customerName: `${values.firstName} ${values.lastName}`,
        customerEmail: values.email,
        orderDate: new Date().toISOString(),
        totalAmount: totalPrice + 5, // Total + Shipping
        status: 'pending',
        shippingAddress: {
          street: values.address,
          city: values.city,
          zip: values.zip,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // 3. Save Order Document (Non-blocking)
      setDocumentNonBlocking(orderRef, orderData, { merge: true });

      // 4. Save Order Items (Non-blocking)
      cartItems.forEach((item) => {
        const itemRef = doc(collection(db, orderRef.path, 'items'));
        const itemData = {
          id: itemRef.id,
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          priceAtPurchase: item.product.price,
          size: item.size,
          color: item.color,
          imageUrl: item.product.images[0]?.url || '',
        };
        setDocumentNonBlocking(itemRef, itemData, { merge: true });
      });

      toast({
        title: 'Order Placed!',
        description: `Thank you, ${values.firstName}! Your order #${orderId.slice(-6).toUpperCase()} is being processed.`,
      });

      clearCart();
      router.push('/account');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Order Failed',
        description: error.message || 'There was a problem placing your order.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (cartItems.length === 0 && !isSubmitting) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="container mx-auto max-w-5xl py-8 md:py-12 px-4">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Shipping & Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                     <h3 className="font-semibold text-lg">Contact Information</h3>
                     <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Shipping Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="firstName" render={({ field }) => (
                          <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="lastName" render={({ field }) => (
                          <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                     <FormField control={form.control} name="address" render={({ field }) => (
                          <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <FormField control={form.control} name="city" render={({ field }) => (
                          <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                       <FormField control={form.control} name="zip" render={({ field }) => (
                          <FormItem><FormLabel>ZIP Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Payment Details</h3>
                     <FormField control={form.control} name="cardName" render={({ field }) => (
                          <FormItem><FormLabel>Name on Card</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                     <FormField control={form.control} name="cardNumber" render={({ field }) => (
                          <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input placeholder="•••• •••• •••• ••••" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <FormField control={form.control} name="cardExpiry" render={({ field }) => (
                          <FormItem><FormLabel>Expiry (MM/YY)</FormLabel><FormControl><Input placeholder="MM/YY" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                       <FormField control={form.control} name="cardCvc" render={({ field }) => (
                          <FormItem><FormLabel>CVC</FormLabel><FormControl><Input placeholder="•••" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                  </div>
                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Your Order</h2>
           <Card>
            <CardContent className="p-4 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <Image
                  src={item.product.images[0]?.url || ''}
                  alt={item.product.name}
                  width={32}
                  height={40}
                  className="aspect-[4/5] w-[32px] rounded-md object-cover"
                  data-ai-hint={item.product.images[0]?.hint}
                />
                <div className="flex-1">
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">R{(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
             <Separator />
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>R{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>R5.00</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>R{(totalPrice + 5).toFixed(2)}</span>
            </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
