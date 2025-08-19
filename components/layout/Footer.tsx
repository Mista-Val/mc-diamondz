import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const navigation = {
  shop: [
    { name: 'All Products', href: '/shop' },
    { name: 'New Arrivals', href: '/new-arrivals' },
    { name: 'Best Sellers', href: '/best-sellers' },
    { name: 'Sale', href: '/sale' },
  ],
  categories: [
    { name: 'Jewelry', href: '/categories/jewelry' },
    { name: 'Fabrics', href: '/categories/fabrics' },
    { name: 'Clothing', href: '/categories/clothing' },
    { name: 'Hair', href: '/categories/hair' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQs', href: '/faq' },
    { name: 'Shipping & Returns', href: '/shipping-returns' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
    { name: 'Refund Policy', href: '/refund-policy' },
  ],
  social: [
    {
      name: 'Facebook',
      href: '#',
      icon: FaFacebook,
      color: 'hover:text-blue-400',
    },
    {
      name: 'Instagram',
      href: '#',
      icon: FaInstagram,
      color: 'hover:text-pink-500',
    },
    {
      name: 'Twitter',
      href: '#',
      icon: FaTwitter,
      color: 'hover:text-blue-300',
    },
    {
      name: 'WhatsApp',
      href: '#',
      icon: FaWhatsapp,
      color: 'hover:text-green-400',
    },
  ],
  contact: [
    {
      text: 'info@sparkles-styles.com',
      icon: FaEnvelope,
      href: 'mailto:info@sparkles-styles.com',
    },
    {
      text: '+1 (770) 885 6749',
      icon: FaPhone,
      href: 'tel: +1 (770) 885 6749',
    },
    {
      text: '13406 Beechnut St, Houston, TX77083',
      icon: FaMapMarkerAlt,
      href: 'https://maps.google.com',
    },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-blue-900 to-blue-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-start md:justify-between lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2">
            <h3 className="text-xl font-bold text-white">Sparkles & Styles</h3>
            <p className="mt-4 text-sm text-blue-100">
              Your premier destination for African fashion, jewelry, and accessories. 
              Bringing vibrant styles to your doorstep with our exclusive blue and gold collection.
            </p>
            <div className="mt-6 flex space-x-6">
              {navigation.social.map((item) => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  className={`text-blue-200 ${item.color} transition-colors duration-200`}
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400">Shop</h3>
            <ul role="list" className="mt-4 space-y-2">
              {navigation.shop.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="text-sm text-blue-100 hover:text-gold-300 transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400">Categories</h3>
            <ul role="list" className="mt-4 space-y-2">
              {navigation.categories.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="text-sm text-blue-100 hover:text-gold-300 transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400">Company</h3>
            <ul role="list" className="mt-4 space-y-2">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="text-sm text-blue-100 hover:text-gold-300 transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="border-t border-blue-800 bg-blue-950/50">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400">Contact Us</h3>
              <ul className="space-y-2">
                {navigation.contact.map((item, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4 text-gold-400" />
                    <a 
                      href={item.href} 
                      className="text-sm text-blue-100 hover:text-gold-300 transition-colors duration-200"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 md:mt-0">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400">Legal</h3>
              <ul role="list" className="mt-4 space-y-2">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className="text-sm text-blue-100 hover:text-gold-300 transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-blue-800 pt-8 md:flex md:items-center md:justify-between">
            <p className="text-sm text-blue-200">
              &copy; {new Date().getFullYear()} Sparkles & Styles. All rights reserved.
            </p>
            <div className="mt-4 flex space-x-6 md:mt-0">
              <p className="text-sm text-blue-200">
                Made with <span className="text-gold-400">♥</span> in Africa
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
