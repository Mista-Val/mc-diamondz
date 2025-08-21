'use client';

import { useEffect, useState } from 'react';
import { loadScript } from '@paypal/paypal-js';

type PayPalButtonProps = {
  amount: number;
  currency?: string;
  onSuccess: (details: any) => Promise<void>;
  onError: (error: any) => void;
  disabled?: boolean;
};

export default function PayPalButton({ 
  amount, 
  currency = 'USD',
  onSuccess,
  onError,
  disabled = false
}: PayPalButtonProps) {
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paypalError, setPaypalError] = useState<string | null>(null);

  useEffect(() => {
    const loadPaypal = async () => {
      try {
        await loadScript({ 
          'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
          currency,
          'disable-funding': 'card',
          'data-sdk-integration-source': 'integrationbuilder_sc'
        });
        setPaypalLoaded(true);
      } catch (error) {
        console.error('Failed to load PayPal SDK', error);
        setPaypalError('Failed to load payment options. Please try again.');
        onError(error);
      }
    };

    loadPaypal();
  }, [currency, onError]);

  useEffect(() => {
    if (!paypalLoaded || !window.paypal) return;

    try {
      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'pay',
          height: 48,
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount.toString(),
                currency_code: currency,
              },
            }],
          });
        },
        onApprove: async (data: any, actions: any) => {
          try {
            const details = await actions.order.capture();
            await onSuccess(details);
          } catch (err) {
            console.error('PayPal payment error:', err);
            onError(err);
          }
        },
        onError: (err: any) => {
          console.error('PayPal error:', err);
          setPaypalError('An error occurred with PayPal. Please try another payment method.');
          onError(err);
        },
      }).render('#paypal-button-container');
    } catch (err) {
      console.error('Error initializing PayPal button:', err);
      setPaypalError('Failed to initialize payment. Please try again.');
      onError(err);
    }
  }, [paypalLoaded, amount, currency, onSuccess, onError]);

  if (paypalError) {
    return (
      <div className="text-red-600 text-sm mt-2">
        {paypalError}
      </div>
    );
  }

  if (!paypalLoaded) {
    return (
      <div className="flex justify-center items-center h-12 bg-gray-100 rounded-md">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div id="paypal-button-container" className={`${disabled ? 'opacity-50 pointer-events-none' : ''}`} />
      {disabled && (
        <p className="text-sm text-gray-500 mt-2">
          Please fill in all required shipping and billing information first.
        </p>
      )}
    </div>
  );
}
