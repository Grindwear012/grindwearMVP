'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProducts } from '@/lib/products';
import ProductCard from '@/components/product-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [searchTerm, setSearchTerm] = useState('');

  const products = getProducts();
  const categoryFilteredProducts = category
    ? products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      )
    : products;

  const filteredProducts = searchTerm
    ? categoryFilteredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
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
  } else {
    // A generic fallback for "All Products" or other categories
    heroImageId = 'denim-jacket-1';
  }

  const heroImage = PlaceHolderImages.find((img) => img.id === heroImageId);

  return (
    <div>
      <section className="relative h-64 w-full md:h-80">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={`${title} category`}
            fill
            className="object-cover object-center"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <h1 className="text-5xl font-bold tracking-tighter text-white md:text-7xl">
            {title}
          </h1>
        </div>
      </section>

      <div className="container mx-auto">
        <section id="products" className="py-12 md:py-20">
          <div className="mb-12 flex justify-center">
            <Input
              type="search"
              placeholder="Search our collection..."
              className="max-w-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <h2 className="mb-8 text-center text-3xl font-bold">
            {filteredProducts.length > 0
              ? `${title} Collection`
              : `No Products Found`}
          </h2>
          {filteredProducts.length > 0 ? (
            <div className="relative">
              <ScrollArea>
                <div className="flex space-x-6 pb-4">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="w-[280px] shrink-0">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              {searchTerm
                ? 'Try adjusting your search.'
                : 'Check back soon for new arrivals!'}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
