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
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  orderDate: string;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  fulfillmentStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    suburb?: string;
    city: string;
    province?: string;
    postalCode: string;
  };
  products: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    size: string;
    color: string;
  }[];
  trackingNumber?: string;
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
