import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const featuredProducts = [
    {
      id: 1,
      name: 'African Print Dress',
      price: '₦25,000',
      category: 'Clothing',
      image: '/images/african-dress.jpg',
      href: '/products/african-print-dress',
    },
    {
      id: 2,
      name: 'Gold Beaded Necklace',
      price: '₦15,000',
      category: 'Jewelry',
      image: '/images/necklace.jpg',
      href: '/products/gold-beaded-necklace',
    },
    {
      id: 3,
      name: 'Ankara Fabric (6 Yards)',
      price: '₦12,000',
      category: 'Fabrics',
      image: '/images/ankara-fabric.jpg',
      href: '/products/ankara-fabric',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/hero-bg.jpg"
            alt="African fashion models"
            className="h-full w-full object-cover object-center opacity-30"
            width={1920}
            height={1080}
            priority
          />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col items-center py-32 px-6 text-center sm:py-40 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Discover African Elegance
          </h1>
          <p className="mt-6 max-w-3xl text-xl text-gray-300">
            Experience the vibrant colors and rich textures of authentic African fashion, jewelry, and accessories
            curated just for you.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/shop"
              className="rounded-md bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Shop Now
            </Link>
            <Link href="/about" className="text-base font-medium text-white hover:text-indigo-100">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Shop by Category</h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500">
              Explore our curated collection of authentic African fashion and accessories
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Jewelry', href: '/categories/jewelry', image: '/images/category-jewelry.jpg' },
              { name: 'Fabrics', href: '/categories/fabrics', image: '/images/category-fabrics.jpg' },
              { name: 'Clothing', href: '/categories/clothing', image: '/images/category-clothing.jpg' },
              { name: 'Hair', href: '/categories/hair', image: '/images/category-hair.jpg' },
            ].map((category) => (
              <div key={category.name} className="group relative">
                <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                  <Image
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover object-center"
                    width={400}
                    height={400}
                  />
                </div>
                <h3 className="mt-4 text-center text-lg font-medium text-gray-900">
                  <Link href={category.href}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {category.name}
                  </Link>
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Featured Products</h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500">
              Discover our most popular items this season
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <Image
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    width={400}
                    height={500}
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link href={product.href}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{product.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              View all products
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
              What Our Customers Say
            </h2>
            <div className="mt-16 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0">
              {[
                {
                  name: 'Adebisi Johnson',
                  role: 'Fashion Designer',
                  content:
                    'The quality of fabrics from M.C Diamondz is exceptional. Their customer service is top-notch and delivery is always on time.',
                },
                {
                  name: 'Chinwe Okonkwo',
                  role: 'Loyal Customer',
                  content:
                    'I love their jewelry collection! Every piece is unique and beautifully crafted. I get compliments everywhere I go.',
                },
                {
                  name: 'Oluwaseun Adebayo',
                  role: 'Fashion Enthusiast',
                  content:
                    'The Ankara prints are authentic and the colors are vibrant. I highly recommend M.C Diamondz for all your African fashion needs.',
                },
              ].map((testimonial) => (
                <div key={testimonial.name} className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <figure className="mt-6">
                    <blockquote className="text-lg font-semibold leading-8 text-gray-900">
                      <p>"{testimonial.content}"</p>
                    </blockquote>
                    <figcaption className="mt-6 text-base">
                      <div className="font-semibold text-indigo-600">{testimonial.name}</div>
                      <div className="mt-1 text-gray-500">{testimonial.role}</div>
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
