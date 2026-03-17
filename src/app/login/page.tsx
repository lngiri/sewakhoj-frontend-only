'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageProvider, useLanguage } from '@/components/LanguageSwitch';
import { ArrowLeftIcon, PhoneIcon } from '@heroicons/react/24/outline';

const LoginContent: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'customer' | 'technician'>('customer');
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { language } = useLanguage();
  const { sendOTP, login } = useAuth();
  const router = useRouter();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await sendOTP(phone);
      setShowOTP(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(phone, otp, name || undefined, role);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const texts = {
    ne: {
      title: 'लगइन गर्नुहोस्',
      subtitle: 'तपाईंको फोन नम्बर प्रयोग गरेर लगइन गर्नुहोस्',
      phoneLabel: 'फोन नम्बर',
      phonePlaceholder: '+977 98XXXXXXXX',
      otpLabel: 'OTP',
      otpPlaceholder: '६ अंकको OTP',
      nameLabel: 'पूरा नाम',
      namePlaceholder: 'तपाईंको नाम',
      roleLabel: 'तपाईं को हुनुहुन्छ?',
      customer: 'ग्राहक',
      technician: 'प्रदानकर्ता',
      sendOTP: 'OTP पठाउनुहोस्',
      verifyOTP: 'पुष्टि गर्नुहोस्',
      back: 'पछाडि जानुहोस्',
      newUser: 'नयाँ प्रयोगकर्ता? नाम प्रविष्ट गर्नुहोस्',
      existingUser: 'पहिले नै खाता छ? OTP मात्र प्रविष्ट गर्नुहोस्'
    },
    en: {
      title: 'Login',
      subtitle: 'Login using your phone number',
      phoneLabel: 'Phone Number',
      phonePlaceholder: '+977 98XXXXXXXX',
      otpLabel: 'OTP',
      otpPlaceholder: '6-digit OTP',
      nameLabel: 'Full Name',
      namePlaceholder: 'Your name',
      roleLabel: 'Who are you?',
      customer: 'Customer',
      technician: 'Service Provider',
      sendOTP: 'Send OTP',
      verifyOTP: 'Verify',
      back: 'Back',
      newUser: 'New user? Please enter your name',
      existingUser: 'Already have an account? Just enter OTP'
    }
  };

  const t = texts[language];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          {language === 'ne' ? 'होमपेजमा जानुहोस्' : 'Go to Homepage'}
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
          <form className="space-y-6" onSubmit={showOTP ? handleVerifyOTP : handleSendOTP}>
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
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.phonePlaceholder}
                  className="pl-10 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  disabled={showOTP}
                />
              </div>
            </div>

            {showOTP && (
              <>
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    {t.otpLabel}
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder={t.otpPlaceholder}
                    className="mt-1 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-3">
                    {t.newUser}
                  </p>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      {t.nameLabel}
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.namePlaceholder}
                      className="mt-1 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      {t.roleLabel}
                    </label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="role"
                          value="customer"
                          checked={role === 'customer'}
                          onChange={(e) => setRole(e.target.value as 'customer' | 'technician')}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">{t.customer}</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="role"
                          value="technician"
                          checked={role === 'technician'}
                          onChange={(e) => setRole(e.target.value as 'customer' | 'technician')}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">{t.technician}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : (showOTP ? t.verifyOTP : t.sendOTP)}
              </button>
            </div>

            {showOTP && (
              <button
                type="button"
                onClick={() => setShowOTP(false)}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t.back}
              </button>
            )}
          </form>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {language === 'ne' ? 'प्रदानकर्ता बन्नुहुन्छ?' : 'Want to become a service provider?'}{' '}
              <Link
                href="/register-technician"
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                {language === 'ne' ? 'यहाँ दर्ता गर्नुहोस्' : 'Register here'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function LoginPage() {
  return (
    <LanguageProvider>
      <LoginContent />
    </LanguageProvider>
  );
}
