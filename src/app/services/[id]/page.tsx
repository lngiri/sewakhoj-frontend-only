'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import TechnicianCard from '@/components/TechnicianCard';
import { LanguageProvider, useLanguage } from '@/components/LanguageSwitch';
import { MagnifyingGlassIcon, FunnelIcon, StarIcon, MapPinIcon } from '@heroicons/react/24/outline';
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
  userId: {
    _id: string;
    name: string;
    profilePhoto?: string;
    location: {
      address: string;
      district: string;
    };
  };
  skills: string[];
  experience: number;
  rating: number;
  reviewsCount: number;
  serviceAreas: string[];
  pricing?: {
    hourlyRate?: number;
    serviceRates: Array<{
      service: string;
      price: number;
      unit: 'hour' | 'job';
    }>;
  };
}

const ServiceSearchContent: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  
  const [service, setService] = useState<Service | null>(null);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (params.id) {
      fetchService();
      fetchTechnicians();
    }
  }, [params.id, ratingFilter, sortBy, currentPage]);

  const fetchService = async () => {
    try {
      const response = await api.get(`/services/${params.id}`);
      setService(response.data);
    } catch (err) {
      console.error('Failed to fetch service:', err);
    }
  };

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/services/${params.id}/technicians`, {
        params: {
          rating: ratingFilter,
          page: currentPage,
          limit: 10,
          sortBy,
          sortOrder: 'desc'
        }
      });
      
      setTechnicians(response.data.technicians);
      setTotalPages(response.data.pagination.pages);
    } catch (err) {
      setError('Failed to load technicians');
      console.error('Failed to fetch technicians:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTechnicians = technicians.filter(technician =>
    technician.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    technician.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const texts = {
    ne: {
      loading: 'लोड हुँदैछ...',
      noTechnicians: 'कुनै प्रदानकर्ता फेला परेन',
      searchPlaceholder: 'प्रदानकर्ताहरू खोज्नुहोस्...',
      filterBy: 'फिल्टर गर्नुहोस्',
      rating: 'रेटिंग',
      sortBy: 'क्रमबद्ध गर्नुहोस्',
      highestRated: 'उच्चतम रेटिंग',
      mostExperienced: 'बढी अनुभव',
      mostReviews: 'बढी समीक्षाहरू',
      call: 'कल गर्नुहोस्',
      message: 'सन्देश',
      viewProfile: 'प्रोफाइल हेर्नुहोस्',
      yearsExperience: 'वर्ष अनुभव',
      perHour: '/घण्टा'
    },
    en: {
      loading: 'Loading...',
      noTechnicians: 'No technicians found',
      searchPlaceholder: 'Search technicians...',
      filterBy: 'Filter by',
      rating: 'Rating',
      sortBy: 'Sort by',
      highestRated: 'Highest Rated',
      mostExperienced: 'Most Experienced',
      mostReviews: 'Most Reviews',
      call: 'Call',
      message: 'Message',
      viewProfile: 'View Profile',
      yearsExperience: 'years experience',
      perHour: '/hour'
    }
  };

  const t = texts[language];

  if (loading && technicians.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500">{t.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Service Header */}
        {service && (
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-4xl">{service.icon}</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {language === 'ne' ? service.nameNe : service.name}
                </h1>
                <p className="text-gray-600">
                  {language === 'ne' ? service.descriptionNe : service.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.filterBy} {t.rating}
              </label>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="0">All Ratings</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.sortBy}
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="rating">{t.highestRated}</option>
                <option value="experience">{t.mostExperienced}</option>
                <option value="reviewsCount">{t.mostReviews}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredTechnicians.length} {language === 'ne' ? 'प्रदानकर्ताहरू फेला परे' : 'technicians found'}
          </p>
        </div>

        {/* Technicians List */}
        {filteredTechnicians.length > 0 ? (
          <div className="space-y-4">
            {filteredTechnicians.map((technician) => (
              <TechnicianCard key={technician._id} technician={technician} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t.noTechnicians}</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default function ServiceSearchPage() {
  return (
    <LanguageProvider>
      <ServiceSearchContent />
    </LanguageProvider>
  );
}
