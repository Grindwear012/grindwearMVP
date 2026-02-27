export type Product = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  salePrice?: number;
  images: { url: string; hint: string }[];
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  sizes: string[];
  colors: string[];
};

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
  size: string;
  color: string;
};

export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    zip: string;
  };
  createdAt: any;
  updatedAt: any;
};

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
  size: string;
  color: string;
  imageUrl: string;
};
