
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Package } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="container mx-auto py-24 text-center px-4">
      <div className="max-w-md mx-auto space-y-8">
        <div className="flex justify-center">
          <div className="bg-primary/10 p-6 rounded-full">
            <CheckCircle2 className="h-16 w-16 text-primary" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Payment Successful!</h1>
          <p className="text-muted-foreground font-medium">
            Your transformation is being processed. We've received your order and will begin curation immediately.
          </p>
        </div>

        <div className="grid gap-4 pt-8">
          <Button asChild size="lg" className="rounded-none h-14 font-bold uppercase tracking-widest">
            <Link href="/account">View Order Status</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-none h-14 font-bold uppercase tracking-widest">
            <Link href="/">Back to Shop</Link>
          </Button>
        </div>

        <div className="pt-8 border-t flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          <Package className="h-4 w-4" />
          Sustainability Delivered
        </div>
      </div>
    </div>
  );
}
