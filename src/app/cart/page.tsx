"use client";

import { useCart } from '@/hooks/use-cart';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, ShoppingBag } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, cartCount } = useCart();

  if (cartCount === 0) {
    return (
      <div className="container mx-auto py-12 text-center md:py-24">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-6 text-3xl font-bold">Your Cart is Empty</h1>
        <p className="mt-2 text-muted-foreground">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 md:py-12">
      <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex items-center gap-4 p-4">
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      width={100}
                      height={125}
                      className="aspect-[4/5] rounded-md object-cover"
                      data-ai-hint={item.product.images[0].hint}
                    />
                    <div className="flex-1">
                      <Link href={`/products/${item.product.id}`} className="font-semibold hover:underline">
                        {item.product.name}
                      </Link>
                      <div className="text-sm text-muted-foreground">
                        <p>Size: {item.size}</p>
                        <p>Color: {item.color}</p>
                      </div>
                      <p className="mt-1 font-medium md:hidden">${item.product.price.toFixed(2)}</p>
                    </div>
                    <div className="hidden items-center gap-4 md:flex">
                       <p className="w-20 font-medium">${item.product.price.toFixed(2)}</p>
                       <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value))
                        }
                        className="w-16 text-center"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-5 w-5 text-muted-foreground" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>$5.00</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${(totalPrice + 5).toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild size="lg" className="w-full">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
