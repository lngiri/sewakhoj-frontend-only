'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { LanguageProvider, useLanguage } from '@/components/LanguageSwitch';
import { XCircleIcon } from '@heroicons/react/24/outline';

function EsewaFailedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      const transactionUuid = searchParams.get('transaction_uuid');
      
      if (!transactionUuid) {
        setError('Transaction UUID not found');
        setVerifying(false);
        return;
      }

      try {
        // Verify payment status with backend
        const response = await fetch('/api/payment/esewa/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ transaction_uuid: transactionUuid }),
        });

        const result = await response.json();
        
        if (!result.success) {
          setError(result.message || 'Payment verification failed');
        }
      } catch (error) {
        setError('Failed to verify payment');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircleIcon className="w-8 h-8 text-red-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {verifying 
                ? (language === 'ne' ? 'पेमेन्ट प्रमाणीकरण गर्दै...' : 'Verifying Payment...')
                : (language === 'ne' ? 'पेमेन्ट असफल' : 'Payment Failed')
              }
            </h1>
            
            {verifying ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {error && (
                  <p className="text-red-600 mb-4">{error}</p>
                )}
                
                <p className="text-gray-600 mb-6">
                  {language === 'ne' 
                    ? 'तपाईंको पेमेन्ट प्रक्रिया असफल भयो। कृपया पुन: प्रयास गर्नुहोस्।'
                    : 'Your payment could not be processed. Please try again.'
                  }
                </p>
              </>
            )}
            
            <div className="space-y-3">
              <button
                onClick={() => router.push('/payment')}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {language === 'ne' ? 'पुन: पेमेन्ट गर्नुहोस्' : 'Try Payment Again'}
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {language === 'ne' ? 'होमपेजमा जानुहोस्' : 'Go to Homepage'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function EsewaFailedPage() {
  return (
    <LanguageProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </main>
        </div>
      }>
        <EsewaFailedContent />
      </Suspense>
    </LanguageProvider>
  );
}
