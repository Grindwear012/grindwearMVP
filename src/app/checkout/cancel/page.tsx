
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="container mx-auto py-24 text-center px-4">
      <div className="max-w-md mx-auto space-y-8">
        <div className="flex justify-center">
          <div className="bg-destructive/10 p-6 rounded-full">
            <XCircle className="h-16 w-16 text-destructive" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Payment Cancelled</h1>
          <p className="text-muted-foreground font-medium">
            No worries! Your order has not been processed. Your selected items are still in your cart if you'd like to try again.
          </p>
        </div>

        <div className="grid gap-4 pt-8">
          <Button asChild size="lg" className="rounded-none h-14 font-bold uppercase tracking-widest">
            <Link href="/checkout">Return to Checkout</Link>
          </Button>
          <Button asChild variant="ghost" className="font-bold uppercase tracking-widest text-xs">
            <Link href="/cart" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Modify Cart
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
