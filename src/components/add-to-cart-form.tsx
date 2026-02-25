"use client";

import { useState } from 'react';
import type { Product } from '@/lib/types';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ShoppingCart } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AddToCartFormProps {
  product: Product;
}

const colorNameToClass = (colorName: string): string => {
  const mapping: { [key: string]: string } = {
    'Faded Black': 'bg-gray-800',
    'Medium Wash': 'bg-blue-600',
    'Yellow Floral': 'bg-yellow-400',
    'Brown': 'bg-stone-800',
    'Red Plaid': 'bg-red-700',
    'Distressed Brown': 'bg-amber-900',
    'Heather Grey': 'bg-gray-400',
    'Light Wash': 'bg-blue-400',
    'Ivory': 'bg-stone-100 border',
  };
  return mapping[colorName] || 'bg-gray-500';
};


export default function AddToCartForm({ product }: AddToCartFormProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor);
    toast({
      title: "Added to cart",
      description: `${product.name} is now in your basket.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-8">
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Size</Label>
          <RadioGroup
            value={selectedSize}
            onValueChange={setSelectedSize}
            className="mt-2 flex flex-wrap items-center gap-2"
          >
            {product.sizes.map((size) => (
              <div key={size}>
                <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                <Label
                  htmlFor={`size-${size}`}
                  className={cn(
                    'flex h-10 w-12 cursor-pointer items-center justify-center rounded-lg border text-sm font-medium uppercase transition-colors',
                    'peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground',
                    'hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  {size}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Color</Label>
           <RadioGroup
            value={selectedColor}
            onValueChange={setSelectedColor}
            className="mt-2 flex flex-wrap items-center gap-3"
          >
            {product.colors.map((color) => (
              <div key={color}>
                <RadioGroupItem value={color} id={`color-${color}`} className="peer sr-only" />
                <Label
                  htmlFor={`color-${color}`}
                  title={color}
                  className={cn(
                    'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 transition-colors',
                    colorNameToClass(color),
                    'peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary peer-data-[state=checked]:ring-offset-2'
                  )}
                />
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
      <div className="flex gap-4">
        <Button size="lg" className="w-full" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
        </Button>
        <Button size="lg" variant="outline" className="w-full">
            Buy Now
        </Button>
      </div>
    </div>
  );
}
