'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import AddToCartForm from '@/components/add-to-cart-form';
import { Logo } from '@/components/logo';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const db = useFirestore();
  
  const productRef = useMemoFirebase(() => {
    if (!db || !id) return null;
    return doc(db, 'products', id);
  }, [db, id]);

  const { data: product, isLoading } = useDoc<Product>(productRef);

  if (isLoading) {
    return (
      <div className="container mx-auto flex h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-24 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="text-muted-foreground mt-2">The item you are looking for may have been sold or removed.</p>
      </div>
    );
  }

  const effectivePrice = product.price;

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
        <div className="md:col-span-1">
          <Carousel className="w-full">
            <CarouselContent>
              {product.images?.map((image, index) => (
                <CarouselItem key={index}>
                    <Image
                      src={image.url}
                      alt={`${product.name} - view ${index + 1}`}
                      width={400}
                      height={500}
                      className="aspect-[4/5] w-full object-cover rounded-xl"
                      data-ai-hint={image.hint}
                    />
                </CarouselItem>
              ))}
              {(!product.images || product.images.length === 0) && (
                <CarouselItem>
                  <div className="aspect-[4/5] flex items-center justify-center bg-muted rounded-xl">
                    <p className="text-muted-foreground">No images available</p>
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            {product.images?.length > 1 && (
                <>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                </>
            )}
          </Carousel>
        </div>

        <div className="flex flex-col pt-2 md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <Logo className="h-6 w-6 rounded-full" />
            <span className="font-semibold text-sm">{product.brand}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl uppercase">
            {product.name}
          </h1>

          <Separator className="my-5" />

          <p className="text-base leading-relaxed text-muted-foreground">
            {product.longDescription}
          </p>
          
          <div className="mt-auto pt-8">
            <div className="flex items-baseline gap-2 mb-5">
                <span className="text-3xl font-bold">R{effectivePrice.toFixed(2)}</span>
            </div>
            <AddToCartForm product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
