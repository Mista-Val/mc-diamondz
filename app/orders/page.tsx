'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Order = {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // In a real app, you would fetch orders from your API
        // const response = await fetch('/api/orders');
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockOrders: Order[] = [
          {
            id: 'ORD-123456',
            date: '2025-08-15',
            status: 'Shipped',
            total: 75000,
            items: [
              {
                id: '1',
                name: 'African Print Maxi Dress',
                price: 25000,
                quantity: 1,
                image: '/images/placeholder-product.jpg',
              },
              {
                id: '2',
                name: 'Handmade Beaded Necklace',
                price: 15000,
                quantity: 2,
                image: '/images/placeholder-product.jpg',
              },
            ],
          },
          {
            id: 'ORD-123455',
            date: '2025-08-10',
            status: 'Delivered',
            total: 35000,
            items: [
              {
                id: '3',
                name: 'Ankara Print Shirt',
                price: 15000,
                quantity: 1,
                image: '/images/placeholder-product.jpg',
              },
              {
                id: '4',
                name: 'African Print Headwrap',
                price: 5000,
                quantity: 1,
                image: '/images/placeholder-product.jpg',
              },
            ],
          },
        ];

        setOrders(mockOrders);
      } catch (err) {
        setError('Failed to load orders. Please try again later.');
        console.error('Error fetching orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>
          <div className="animate-pulse space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white shadow rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="space-y-4">
                  {[1, 2].map((j) => (
                    <div key={j} className="flex space-x-4">
                      <div className="h-20 w-20 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start shopping to see your orders here.
              </p>
              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Order #{order.id}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Placed on {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="border-b border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <li key={`${order.id}-${item.id}`} className="p-4 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-20 w-20 rounded-md overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          <div className="ml-6 flex-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {item.name}
                            </h4>
                            <p className="mt-1 text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              ₦{item.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      Total: ₦{order.total.toLocaleString()}
                    </p>
                    <div className="mt-2">
                      <Link
                        href={`/order-status/${order.id}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        View order details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
