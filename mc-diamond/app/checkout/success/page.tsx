import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-600" />
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Thank you for your order!
          </h1>
          <p className="mt-4 text-base text-gray-500">
            Your order #123456 has been placed and is being processed. We've sent you an email with your order confirmation and tracking information.
          </p>
          <div className="mt-10 flex justify-center space-x-6">
            <Link
              href="/orders"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View Order Status
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue Shopping
            </Link>
          </div>
          <div className="mt-10 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900">What's next?</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900">Order updates</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You'll receive shipping and delivery updates via email.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900">Need help?</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Have questions about your order?{' '}
                  <Link href="/contact" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Contact us
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
