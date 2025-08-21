'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Order = {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
};

export default function OrderStatusPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // In a real app, fetch from your API
        // const response = await fetch(`/api/orders/${params.id}`);
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockOrders = {
          'ORD-123456': {
            id: 'ORD-123456',
            date: '2025-08-15',
            status: 'Processing',
            total: 75000,
            shippingAddress: {
              name: 'John Doe',
              street: '123 Main St',
              city: 'Lagos',
              state: 'Lagos',
              zipCode: '100001',
              country: 'Nigeria',
            },
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
          'ORD-123455': {
            id: 'ORD-123455',
            date: '2025-08-10',
            status: 'Delivered',
            total: 35000,
            shippingAddress: {
              name: 'Jane Smith',
              street: '456 Oak Ave',
              city: 'Abuja',
              state: 'FCT',
              zipCode: '900001',
              country: 'Nigeria',
            },
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
        };

        const orderData = mockOrders[params.id as keyof typeof mockOrders];
        
        if (!orderData) {
          setError('Order not found');
          setIsLoading(false);
          return;
        }
        
        setOrder(orderData);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
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
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-3/4"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
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
                <p className="text-sm text-red-700">{error || 'Order not found'}</p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Orders
          </button>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">Order #{order.id}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Placed on {new Date(order.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Order Status</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <p className="ml-4 text-sm text-gray-500">
                {order.status === 'Processing' && 'Your order is being processed.'}
                {order.status === 'Shipped' && 'Your order has been shipped.'}
                {order.status === 'Delivered' && 'Your order has been delivered.'}
                {order.status === 'Cancelled' && 'Your order has been cancelled.'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Order Details</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-8">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-start">
                  <div className="flex-shrink-0 h-20 w-20 rounded-md overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-6 flex-1">
                    <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      ₦{item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="ml-4">
                    <p className="text-base font-medium text-gray-900">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Total</p>
                <p>₦{order.total.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Shipping Address</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {order.shippingAddress.name}<br />
                  {order.shippingAddress.street}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                  {order.shippingAddress.country}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {order.shippingAddress.name}<br />
                  {/* In a real app, you would have an email and phone number */}
                  customer@example.com<br />
                  +234 800 000 0000
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
