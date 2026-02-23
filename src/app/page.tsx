import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/products';
import ProductCard from '@/components/product-card';

export default function HomePage() {
  const products = getProducts();

  return (
    <div className="container mx-auto">
      <section className="py-12 text-center md:py-20">
        <h1 className="mb-4 text-4xl font-bold tracking-tighter md:text-6xl">
          Discover Unique Finds
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
          Explore our curated collection of vintage and pre-loved clothing.
          Style that's sustainable.
        </p>
        <Button asChild size="lg">
          <Link href="#products">Shop Now</Link>
        </Button>
      </section>

      <section id="products" className="py-12 md:py-20">
        <h2 className="mb-8 text-center text-3xl font-bold">Featured Items</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
