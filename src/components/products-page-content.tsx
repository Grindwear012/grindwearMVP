'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { Loader2, Search as SearchIcon } from 'lucide-react';

export default function ProductsPageContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [searchTerm, setSearchTerm] = useState('');

  const db = useFirestore();
  const productsRef = useMemoFirebase(() => collection(db, 'products'), [db]);
  const { data: products, isLoading } = useCollection<Product>(productsRef);

  const categoryFilteredProducts = category && products
    ? products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      )
    : (products || []);

  const filteredProducts = searchTerm
    ? categoryFilteredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : categoryFilteredProducts;

  const title = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : 'All Products';

  let heroImageId: string;
  const categoryLower = category?.toLowerCase();

  if (categoryLower === 'men') {
    heroImageId = 'men-category-hero';
  } else if (categoryLower === 'women') {
    heroImageId = 'women-category-hero';
  } else if (categoryLower === 'accessories') {
    heroImageId = 'accessories-category-hero';
  } else if (categoryLower === 'hoodies') {
    heroImageId = 'graphic-hoodie-1';
  } else if (categoryLower === 't-shirts') {
    heroImageId = 'vintage-tee-1';
  } else {
    heroImageId = 'denim-jacket-1';
  }

  const heroImage = PlaceHolderImages.find((img) => img.id === heroImageId);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Category Hero */}
      <section className="relative h-[25vh] w-full md:h-[35vh]">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={`${title} category`}
            fill
            className="object-cover object-center brightness-75"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-5xl font-bold tracking-tighter md:text-8xl uppercase italic">
            {title}
          </h1>
          <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] opacity-80">
            Curated Transformation
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Search & Filter Bar */}
        <div className="sticky top-16 z-30 -mx-4 bg-background/95 px-4 py-6 backdrop-blur-md md:static md:bg-transparent md:backdrop-blur-none">
          <div className="relative mx-auto max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={`Search in ${title}...`}
              className="pl-10 h-12 rounded-full border-2 bg-muted/50 focus:bg-background transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <section id="products" className="py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="mb-8 flex items-baseline justify-between border-b pb-4">
                <h2 className="text-xl font-bold uppercase tracking-tight">
                  {filteredProducts.length} Items
                </h2>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  Sort: Newest First
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="mb-4 rounded-full bg-muted p-6">
                    <SearchIcon className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold uppercase">No Results Found</h3>
                  <p className="mt-2 max-w-xs text-muted-foreground">
                    {searchTerm
                      ? `We couldn't find any products matching "${searchTerm}". Try a different term or clear the search.`
                      : `The ${title} collection is currently being refreshed. Check back soon for the next drop.`}
                  </p>
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="mt-6 text-sm font-bold underline uppercase tracking-widest hover:text-primary"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
