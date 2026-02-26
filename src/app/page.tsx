'use client';

import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/product-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const db = useFirestore();
  
  const bestsellersQuery = useMemoFirebase(() => {
    return query(collection(db, 'products'), limit(6));
  }, [db]);

  const { data: bestsellers, isLoading: isBestsellersLoading } = useCollection<Product>(bestsellersQuery);

  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-model');
  const hoodieCategoryImg = PlaceHolderImages.find((img) => img.id === 'graphic-hoodie-1');
  const teeCategoryImg = PlaceHolderImages.find((img) => img.id === 'vintage-tee-1');

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
        <section id="summer-collection" className="mb-16 md:mb-12">
          <div className="text-center">
            <h2 className="text-5xl font-bold tracking-tighter text-foreground md:text-7xl uppercase">
              Summer Collection
            </h2>
          </div>
        </section>

        {/* Category Navigation Section */}
        <section className="mb-16 md:mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link 
              href="/products?category=Hoodies" 
              className="group relative h-[300px] md:h-[400px] overflow-hidden rounded-2xl bg-muted"
            >
              {hoodieCategoryImg && (
                <Image
                  src={hoodieCategoryImg.imageUrl}
                  alt="Hoodies Collection"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  data-ai-hint={hoodieCategoryImg.imageHint}
                />
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-colors group-hover:bg-black/40">
                <h3 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter italic">
                  Hoodies
                </h3>
              </div>
            </Link>

            <Link 
              href="/products?category=T-shirts" 
              className="group relative h-[300px] md:h-[400px] overflow-hidden rounded-2xl bg-muted"
            >
              {teeCategoryImg && (
                <Image
                  src={teeCategoryImg.imageUrl}
                  alt="T-shirts Collection"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  data-ai-hint={teeCategoryImg.imageHint}
                />
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-colors group-hover:bg-black/40">
                <h3 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter italic">
                  T-shirts
                </h3>
              </div>
            </Link>
          </div>
        </section>

        {/* Bestsellers Section */}
        <section id="bestsellers">
          <div className="mb-8 flex items-center justify-between border-b pb-4">
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
                <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed rounded-xl">
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
