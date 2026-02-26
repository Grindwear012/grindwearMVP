'use client';

import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/product-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function HomePage() {
  const db = useFirestore();
  
  const bestsellersQuery = useMemoFirebase(() => {
    return query(collection(db, 'products'), limit(6));
  }, [db]);
  
  const summerCollectionQuery = useMemoFirebase(() => {
    // For now just getting another set of products
    return query(collection(db, 'products'), limit(10));
  }, [db]);

  const { data: bestsellers, isLoading: isBestsellersLoading } = useCollection<Product>(bestsellersQuery);
  const { data: summerCollection, isLoading: isSummerLoading } = useCollection<Product>(summerCollectionQuery);

  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-model');

  return (
    <div className="bg-background">
      {/* Hero Section */}
      {heroImage && (
        <div className="relative h-[50vh] w-full bg-muted md:h-[calc(100vh-80px)]">
          <Image
            src={heroImage.imageUrl}
            alt="Model wearing thrifted clothes"
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Summer Collection Section */}
        <section id="summer-collection" className="mb-16 md:mb-24">
          <div className="mb-12 text-center">
            <h2 className="text-5xl font-bold tracking-tighter text-foreground md:text-6xl uppercase">
              Summer Collection
            </h2>
          </div>
          
          {isSummerLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="relative">
              <ScrollArea className="w-full">
                <div className="flex space-x-6 pb-6">
                  {summerCollection?.map((product) => (
                    <div
                      key={product.id}
                      className="w-[260px] md:w-[320px] shrink-0"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                  {(!summerCollection || summerCollection.length === 0) && (
                    <div className="w-full text-center py-12 text-muted-foreground">
                      Check back soon for our new collection.
                    </div>
                  )}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          )}
        </section>

        {/* Bestsellers Section */}
        <section id="bestsellers">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl uppercase">
              Bestsellers
            </h2>
            <Link
              href="/products"
              className="text-sm font-medium text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          
          {isBestsellersLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {bestsellers?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {(!bestsellers || bestsellers.length === 0) && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No bestsellers available at the moment.
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
