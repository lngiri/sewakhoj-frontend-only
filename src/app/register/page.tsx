'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LanguageProvider, useLanguage } from '@/components/LanguageSwitch';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeftIcon, PhoneIcon, UserIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { api } from '@/lib/api';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const { login } = useAuth();
  
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'customer' | 'technician'>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Prefill phone from query params
  useEffect(() => {
    const phoneFromQuery = searchParams.get('phone');
    if (phoneFromQuery) {
      setPhone(decodeURIComponent(phoneFromQuery));
    }
  }, [searchParams]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!name.trim()) {
      setError(language === 'ne' ? 'कृपया आफ्नो नाम प्रविष्ट गर्नुहोस्' : 'Please enter your name');
      setIsLoading(false);
      return;
    }

    try {
      // Register new user without OTP
      const response = await api.post('/auth/register', {
        phoneNumber: phone,
        name: name.trim(),
        role: role
      });

      if (response.data.success) {
        // Auto login after registration
        const token = response.data.token;
        const user = response.data.user;
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect based on role
        if (role === 'technician') {
          router.push('/register-technician');
        } else {
          router.push('/');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const texts = {
    ne: {
      title: 'दर्ता गर्नुहोस्',
      subtitle: 'नयाँ खाता सिर्जना गर्नुहोस्',
      phoneLabel: 'फोन नम्बर',
      nameLabel: 'पूरा नाम',
      namePlaceholder: 'तपाईंको नाम',
      roleLabel: 'तपाईं को हुनुहुन्छ?',
      customer: 'ग्राहक',
      customerDesc: 'म सेवा खोज्दै छु',
      technician: 'प्रदानकर्ता',
      technicianDesc: 'म सेवा प्रदान गर्छु',
      register: 'दर्ता गर्नुहोस्',
      registering: 'दर्ता हुँदैछ...',
      back: 'पछाडि जानुहोस्',
      haveAccount: 'पहिले नै खाता छ?',
      loginHere: 'लगइन गर्नुहोस्',
    },
    en: {
      title: 'Register',
      subtitle: 'Create a new account',
      phoneLabel: 'Phone Number',
      nameLabel: 'Full Name',
      namePlaceholder: 'Your name',
      roleLabel: 'Who are you?',
      customer: 'Customer',
      customerDesc: 'I am looking for services',
      technician: 'Service Provider',
      technicianDesc: 'I provide services',
      register: 'Register',
      registering: 'Registering...',
      back: 'Go Back',
      haveAccount: 'Already have an account?',
      loginHere: 'Login here',
    }
  };

  const t = texts[language];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/phone-auth" className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
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
          <form className="space-y-6" onSubmit={handleRegister}>
            {/* Phone Number (read-only) */}
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
                  value={phone}
                  readOnly
                  className="pl-10 block w-full border-gray-300 rounded-md bg-gray-100 text-gray-600 sm:text-sm py-3"
                />
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                {t.nameLabel}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className="pl-10 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t.roleLabel}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    role === 'customer'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <UserIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium text-gray-900">{t.customer}</span>
                  </div>
                  <p className="text-xs text-gray-500">{t.customerDesc}</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('technician')}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    role === 'technician'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <BriefcaseIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium text-gray-900">{t.technician}</span>
                  </div>
                  <p className="text-xs text-gray-500">{t.technicianDesc}</p>
                </button>
              </div>
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
                    {t.registering}
                  </>
                ) : (
                  t.register
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {t.haveAccount}{' '}
              <Link
                href={`/login${phone ? `?phone=${encodeURIComponent(phone)}` : ''}`}
                className="font-medium text-blue-600 hover:text-blue-800 underline"
              >
                {t.loginHere}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <LanguageProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }>
        <RegisterContent />
      </Suspense>
    </LanguageProvider>
  );
}
