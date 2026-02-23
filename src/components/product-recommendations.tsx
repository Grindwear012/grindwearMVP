import { recommendProducts } from '@/ai/flows/product-recommendations-flow';
import { getProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Sparkles } from 'lucide-react';

interface ProductRecommendationsProps {
  currentProduct: Product;
}

export default async function ProductRecommendations({ currentProduct }: ProductRecommendationsProps) {
  const popularItems = getProducts()
    .filter(p => p.id !== currentProduct.id)
    .slice(0, 5)
    .map(p => p.name);

  try {
    const result = await recommendProducts({
      browsingHistory: [currentProduct.name],
      popularItems: popularItems,
      preferences: `Items similar to ${currentProduct.name} in the ${currentProduct.category} category.`,
    });
    
    if (!result || result.recommendations.length === 0) {
      return null;
    }

    return (
      <Card className="bg-accent/50 border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span>Recommended For You</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            {result.recommendations.map((rec, index) => (
              <li key={index} className="text-sm">{rec}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );

  } catch (error) {
    console.error("Error fetching product recommendations:", error);
    return null; // Don't render the component if the AI call fails
  }
}
