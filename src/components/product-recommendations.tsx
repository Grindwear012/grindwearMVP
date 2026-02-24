import { recommendProducts } from '@/ai/flows/product-recommendations-flow';
import { getProducts, getProduct } from '@/lib/products';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/product-card';

interface ProductRecommendationsProps {
  currentProduct: Product;
}

export default async function ProductRecommendations({ currentProduct }: ProductRecommendationsProps) {
  const allProducts = getProducts();
  const popularItems = allProducts
    .filter(p => p.id !== currentProduct.id)
    .slice(0, 5)
    .map(p => p.name);
  
  const availableProducts = allProducts
    .filter(p => p.id !== currentProduct.id)
    .map(p => ({ id: p.id, name: p.name }));

  try {
    const result = await recommendProducts({
      availableProducts,
      browsingHistory: [currentProduct.name],
      popularItems: popularItems,
      preferences: `Items similar to ${currentProduct.name} in the ${currentProduct.category} category.`,
    });
    
    if (!result || !result.productIds || result.productIds.length === 0) {
      return null;
    }

    const recommendedProducts = result.productIds
      .map(id => getProduct(id))
      .filter((p): p is Product => p !== undefined);

    if (recommendedProducts.length === 0) {
      return null;
    }

    return (
      <section>
        <h2 className="mb-8 text-center text-3xl font-bold">You Might Also Like</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {recommendedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    );

  } catch (error) {
    console.error("Error fetching product recommendations:", error);
    return null; // Don't render the component if the AI call fails
  }
}
