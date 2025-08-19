'use client';

import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { useState } from 'react';

type PaymentButtonProps = {
  amount: number;
  email: string;
  name: string;
  phone: string;
  onSuccess: (response: any) => void;
  onClose: () => void;
  buttonText?: string;
  disabled?: boolean;
  className?: string;
};

export default function PaymentButton({
  amount,
  email,
  name,
  phone,
  onSuccess,
  onClose,
  buttonText = 'Proceed To Payment',
  disabled = false,
  className = '',
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || '',
    tx_ref: Date.now().toString(),
    amount,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email,
      phone_number: phone,
      name,
    },
    customizations: {
      title: 'Sparkles & Styles',
      description: 'Payment for items in cart',
      logo: '/images/logo.png', // Update with your logo path
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePayment = () => {
    if (disabled) return;
    
    setIsLoading(true);
    
    handleFlutterPayment({
      callback: (response) => {
        onSuccess(response);
        closePaymentModal();
        setIsLoading(false);
      },
      onClose: () => {
        onClose();
        setIsLoading(false);
      },
    });
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || isLoading}
      className={`w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 ${
        disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''
      } ${className}`}
    >
      {isLoading ? 'Processing...' : buttonText}
    </button>
  );
}
