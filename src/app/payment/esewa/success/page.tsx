'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { LanguageProvider, useLanguage } from '@/components/LanguageSwitch';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const EsewaSuccessPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
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
        const response = await fetch(`/api/payments/esewa/verify?transaction_uuid=${transactionUuid}`);
        const data = await response.json();

        if (data.success) {
          setVerified(true);
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        } else {
          setError(data.message || 'Payment verification failed');
        }
      } catch (err) {
        setError('Failed to verify payment');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  const texts = {
    ne: {
      title: 'भुक्तानी सफल',
      verifying: 'भुक्तानी प्रमाणित गरिँदैछ...',
      verified: 'तपाईंको भुक्तानी सफलतापूर्वक पूरा भयो!',
      redirecting: 'ड्यासबोर्डमा रिडाइरेक्ट गरिँदै...',
      error: 'भुक्तानी प्रमाणीकरण असफल',
      backToDashboard: 'ड्यासबोर्डमा जानुहोस्'
    },
    en: {
      title: 'Payment Successful',
      verifying: 'Verifying payment...',
      verified: 'Your payment was completed successfully!',
      redirecting: 'Redirecting to dashboard...',
      error: 'Payment verification failed',
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
          ) : verified ? (
            <div className="text-center">
              <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {t.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {t.verified}
              </p>
              <p className="text-sm text-gray-500">
                {t.redirecting}
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {t.error}
              </h2>
              <p className="text-gray-600 mb-4">
                {error}
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {t.backToDashboard}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default function EsewaSuccessPage() {
  return (
    <LanguageProvider>
      <EsewaSuccessPage />
    </LanguageProvider>
  );
}
