'use client';

import React from 'react';
import Header from '@/components/Header';
import ServiceCard from '@/components/ServiceCard';
import { LanguageProvider } from '@/components/LanguageSwitch';
import { SparklesIcon, CheckCircleIcon, StarIcon } from '@heroicons/react/24/outline';

const services = [
  {
    id: 'electrician',
    name: 'Electrician',
    nameNe: 'इलेक्ट्रिसियन',
    icon: '⚡',
    description: 'Electrical repairs and installations',
    descriptionNe: 'विद्युतीय मर्मत र स्थापना',
  },
  {
    id: 'plumber',
    name: 'Plumber',
    nameNe: 'प्लम्बर',
    icon: '🔧',
    description: 'Plumbing repairs and installations',
    descriptionNe: 'प्लम्बिङ मर्मत र स्थापना',
  },
  {
    id: 'computer-repair',
    name: 'Computer Repair',
    nameNe: 'कम्प्युटर मर्मत',
    icon: '💻',
    description: 'Computer and laptop repair services',
    descriptionNe: 'कम्प्युटर र ल्यापटप मर्मत सेवा',
  },
  {
    id: 'mobile-repair',
    name: 'Mobile Repair',
    nameNe: 'मोबाइल मर्मत',
    icon: '📱',
    description: 'Mobile phone repair services',
    descriptionNe: 'मोबाइल फोन मर्मत सेवा',
  },
  {
    id: 'painter',
    name: 'Painter',
    nameNe: 'पेन्टर',
    icon: '🎨',
    description: 'House painting services',
    descriptionNe: 'घर पेन्टिङ सेवा',
  },
  {
    id: 'carpenter',
    name: 'Carpenter',
    nameNe: 'कारपेन्टर',
    icon: '🔨',
    description: 'Woodwork and furniture repair',
    descriptionNe: 'काठको काम र फर्निचर मर्मत',
  },
];

export default function Home() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <section className="text-center py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              नेपालको सबैभन्दा ठूलो सेवा बजार
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              तपाईंको आवश्यकता अनुसारको सेवा प्रदानकर्ताहरू फेला पार्नुहोस्
            </p>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="तपाईंलाई कुन सेवा चाहिन्छ?"
                  className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                  खोज्नुहोस्
                </button>
              </div>
            </div>
          </section>

          {/* Services Grid */}
          <section className="py-12">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              लोकप्रिय सेवाहरू
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {services.map((service) => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section className="py-12 bg-white rounded-lg">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              कसरी काम गर्छ?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SparklesIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">सेवा छान्नुहोस्</h3>
                <p className="text-gray-600">
                  तपाईंलाई आवश्यक सेवा छान्नुहोस् र तपाईंको स्थान प्रविष्ट गर्नुहोस्
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">प्रदानकर्ता फेला पार्नुहोस्</h3>
                <p className="text-gray-600">
                  तपाईंको क्षेत्रका रेटिंग भएका प्रदानकर्ताहरू फेला पार्नुहोस्
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <StarIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">सेवा पाउनुहोस्</h3>
                <p className="text-gray-600">
                  प्रदानकर्तासँग सम्पर्कमा रहेर गुणस्तरीय सेवा पाउनुहोस्
                </p>
              </div>
            </div>
          </section>

          {/* Featured Technicians */}
          <section className="py-12">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              विशेष प्रदानकर्ताहरू
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                    <div>
                      <h3 className="font-semibold">प्रदानकर्ता {i}</h3>
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">4.8 (25 समीक्षाहरू)</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    विद्युतीय मर्मत, प्लम्बिङ, र AC सेवामा विशेषज्ञ
                  </p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>काठमाडौं</span>
                    <span>५ वर्ष अनुभव</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </LanguageProvider>
  );
}
