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
import { Badge } from '@/components/ui/badge';

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

  return (
    <div className="container mx-auto py-8 md:py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((image, index) => (
                <CarouselItem key={index}>
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <Image
                        src={image.url}
                        alt={`${product.name} - view ${index + 1}`}
                        width={800}
                        height={1000}
                        className="aspect-[4/5] w-full object-cover"
                        data-ai-hint={image.hint}
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        <div className="flex flex-col">
          <Badge variant="secondary" className="w-fit">{product.category}</Badge>
          <h1 className="mt-2 text-3xl font-bold tracking-tight lg:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-3xl font-semibold">${product.price.toFixed(2)}</p>
          <Separator className="my-6" />
          <p className="text-base text-muted-foreground">
            {product.longDescription}
          </p>
          
          <div className="mt-8">
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
