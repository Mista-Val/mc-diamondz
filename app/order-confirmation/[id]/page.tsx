'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

type Order = {
  id: string;
  status: string;
  paymentStatus: string;
  paymentReference: string;
  total: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };
  createdAt: string;
};

export default function OrderConfirmation({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // In a real app, fetch the order from your API
        // const response = await fetch(`/api/orders/${params.id}`);
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockOrder: Order = {
          id: params.id,
          status: 'processing',
          paymentStatus: 'paid',
          paymentReference: `PAY-${Date.now()}`,
          total: 0, // This would be calculated from items in a real app
          items: [],
          shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            address: '123 Main St',
            city: 'Lagos',
            state: 'Lagos',
            postalCode: '100001',
            phone: '+2348000000000',
          },
          createdAt: new Date().toISOString(),
        };
        
        setOrder(mockOrder);
      } catch (err) {
        setError('Failed to load order details');
        console.error('Error fetching order:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
                <XMarkIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error || 'Order not found'}</p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Link
              href="/"
              className="text-base font-medium text-indigo-600 hover:text-indigo-500"
            >
              Continue Shopping<span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-indigo-700 text-white">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-400 mr-3" />
              <h1 className="text-2xl font-bold">Order Confirmed</h1>
            </div>
            <p className="mt-2 text-indigo-100">
              Thank you for your order! We've received it and it's being processed.
            </p>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Order Information</h2>
                <div className="mt-4 space-y-2 text-sm text-gray-700">
                  <p>Order Number: {order.id}</p>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p>Status: <span className="capitalize">{order.status}</span></p>
                  <p>Payment Status: <span className="capitalize">{order.paymentStatus}</span></p>
                  {order.paymentReference && (
                    <p>Payment Reference: {order.paymentReference}</p>
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">Shipping Address</h2>
                <div className="mt-4 space-y-2 text-sm text-gray-700">
                  <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.phone}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                {order.items.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <li key={item.id} className="py-4 flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No items in this order</p>
                )}
                <div className="mt-6 border-t border-gray-200 pt-4 flex justify-between">
                  <p className="text-base font-medium text-gray-900">Total</p>
                  <p className="text-base font-medium text-gray-900">
                    ₦{order.total.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <Link
                href="/products"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continue Shopping
              </Link>
              <Link
                href={`/order-status/${order.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View Order Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
