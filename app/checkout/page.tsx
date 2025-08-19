'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { LockClosedIcon, ShieldCheckIcon, TruckIcon } from '@heroicons/react/24/outline';
import PaymentButton from '@/components/PaymentButton';

const CheckoutPage = () => {
  const router = useRouter();
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria',
    paymentMethod: 'card',
    saveInfo: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePaymentSuccess = async (response: any) => {
    // Handle successful payment
    console.log('Payment successful:', response);
    
    // Submit the form data to your backend
    try {
      const result = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          paymentReference: response.transaction_id || response.tx_ref,
          paymentStatus: 'paid',
          items: items.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      const order = await result.json();
      
      // Redirect to order confirmation page
      router.push(`/order-confirmation/${order.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      // Handle error - show error message to user
    }
  };

  const handlePaymentClose = () => {
    // Handle when user closes the payment modal
    console.log('Payment modal closed');
  };

  if (items.length === 0) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Your cart is empty
            </h1>
            <p className="mt-4 text-base text-gray-500">
              Looks like you haven't added anything to your cart yet.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => router.push('/shop')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Checkout</h2>
          
          <form className="mt-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Contact information</h3>
                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone number
                  </label>
                  <div className="mt-1">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <h3 className="text-lg font-medium text-gray-900">Shipping address</h3>
                <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="address"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State/Province
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="state"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                      ZIP / Postal code
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        required
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <div className="mt-1">
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option>Nigeria</option>
                        <option>Ghana</option>
                        <option>South Africa</option>
                        <option>Kenya</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <h3 className="text-lg font-medium text-gray-900">Payment</h3>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <input
                      id="card"
                      name="paymentMethod"
                      type="radio"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="card" className="ml-3 block text-sm font-medium text-gray-700">
                      Credit / Debit card
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="bank-transfer"
                      name="paymentMethod"
                      type="radio"
                      value="bank-transfer"
                      checked={formData.paymentMethod === 'bank-transfer'}
                      onChange={handleInputChange}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="bank-transfer" className="ml-3 block text-sm font-medium text-gray-700">
                      Bank Transfer
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="pay-on-delivery"
                      name="paymentMethod"
                      type="radio"
                      value="pay-on-delivery"
                      checked={formData.paymentMethod === 'pay-on-delivery'}
                      onChange={handleInputChange}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="pay-on-delivery" className="ml-3 block text-sm font-medium text-gray-700">
                      Pay on Delivery
                    </label>
                  </div>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                        Card number
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="card-number"
                          name="card-number"
                          placeholder="0000 0000 0000 0000"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">
                          Expiration date (MM/YY)
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="expiration-date"
                            name="expiration-date"
                            placeholder="MM / YY"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                          CVV
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            placeholder="•••"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex items-center">
                  <input
                    id="save-info"
                    name="saveInfo"
                    type="checkbox"
                    checked={formData.saveInfo}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="save-info" className="ml-2 block text-sm text-gray-900">
                    Save this information for next time
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <PaymentButton
                amount={total * 100} // Convert to kobo
                email={formData.email}
                name={`${formData.firstName} ${formData.lastName}`}
                phone={formData.phone}
                onSuccess={handlePaymentSuccess}
                onClose={handlePaymentClose}
                disabled={items.length === 0 || isLoading}
                buttonText={isLoading ? 'Processing...' : 'Proceed To Payment'}
                className="w-full"
              />
            </div>
          </form>
        </div>

        <div className="mt-10 lg:mt-0">
          <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

          <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <h3 className="sr-only">Items in your cart</h3>
            <ul role="list" className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={`${item.id}-${item.color}-${item.size}`} className="flex px-4 py-6 sm:px-6">
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 rounded-md"
                    />
                  </div>

                  <div className="ml-6 flex flex-1 flex-col">
                    <div className="flex">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm">
                          <a href="#" className="font-medium text-gray-700 hover:text-gray-800">
                            {item.name}
                          </a>
                        </h4>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.color} / {item.size}
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          ₦{item.price.toLocaleString()} x {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
              <div className="flex items-center justify-between">
                <dt className="text-sm">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">₦{subtotal.toLocaleString()}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm">Shipping</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {shipping === 0 ? 'Free' : `₦${shipping.toLocaleString()}`}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <dt className="text-base font-medium">Total</dt>
                <dd className="text-base font-medium text-gray-900">₦{total.toLocaleString()}</dd>
              </div>
            </dl>

            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
              <div className="flex items-center space-x-2">
                <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                <span className="text-sm text-gray-500">Secure checkout</span>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <ShieldCheckIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                <span className="text-sm text-gray-500">Guaranteed safe checkout</span>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <TruckIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                <span className="text-sm text-gray-500">Fast & reliable delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
