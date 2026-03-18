'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { LanguageProvider, useLanguage } from '@/components/LanguageSwitch';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

function EsewaSuccessContent() {
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
        
        if (result.success) {
          setVerified(true);
        } else {
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
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                verified ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                {verified ? (
                  <CheckCircleIcon className="w-8 h-8 text-green-600" />
                ) : (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                )}
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {verifying 
                ? (language === 'ne' ? 'पेमेन्ट प्रमाणीकरण गर्दै...' : 'Verifying Payment...')
                : verified 
                  ? (language === 'ne' ? 'पेमेन्ट सफल' : 'Payment Successful')
                  : (language === 'ne' ? 'पेमेन्ट असफल' : 'Payment Failed')
              }
            </h1>
            
            {verifying ? (
              <p className="text-gray-600">
                {language === 'ne' 
                  ? 'कृपया पेमेन्ट प्रमाणीकरण हुँदै थाहा दिनुहोस्...'
                  : 'Please wait while we verify your payment...'
                }
              </p>
            ) : (
              <>
                {error && (
                  <p className="text-red-600 mb-4">{error}</p>
                )}
                
                {verified && (
                  <>
                    <p className="text-gray-600 mb-6">
                      {language === 'ne' 
                        ? 'तपाईंको पेमेन्ट सफलतापूर्वक पूरा भयो। टेक्निसियनलाई जानकारी दिइएको छ।'
                        : 'Your payment has been successfully processed. The technician has been notified.'
                      }
                    </p>
                    
                    <div className="space-y-3">
                      <button
                        onClick={() => router.push('/user-dashboard')}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {language === 'ne' ? 'ड्यासबोर्ड हेर्नुहोस्' : 'View Dashboard'}
                      </button>
                      
                      <button
                        onClick={() => router.push('/')}
                        className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {language === 'ne' ? 'होमपेजमा जानुहोस्' : 'Go to Homepage'}
                      </button>
                    </div>
                  </>
                )}
                
                {!verified && !verifying && (
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
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function EsewaSuccessPage() {
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
        <EsewaSuccessContent />
      </Suspense>
    </LanguageProvider>
  );
}
