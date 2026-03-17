'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { LanguageProvider, useLanguage } from '@/components/LanguageSwitch';
import { XCircleIcon } from '@heroicons/react/24/outline';

const EsewaFailedPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      const transactionUuid = searchParams.get('transaction_uuid');
      
      if (!transactionUuid) {
        setError('Transaction ID not found');
        setVerifying(false);
        return;
      }

      try {
        const response = await fetch(`/api/payments/esewa/verify?transaction_uuid=${transactionUuid}&status=failed`);
        const data = await response.json();

        if (!data.success) {
          setError(data.message || 'Payment was cancelled or failed');
        } else {
          // This shouldn't happen, but handle it
          router.push('/payment/esewa/success');
        }
      } catch (err) {
        setError('Failed to verify payment status');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  const texts = {
    ne: {
      title: 'भुक्तानी असफल',
      verifying: 'भुक्तानी स्थिति जाँच गरिँदै...',
      paymentFailed: 'तपाईंको भुक्तानी रद्द गरियो वा असफल भयो',
      tryAgain: 'पुन: प्रयास गर्नुहोस्',
      backToDashboard: 'ड्यासबोर्डमा जानुहोस्'
    },
    en: {
      title: 'Payment Failed',
      verifying: 'Checking payment status...',
      paymentFailed: 'Your payment was cancelled or failed',
      tryAgain: 'Try Again',
      backToDashboard: 'Go to Dashboard'
    }
  };

  const t = texts[language];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          {verifying ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {t.verifying}
              </h2>
            </div>
          ) : (
            <div className="text-center">
              <XCircleIcon className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {t.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {error}
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => router.back()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {t.tryAgain}
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  {t.backToDashboard}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default function EsewaFailedPage() {
  return (
    <LanguageProvider>
      <EsewaFailedPage />
    </LanguageProvider>
  );
}
