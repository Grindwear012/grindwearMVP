import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/products';
import ProductCard from '@/components/product-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  const products = getProducts();
  const flashSaleProducts = products.slice(0, 4);

  const promoImage = PlaceHolderImages.find(img => img.id === 'promo-banner-hoodie');
  
  const categories = [
    { name: 'Men', href: '/products?category=Men' },
    { name: 'Women', href: '/products?category=Women' },
    { name: 'Accessories', href: '/products?category=Accessories' },
  ];

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-6">

        {/* Promo Banner Section */}
        {promoImage && (
            <div className="relative mb-8 h-64 w-full rounded-xl overflow-hidden">
                <Image
                    src={promoImage.imageUrl}
                    alt="Promotional banner"
                    fill
                    className="object-cover"
                    data-ai-hint={promoImage.imageHint}
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-start justify-end p-6">
                    <h2 className="text-2xl font-bold text-white">Don't miss out -</h2>
                    <p className="text-white/90 mb-4">Save up to 50% on your favorite products.</p>
                    <Button asChild variant="secondary" size="sm">
                        <Link href="/products">Shop Now</Link>
                    </Button>
                </div>
            </div>
        )}

        {/* Popular Categories Section */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Popular Categories</h2>
          <div className="grid grid-cols-3 gap-4">
            {categories.map((category) => (
                <Link href={category.href} key={category.name}>
                    <Card className="flex items-center justify-center p-6 hover:bg-accent transition-colors">
                        <span className="font-semibold">{category.name}</span>
                    </Card>
                </Link>
            ))}
          </div>
        </section>

        {/* Flash Sale Section */}
        <section id="bestsellers">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Flash Sale</h2>
            <Link href="/products" className="text-sm font-medium text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {flashSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
