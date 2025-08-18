export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  colors: Array<{ name: string; value: string }>;
  sizes: string[];
};

export const products: Product[] = [
  {
    id: '1',
    name: 'African Print Maxi Dress',
    price: 25000,
    image: '/images/products/dress.jpg',
    category: 'Clothing',
    rating: 4.8,
    reviewCount: 128,
    colors: [
      { name: 'Red', value: '#DC2626' },
      { name: 'Blue', value: '#2563EB' },
      { name: 'Green', value: '#059669' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: '2',
    name: 'Gold Beaded Necklace',
    price: 15000,
    image: '/images/products/necklace.jpg',
    category: 'Jewelry',
    rating: 4.6,
    reviewCount: 89,
    colors: [
      { name: 'Gold', value: '#D4AF37' },
      { name: 'Silver', value: '#C0C0C0' },
    ],
    sizes: ['One Size'],
  },
  {
    id: '3',
    name: 'Ankara Fabric (6 Yards)',
    price: 12000,
    image: '/images/products/Fabric-2.jpeg',
    category: 'Fabrics',
    rating: 4.7,
    reviewCount: 56,
    colors: [
      { name: 'Multicolor', value: 'multicolor' },
    ],
    sizes: ['6 Yards'],
  },
  {
    id: '4',
    name: 'Ankara Print Handbag',
    price: 18000,
    image: '/images/products/handbag.jpg',
    category: 'Accessories',
    rating: 4.9,
    reviewCount: 34,
    colors: [
      { name: 'Brown', value: '#964B00' },
    ],
    sizes: ['One Size'],
  },
  {
    id: '5',
    name: 'Kente Print Scarf',
    price: 12000,
    image: '/images/products/scarf.jpg',
    category: 'Accessories',
    rating: 4.5,
    reviewCount: 23,
    colors: [
      { name: 'Multicolor', value: 'multicolor' },
    ],
    sizes: ['One Size'],
  },
  {
    id: '6',
    name: 'Elegant Evening Dress',
    price: 32000,
    image: '/images/products/dress-2.jpg',
    category: 'Clothing',
    rating: 4.9,
    reviewCount: 78,
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'Navy', value: '#000080' },
    ],
    sizes: ['S', 'M', 'L'],
  },
  {
    id: '7',
    name: 'Silver Drop Necklace',
    price: 18000,
    image: '/images/products/necklace-2.jpg',
    category: 'Jewelry',
    rating: 4.7,
    reviewCount: 65,
    colors: [
      { name: 'Silver', value: '#C0C0C0' },
    ],
    sizes: ['One Size'],
  },
  {
    id: '8',
    name: 'Brazilian Hair Weave',
    price: 45000,
    image: '/images/products/hair-1.jpg',
    category: 'Hair',
    rating: 4.8,
    reviewCount: 150,
    colors: [
      { name: 'Natural Black', value: '#2C2C2C' },
      { name: 'Brown', value: '#964B00' },
    ],
    sizes: ['18 inch', '22 inch', '26 inch'],
  },
  {
    id: '9',
    name: 'Colorful Ankara Fabric',
    price: 13500,
    image: '/images/products/Fabric-1.jpeg',
    category: 'Fabrics',
    rating: 4.6,
    reviewCount: 45,
    colors: [
      { name: 'Multicolor', value: 'multicolor' },
    ],
    sizes: ['6 Yards'],
  },
];
