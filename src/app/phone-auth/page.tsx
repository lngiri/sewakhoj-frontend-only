'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LanguageProvider, useLanguage } from '@/components/LanguageSwitch';
import { PhoneIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { api } from '@/lib/api';

// Phone validation function
const validatePhoneNumber = (phone: string): { isValid: boolean; error: string } => {
  // Remove spaces for validation
  const cleanPhone = phone.replace(/\s/g, '');
  
  // Nepal format: +977 98XXXXXXXX
  const nepalPhoneRegex = /^\+97798\d{8}$/;
  
  if (!nepalPhoneRegex.test(cleanPhone)) {
    return {
      isValid: false,
      error: 'Invalid format. Use: +977 98XXXXXXXX'
    };
  }
  
  return { isValid: true, error: '' };
};

// Format phone number for display
const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit and non-plus characters
  let clean = phone.replace(/[^\d+]/g, '');
  
  // Ensure it starts with +977
  if (!clean.startsWith('+977')) {
    if (clean.startsWith('977')) {
      clean = '+' + clean;
    } else if (clean.startsWith('98')) {
      clean = '+977' + clean;
    } else {
      clean = '+977' + clean;
    }
  }
  
  return clean;
};

function PhoneAuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits, plus sign, and spaces
    const sanitized = value.replace(/[^\d+\s]/g, '');
    setPhone(sanitized);
    setError('');
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Format and validate phone
    const formattedPhone = formatPhoneNumber(phone);
    const validation = validatePhoneNumber(formattedPhone);
    
    if (!validation.isValid) {
      setError(validation.error);
      setIsLoading(false);
      return;
    }

    try {
      // Check if phone number exists in database
      const response = await api.post('/auth/check-phone', {
        phoneNumber: formattedPhone
      });

      const { exists } = response.data;

      if (exists) {
        // Phone exists → redirect to login with pre-filled phone
        router.push(`/login?phone=${encodeURIComponent(formattedPhone)}`);
      } else {
        // Phone doesn't exist → redirect to register with pre-filled phone
        router.push(`/register?phone=${encodeURIComponent(formattedPhone)}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to check phone number. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const texts = {
    ne: {
      title: 'फोन नम्बर प्रविष्ट गर्नुहोस्',
      subtitle: 'जारी राख्न आफ्नो फोन नम्बर प्रविष्ट गर्नुहोस्',
      phoneLabel: 'फोन नम्बर',
      phonePlaceholder: '+977 98XXXXXXXX',
      continue: 'जारी राख्नुहोस्',
      back: 'पछाडि जानुहोस्',
      newUser: 'नयाँ प्रयोगकर्ता हुनुहुन्छ?',
      registerHere: 'यहाँ दर्ता गर्नुहोस्',
      checking: 'जाँच गर्दै...',
    },
    en: {
      title: 'Enter Phone Number',
      subtitle: 'Enter your phone number to continue',
      phoneLabel: 'Phone Number',
      phonePlaceholder: '+977 98XXXXXXXX',
      continue: 'Continue',
      back: 'Go Back',
      newUser: 'New user?',
      registerHere: 'Register here',
      checking: 'Checking...',
    }
  };

  const t = texts[language];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          {t.back}
        </Link>
        
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          {t.title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t.subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleContinue}>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                {t.phoneLabel}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder={t.phonePlaceholder}
                  className="pl-10 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3"
                  disabled={isLoading}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {language === 'ne' ? 'उदाहरण: +977 9812345678' : 'Example: +977 9812345678'}
              </p>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t.checking}
                  </>
                ) : (
                  t.continue
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {t.newUser}{' '}
              <Link
                href="/register-technician"
                className="font-medium text-blue-600 hover:text-blue-800 underline"
              >
                {t.registerHere}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PhoneAuthPage() {
  return (
    <LanguageProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }>
        <PhoneAuthContent />
      </Suspense>
    </LanguageProvider>
  );
}
