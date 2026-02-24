import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group">
      <Link href={`/products/${product.id}`} className="block overflow-hidden bg-muted">
        <Image
          src={product.images[0].url}
          alt={product.name}
          width={600}
          height={800}
          className="aspect-[3/4] w-full object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={product.images[0].hint}
        />
      </Link>
      <div className="mt-4">
        <p className="text-sm text-foreground">
          {product.name}
        </p>
        <p className="text-sm font-semibold text-foreground">
          R{product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
