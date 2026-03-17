'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import ServiceCard from '@/components/ServiceCard';
import { LanguageProvider, useLanguage } from '@/components/LanguageSwitch';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const ServicesContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { language } = useLanguage();

  const allServices = [
    {
      id: 'electrician',
      name: 'Electrician',
      nameNe: 'इलेक्ट्रिसियन',
      icon: '⚡',
      description: 'Electrical repairs and installations',
      descriptionNe: 'विद्युतीय मर्मत र स्थापना',
      category: 'home'
    },
    {
      id: 'plumber',
      name: 'Plumber',
      nameNe: 'प्लम्बर',
      icon: '🔧',
      description: 'Plumbing repairs and installations',
      descriptionNe: 'प्लम्बिङ मर्मत र स्थापना',
      category: 'home'
    },
    {
      id: 'computer-repair',
      name: 'Computer Repair',
      nameNe: 'कम्प्युटर मर्मत',
      icon: '💻',
      description: 'Computer and laptop repair services',
      descriptionNe: 'कम्प्युटर र ल्यापटप मर्मत सेवा',
      category: 'electronics'
    },
    {
      id: 'mobile-repair',
      name: 'Mobile Repair',
      nameNe: 'मोबाइल मर्मत',
      icon: '📱',
      description: 'Mobile phone repair services',
      descriptionNe: 'मोबाइल फोन मर्मत सेवा',
      category: 'electronics'
    },
    {
      id: 'painter',
      name: 'Painter',
      nameNe: 'पेन्टर',
      icon: '🎨',
      description: 'House painting services',
      descriptionNe: 'घर पेन्टिङ सेवा',
      category: 'home'
    },
    {
      id: 'carpenter',
      name: 'Carpenter',
      nameNe: 'कारपेन्टर',
      icon: '🔨',
      description: 'Woodwork and furniture repair',
      descriptionNe: 'काठको काम र फर्निचर मर्मत',
      category: 'home'
    },
    {
      id: 'ac-repair',
      name: 'AC Repair',
      nameNe: 'AC मर्मत',
      icon: '❄️',
      description: 'Air conditioner repair and service',
      descriptionNe: 'एयर कन्डिशनर मर्मत र सेवा',
      category: 'electronics'
    },
    {
      id: 'cctv-installation',
      name: 'CCTV Installation',
      nameNe: 'CCTV स्थापना',
      icon: '📹',
      description: 'Security camera installation',
      descriptionNe: 'सुरक्षा क्यामेरा स्थापना',
      category: 'electronics'
    },
    {
      id: 'bike-mechanic',
      name: 'Bike Mechanic',
      nameNe: 'बाइक मेकानिक',
      icon: '🏍️',
      description: 'Motorcycle repair services',
      descriptionNe: 'मोटरसाइकल मर्मत सेवा',
      category: 'vehicle'
    },
    {
      id: 'house-cleaning',
      name: 'House Cleaning',
      nameNe: 'घर सफाई',
      icon: '🧹',
      description: 'Professional house cleaning services',
      descriptionNe: 'पेशेवर घर सफाई सेवा',
      category: 'home'
    },
    {
      id: 'water-filter-repair',
      name: 'Water Filter Repair',
      nameNe: 'पानी फिल्टर मर्मत',
      icon: '💧',
      description: 'Water filter repair and maintenance',
      descriptionNe: 'पानी फिल्टर मर्मत र मर्मत',
      category: 'home'
    },
    {
      id: 'solar-technician',
      name: 'Solar Technician',
      nameNe: 'सोलार टेक्निसियन',
      icon: '☀️',
      description: 'Solar panel installation and repair',
      descriptionNe: 'सौर्य प्यानल स्थापना र मर्मत',
      category: 'electronics'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Services', nameNe: 'सबै सेवाहरू' },
    { id: 'home', name: 'Home Services', nameNe: 'घरेलु सेवाहरू' },
    { id: 'electronics', name: 'Electronics', nameNe: 'इलेक्ट्रोनिक्स' },
    { id: 'vehicle', name: 'Vehicle Services', nameNe: 'वाहन सेवाहरू' }
  ];

  const filteredServices = allServices.filter(service => {
    const matchesSearch = searchTerm === '' || 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.nameNe.includes(searchTerm) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.descriptionNe.includes(searchTerm);
    
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const texts = {
    ne: {
      title: 'सबै सेवाहरू',
      searchPlaceholder: 'सेवा खोज्नुहोस्...',
      filter: 'फिल्टर गर्नुहोस्',
      noResults: 'कुनै सेवा फेला परेन',
      categories: 'श्रेणीहरू'
    },
    en: {
      title: 'All Services',
      searchPlaceholder: 'Search services...',
      filter: 'Filter',
      noResults: 'No services found',
      categories: 'Categories'
    }
  };

  const t = texts[language];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {t.title}
          </h1>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{t.categories}:</span>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {language === 'ne' ? category.nameNe : category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t.noResults}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default function ServicesPage() {
  return (
    <LanguageProvider>
      <ServicesContent />
    </LanguageProvider>
  );
}
