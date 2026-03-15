
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
import { Loader2, ShieldCheck } from 'lucide-react';
import CryptoJS from 'crypto-js';

const formSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  zip: z.string().min(4, 'A valid ZIP code is required'),
  cellNumber: z.string().optional(),
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
      cellNumber: '',
    },
  });

  const generatePayFastSignature = (data: any, passphrase?: string) => {
    let queryString = '';
    const keys = [
      'merchant_id', 'merchant_key', 'return_url', 'cancel_url', 'notify_url',
      'name_first', 'name_last', 'email_address', 'cell_number',
      'm_payment_id', 'amount', 'item_name', 'item_description'
    ];

    keys.forEach((key) => {
      if (data[key] !== undefined && data[key] !== '') {
        queryString += `${key}=${encodeURIComponent(data[key]).replace(/%20/g, '+')}&`;
      }
    });

    if (passphrase) {
      queryString += `passphrase=${encodeURIComponent(passphrase).replace(/%20/g, '+')}`;
    } else {
      queryString = queryString.substring(0, queryString.length - 1);
    }

    return CryptoJS.MD5(queryString).toString();
  };

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
      // 1. Create the Order Document Reference in Firestore
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

      // 5. Prepare PayFast Data
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const payFastData: any = {
        merchant_id: '10041936',
        merchant_key: '05rmzafvu8xfk',
        return_url: `${baseUrl}/checkout/success`,
        cancel_url: `${baseUrl}/checkout/cancel`,
        notify_url: `${baseUrl}/api/payment-notify`,
        name_first: values.firstName,
        name_last: values.lastName,
        email_address: values.email,
        cell_number: values.cellNumber || '',
        m_payment_id: orderId,
        amount: (totalPrice + 5).toFixed(2),
        item_name: `Order #${orderId.slice(-6).toUpperCase()}`,
        item_description: 'Curated Thrift Clothing',
      };

      const signature = generatePayFastSignature(payFastData, 'Thriftclothingplug');
      payFastData.signature = signature;

      // 6. Programmatically create and submit form to PayFast Sandbox
      // CRITICAL: Added target="_top" to breakout of any workstation frames
      const payForm = document.createElement('form');
      payForm.method = 'POST';
      payForm.action = 'https://sandbox.payfast.co.za/eng/process';
      payForm.target = '_top'; 

      Object.keys(payFastData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = payFastData[key];
        payForm.appendChild(input);
      });

      document.body.appendChild(payForm);
      
      // Clear cart locally before redirect
      clearCart();
      
      // Submit immediately
      payForm.submit();

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Order Failed',
        description: error.message || 'There was a problem placing your order.',
      });
      setIsSubmitting(false);
    }
  }

  if (cartItems.length === 0 && !isSubmitting) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="container mx-auto max-w-5xl py-8 md:py-12 px-4">
      <h1 className="mb-8 text-3xl font-bold tracking-tighter uppercase italic">Checkout</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        <div>
          <Card className="border-none shadow-lg bg-muted/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold uppercase tracking-tight">Shipping Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                     <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" className="bg-background rounded-none border-2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="firstName" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">First Name</FormLabel><FormControl><Input className="bg-background rounded-none border-2" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="lastName" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Last Name</FormLabel><FormControl><Input className="bg-background rounded-none border-2" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                     <FormField control={form.control} name="address" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Street Address</FormLabel><FormControl><Input className="bg-background rounded-none border-2" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <FormField control={form.control} name="city" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">City</FormLabel><FormControl><Input className="bg-background rounded-none border-2" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                       <FormField control={form.control} name="zip" render={({ field }) => (
                          <FormItem><FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">ZIP Code</FormLabel><FormControl><Input className="bg-background rounded-none border-2" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <FormField control={form.control} name="cellNumber" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cell Number (Optional)</FormLabel><FormControl><Input className="bg-background rounded-none border-2" placeholder="082 123 4567" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>

                  <div className="pt-4">
                    <Button type="submit" size="lg" className="w-full rounded-none h-14 font-bold uppercase tracking-widest" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Redirecting to Secure Payment...
                        </>
                      ) : (
                        'Secure Payment via PayFast →'
                      )}
                    </Button>
                    <p className="mt-4 flex items-center justify-center gap-2 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                      <ShieldCheck className="h-3 w-3 text-primary" />
                      256-bit SSL · Secured by PayFast
                    </p>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-tight">Your Order</h2>
           <Card className="rounded-none border-2 border-muted">
            <CardContent className="p-6 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-sm bg-muted">
                  <Image
                    src={item.product.images[0]?.url || ''}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    data-ai-hint={item.product.images[0]?.hint}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold uppercase text-sm truncate">{item.product.name}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Qty: {item.quantity} · {item.size} · {item.color}</p>
                </div>
                <p className="font-bold text-sm">R{(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
             <Separator className="bg-muted-foreground/20" />
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
              <span className="text-muted-foreground">Subtotal</span>
              <span>R{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
              <span className="text-muted-foreground">Shipping</span>
              <span>R5.00</span>
            </div>
            <Separator className="h-0.5 bg-foreground" />
            <div className="flex justify-between text-lg font-black uppercase italic tracking-tighter">
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
