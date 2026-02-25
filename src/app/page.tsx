'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/products';
import ProductCard from '@/components/product-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function HomePage() {
  const products = getProducts();
  const flashSaleProducts = products.slice(0, 6);
  const summerCollection = products.slice(6, 9);

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
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-center">
            <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-6xl md:text-7xl">
              Sustainable Style
            </h1>
            <p className="mt-4 max-w-md text-lg text-white/90">
              Discover unique, pre-loved pieces and redefine your wardrobe.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Summer Collection Section */}
        <section id="summer-collection" className="mb-16 md:mb-24">
          <div className="relative mb-8 text-center">
            <h2
              className="relative z-10 inline-block bg-background px-4 text-5xl font-bold tracking-tighter text-foreground drop-shadow-lg md:text-6xl"
              style={{ top: '2.5rem' }}
            >
              Summer Collection
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {summerCollection.map((product, index) => (
              <div
                key={product.id}
                className={`flex items-end ${index === 1 ? 'md:mt-12' : ''}`}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        {/* Flash Sale Section */}
        <section id="bestsellers">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Bestsellers
            </h2>
            <Link
              href="/products"
              className="text-sm font-medium text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {flashSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
