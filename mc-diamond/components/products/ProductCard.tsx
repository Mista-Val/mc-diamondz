import Image from 'next/image';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/20/solid';
import { useCart } from '@/context/CartContext';

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  reviewCount?: number;
  colors?: Array<{ name: string; value: string }>;
  sizes?: string[];
};

export default function ProductCard({
  id,
  name,
  price,
  image,
  category,
  rating = 0,
  reviewCount = 0,
  colors = [],
  sizes = [],
}: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id,
      name,
      price,
      image,
      color: colors[0]?.name || 'Default',
      size: sizes[0] || 'One Size',
    });
  };

  return (
    <div className="group relative">
      <Link href={`/products/${id}`} className="group">
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
          <Image
            src={image}
            alt={name}
            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
            width={300}
            height={400}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm text-gray-700">
              <span aria-hidden="true" className="absolute inset-0" />
              {name}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{category}</p>
            {rating > 0 && (
              <div className="mt-1 flex items-center">
                {[0, 1, 2, 3, 4].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-4 w-4 ${
                      star < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    aria-hidden="true"
                  />
                ))}
                {reviewCount > 0 && (
                  <span className="ml-1 text-xs text-gray-500">({reviewCount})</span>
                )}
              </div>
            )}
          </div>
          <p className="text-sm font-medium text-gray-900">₦{price.toLocaleString()}</p>
        </div>
      </Link>
      <button
        onClick={handleAddToCart}
        className="mt-2 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Add to cart
      </button>
    </div>
  );
}
