import { getProduct, getProducts } from '@/lib/products';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AddToCartForm from '@/components/add-to-cart-form';
import ProductRecommendations from '@/components/product-recommendations';
import { Logo } from '@/components/logo';

export async function generateStaticParams() {
  const products = getProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id);

  if (!product) {
    notFound();
  }

  const effectivePrice = product.salePrice ?? product.price;

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
        <div className="md:col-span-1">
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((image, index) => (
                <CarouselItem key={index}>
                    <Image
                      src={image.url}
                      alt={`${product.name} - view ${index + 1}`}
                      width={200}
                      height={250}
                      className="aspect-[4/5] w-full object-cover rounded-xl"
                      data-ai-hint={image.hint}
                    />
                </CarouselItem>
              ))}
            </CarouselContent>
            {product.images.length > 1 && (
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
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
            {product.name}
          </h1>

          <Separator className="my-5" />

          <p className="text-base leading-relaxed text-muted-foreground">
            {product.longDescription}
          </p>
          
          <div className="mt-auto pt-8">
            <div className="flex items-baseline gap-2 mb-5">
                <span className="text-3xl font-bold">R{effectivePrice.toFixed(2)}</span>
                {product.salePrice && (
                    <span className="text-lg text-muted-foreground line-through">R{product.price.toFixed(2)}</span>
                )}
            </div>
            <AddToCartForm product={product} />
          </div>
        </div>
      </div>
      
      <div className="mt-16 md:mt-24">
        <ProductRecommendations currentProduct={product} />
      </div>
    </div>
  );
}
