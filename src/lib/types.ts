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
