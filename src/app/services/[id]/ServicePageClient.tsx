'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import TechnicianCard from '@/components/TechnicianCard';
import { LanguageProvider, useLanguage } from '@/components/LanguageSwitch';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { api } from '@/lib/api';

interface Service {
  _id: string;
  name: string;
  nameNe: string;
  icon: string;
  description: string;
  descriptionNe: string;
}

interface Technician {
  _id: string;
  name: string;
  email: string;
  phone: string;
  services: string[];
  experience: number;
  rating: number;
  totalJobs: number;
  isAvailable: boolean;
  location: string;
  bio?: string;
}

interface ServicePageClientProps {
  serviceId: string;
}

export default function ServicePageClient({ serviceId }: ServicePageClientProps) {
  const router = useRouter();
  const { language } = useLanguage();
  
  const [service, setService] = useState<Service | null>(null);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchService();
    fetchTechnicians();
  }, [serviceId]);

  const fetchService = async () => {
    try {
      const response = await api.get(`/services/${serviceId}`);
      setService(response.data);
    } catch (error) {
      console.error('Error fetching service:', error);
    }
  };

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/technicians/service/${serviceId}`);
      setTechnicians(response.data);
    } catch (error) {
      console.error('Error fetching technicians:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTechnicians = technicians.filter(technician =>
    technician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    technician.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!service) {
    return (
      <LanguageProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'ne' ? 'सेवा फेला परेन' : 'Service Not Found'}
              </h1>
            </div>
          </main>
        </div>
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Service Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{service.icon}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {language === 'ne' ? service.nameNe : service.name}
                </h1>
                <p className="text-gray-600 mt-2">
                  {language === 'ne' ? service.descriptionNe : service.description}
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={language === 'ne' ? 'टेक्निसियनहरू खोज्नुहोस्...' : 'Search technicians...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Technicians List */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'ne' ? 'उपलब्ध टेक्निसियनहरू' : 'Available Technicians'}
            </h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">
                  {language === 'ne' ? 'लोड हुँदैछ...' : 'Loading...'}
                </p>
              </div>
            ) : filteredTechnicians.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {language === 'ne' ? 'कुनै टेक्निसियन फेला परेन' : 'No technicians found'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ne' ? 'कृपया पछि फेरि जाँच गर्नुहोस्' : 'Please try again later'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTechnicians.map((technician) => (
                  <TechnicianCard key={technician._id} technician={technician} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </LanguageProvider>
  );
}
