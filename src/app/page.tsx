import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/products';
import ProductCard from '@/components/product-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function HomePage() {
  const products = getProducts();
  const bestsellers = products.slice(0, 8); // Get first 8 products for the carousel

  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-model');
  const collectionMenImage = PlaceHolderImages.find(img => img.id === 'collection-men');
  const collectionWomenImage = PlaceHolderImages.find(img => img.id === 'collection-women');

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8 py-12 md:py-24">
        <div className="flex flex-col items-start space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase">
            TCP Wear
          </h1>
          <p className="max-w-md text-lg text-muted-foreground">
            Functional clothing for an active lifestyle.
          </p>
          <Button size="lg" asChild className="rounded-full px-8 py-6 text-base">
            <Link href="/products">
              TO CATALOG
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-center">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt="Model wearing modern streetwear"
              width={600}
              height={750}
              className="rounded-lg object-cover aspect-[4/5]"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
        </div>
      </section>

      {/* Summer Collection Section */}
      <section className="container mx-auto py-12 md:py-20">
         <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 h-[70vh]">
            <div className="group relative w-full h-full overflow-hidden">
                {collectionMenImage && <Image src={collectionMenImage.imageUrl} alt="Men's collection" fill className="object-cover" data-ai-hint={collectionMenImage.imageHint} />}
                <div className="absolute inset-0 bg-black/10 flex items-start justify-start p-8">
                  <ul className="text-white font-medium text-lg space-y-2">
                    <li>T-SHIRTS</li>
                    <li>HOODIES</li>
                    <li>ZIP HOODIES</li>
                    <li>SWEATSHIRTS</li>
                    <li>BOMBERS</li>
                  </ul>
                </div>
            </div>
            <div className="group relative w-full h-full overflow-hidden">
                {collectionWomenImage && <Image src={collectionWomenImage.imageUrl} alt="Women's collection" fill className="object-cover" data-ai-hint={collectionWomenImage.imageHint} />}
                <div className="absolute inset-0 bg-black/10 flex items-start justify-end p-8 text-right">
                   <ul className="text-white font-medium text-lg space-y-2">
                    <li>JOGGERS</li>
                    <li>SHORTS</li>
                    <li>PANTS</li>
                    <li>SOCKS</li>
                    <li>HATS</li>
                  </ul>
                </div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-widest uppercase drop-shadow-lg">Summer Collection</h2>
              <p className="text-white mt-2 text-lg drop-shadow-md">2026</p>
            </div>
         </div>
      </section>

      {/* Bestsellers Section */}
      <section id="bestsellers" className="container mx-auto py-12 md:py-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider">Bestsellers</h2>
          <Button variant="outline" asChild className="rounded-full px-6">
            <Link href="/products">TO CATALOG</Link>
          </Button>
        </div>
        <Carousel
          opts={{
            align: 'start',
          }}
          className="w-full -ml-4"
        >
          <CarouselContent>
            {bestsellers.map((product) => (
              <CarouselItem key={product.id} className="pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className='hidden md:block'>
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
          </div>
        </Carousel>
      </section>
    </div>
  );
}
