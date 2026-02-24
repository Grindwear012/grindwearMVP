import { getProducts } from '@/lib/products';
import ProductCard from '@/components/product-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const { category } = searchParams;

  const products = getProducts();
  const filteredProducts = category
    ? products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      )
    : products;
  
  const title = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Products';
  
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
  
  const heroImage = PlaceHolderImages.find(img => img.id === heroImageId);

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
            <h1 className="text-5xl font-bold tracking-tighter text-white md:text-7xl">{title}</h1>
        </div>
      </section>

      <div className="container mx-auto">
        <section id="products" className="py-12 md:py-20">
          <h2 className="mb-8 text-center text-3xl font-bold">
            {filteredProducts.length > 0 ? `${title} Collection` : `No ${title} Products Found`}
          </h2>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Check back soon for new arrivals!</p>
          )}
        </section>
      </div>
    </div>
  );
}
