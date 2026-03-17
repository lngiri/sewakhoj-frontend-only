'use client';

import React from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitch, useLanguage } from '@/components/LanguageSwitch';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { language } = useLanguage();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              सेवाखोज
            </Link>
          </div>

          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="तपाईंलाई कुन सेवा चाहिन्छ?"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitch />
            
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/chat"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  {language === 'ne' ? 'सन्देश' : 'Messages'}
                </Link>
                {user.role === 'technician' ? (
                  <Link
                    href="/technician-dashboard"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    {language === 'ne' ? 'ड्यासबोर्ड' : 'Dashboard'}
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    {language === 'ne' ? 'ड्यासबोर्ड' : 'Dashboard'}
                  </Link>
                )}
                <span className="text-sm font-medium text-gray-700">
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  {language === 'ne' ? 'लगआउट' : 'Logout'}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <UserCircleIcon className="h-5 w-5" />
                <span>लगइन</span>
              </Link>
            )}
          </div>
        </div>

        <div className="md:hidden py-3">
          <div className="relative">
            <input
              type="text"
              placeholder="तपाईंलाई कुन सेवा चाहिन्छ?"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
