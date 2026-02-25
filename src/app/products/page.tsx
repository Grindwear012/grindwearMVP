import { Suspense } from 'react';
import ProductsPageContent from '@/components/products-page-content';

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-12 text-center">Loading products...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
