import type { Product } from '@/lib/types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) return { url: '', hint: '' };
  return { url: image.imageUrl, hint: image.imageHint };
};

const products: Product[] = [
  {
    id: 'vintage-band-tee',
    name: 'Vintage Band Tee',
    description: 'A classic rock band tee from the 90s.',
    longDescription:
      'This authentic vintage tee features a faded graphic from a legendary 90s rock band. Made from soft, broken-in cotton, it has that perfect lived-in feel. A true collector\'s item for any music enthusiast.',
    price: 45.0,
    images: [getImage('vintage-tee-1'), getImage('vintage-tee-2')],
    category: 'Men',
    sizes: ['S', 'M', 'L'],
    colors: ['Faded Black'],
  },
  {
    id: 'classic-denim-jacket',
    name: 'Classic Denim Jacket',
    description: 'A timeless wardrobe staple.',
    longDescription:
      'This iconic denim jacket is a must-have for any season. Featuring a medium wash, button-front closure, and chest pockets, its versatile design can be dressed up or down. Crafted from durable denim that gets better with age.',
    price: 75.0,
    images: [getImage('denim-jacket-1'), getImage('denim-jacket-2')],
    category: 'Men',
    sizes: ['M', 'L', 'XL'],
    colors: ['Medium Wash'],
  },
  {
    id: 'floral-sundress',
    name: 'Floral Sundress',
    description: 'Light and airy, perfect for summer.',
    longDescription:
      'Embrace sunny days with this charming floral sundress. It features a lightweight fabric, adjustable spaghetti straps, and a flattering A-line silhouette. The vibrant floral pattern adds a touch of playful elegance.',
    price: 55.0,
    images: [getImage('floral-dress-1'), getImage('floral-dress-2')],
    category: 'Women',
    sizes: ['S', 'M'],
    colors: ['Yellow Floral'],
  },
  {
    id: 'corduroy-pants',
    name: 'Corduroy Pants',
    description: 'Retro-inspired high-waisted cords.',
    longDescription:
      'Step back in time with these stylish corduroy pants. The high-waisted fit and straight-leg cut create a flattering, elongated silhouette. The soft, ribbed corduroy fabric offers both comfort and a touch of vintage flair.',
    price: 60.0,
    images: [getImage('corduroy-pants-1')],
    category: 'Men',
    sizes: ['28', '30', '32'],
    colors: ['Brown'],
  },
  {
    id: 'plaid-flannel-shirt',
    name: 'Plaid Flannel Shirt',
    description: 'Cozy and versatile for any season.',
    longDescription:
      'A true classic, this plaid flannel shirt is perfect for layering. Made from soft, brushed cotton for maximum comfort and warmth. Features a button-up front, chest pocket, and a timeless red and black plaid pattern.',
    price: 40.0,
    images: [getImage('plaid-shirt-1')],
    category: 'Men',
    sizes: ['M', 'L', 'XL'],
    colors: ['Red Plaid'],
  },
  {
    id: 'worn-leather-boots',
    name: 'Worn Leather Boots',
    description: 'Durable boots with a story to tell.',
    longDescription:
      'These high-quality leather boots are built to last. The beautifully worn-in leather showcases a unique patina that tells a story of past adventures. With a sturdy sole and comfortable fit, they are ready for many more miles.',
    price: 120.0,
    images: [getImage('leather-boots-1')],
    category: 'Accessories',
    sizes: ['9', '10', '11'],
    colors: ['Distressed Brown'],
  },
  {
    id: 'graphic-hoodie',
    name: 'Graphic Hoodie',
    description: 'A comfortable hoodie with a unique design.',
    longDescription:
      'Stay cozy and stylish in this soft graphic hoodie. It features a relaxed fit, a spacious kangaroo pocket, and an eye-catching graphic print on the front. Perfect for casual outings or lounging at home.',
    price: 65.0,
    images: [getImage('graphic-hoodie-1')],
    category: 'Men',
    sizes: ['S', 'M', 'L'],
    colors: ['Heather Grey'],
  },
];

export function getProducts() {
  return products;
}

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}
