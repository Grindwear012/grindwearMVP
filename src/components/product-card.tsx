import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Badge } from './ui/badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const effectivePrice = product.salePrice ?? product.price;

  return (
    <div className="group relative">
      <Link href={`/products/${product.id}`} className="block overflow-hidden rounded-lg bg-muted">
        <Image
          src={product.images[0].url}
          alt={product.name}
          width={200}
          height={250}
          className="aspect-[4/5] w-full object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={product.images[0].hint}
        />
      </Link>
      {product.salePrice && (
        <Badge variant="destructive" className="absolute top-2 left-2">SALE</Badge>
      )}
      <div className="mt-2 p-2">
        <h3 className="text-sm font-medium text-foreground truncate">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-1">
            <p className="text-sm font-semibold text-foreground">
            R{effectivePrice.toFixed(2)}
            </p>
            {product.salePrice && (
                <p className="text-xs text-muted-foreground line-through">
                R{product.price.toFixed(2)}
                </p>
            )}
        </div>
      </div>
    </div>
  );
}
