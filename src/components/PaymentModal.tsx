'use client';

import React, { useState } from 'react';
import { 
  CreditCardIcon,
  BanknotesIcon,
  QrCodeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  amount: number;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  amount,
  onPaymentSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'esewa' | 'khalti' | 'cash' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (selectedMethod === 'cash') {
        // Handle cash payment confirmation
        const response = await fetch('/api/payments/cash/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            jobId,
            amount,
            confirmedBy: 'customer'
          })
        });

        if (response.ok) {
          onPaymentSuccess();
          onClose();
        } else {
          const data = await response.json();
          setError(data.message || 'Payment failed');
        }
      } else {
        // Handle digital payments (eSewa, Khalti)
        const endpoint = selectedMethod === 'esewa' 
          ? '/api/payments/esewa/initiate' 
          : '/api/payments/khalti/initiate';

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            jobId,
            amount
          })
        });

        const data = await response.json();

        if (response.ok) {
          if (selectedMethod === 'esewa') {
            // Redirect to eSewa payment page
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = data.paymentUrl;
            
            Object.entries(data.formData).forEach(([key, value]) => {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = value as string;
              form.appendChild(input);
            });
            
            document.body.appendChild(form);
            form.submit();
          } else {
            // For Khalti, in production you would redirect to their payment URL
            // For now, we'll show a success message
            onPaymentSuccess();
            onClose();
          }
        } else {
          setError(data.message || 'Payment initiation failed');
        }
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    {
      id: 'esewa',
      name: 'eSewa',
      description: 'Pay with eSewa wallet',
      icon: '💳',
      color: 'bg-purple-600'
    },
    {
      id: 'khalti',
      name: 'Khalti',
      description: 'Pay with Khalti wallet',
      icon: '📱',
      color: 'bg-green-600'
    },
    {
      id: 'cash',
      name: 'Cash',
      description: 'Pay cash to technician',
      icon: '💵',
      color: 'bg-blue-600'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Complete Payment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Job Details */}
        <div className="p-6 border-b">
          <h3 className="font-medium text-gray-900 mb-2">{jobTitle}</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Amount to pay:</span>
            <span className="text-2xl font-bold text-gray-900">रु.{amount}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-6">
          <h3 className="font-medium text-gray-900 mb-4">Select Payment Method</h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={(e) => setSelectedMethod(e.target.value as any)}
                  className="sr-only"
                />
                <div className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${method.color}`}>
                    <span className="text-xl">{method.icon}</span>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{method.name}</p>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedMethod === method.id && (
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-6 pb-4">
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-6 border-t flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={loading || !selectedMethod}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
