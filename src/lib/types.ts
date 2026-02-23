export type Product = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  images: { url: string; hint: string }[];
  category: string;
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
