export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageSrc: string;
  category: string;
  inStock: boolean;
  rating?: number;
  reviews?: number;
  colors?: string[];
  sizes?: string[];
}
