'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import { LanguageProvider, useLanguage } from '@/components/LanguageSwitch';
import { 
  StarIcon, 
  MapPinIcon, 
  PhoneIcon, 
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  CheckCircleIcon,
  UserIcon,
  CameraIcon
} from '@heroicons/react/24/outline';
import { api } from '@/lib/api';

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
  profileImage?: string;
}

interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface TechnicianPageClientProps {
  technicianId: string;
}

export default function TechnicianPageClient({ technicianId }: TechnicianPageClientProps) {
  const params = useParams();
  const { language } = useLanguage();
  
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchTechnicianProfile();
    fetchTechnicianReviews();
  }, [technicianId]);

  const fetchTechnicianProfile = async () => {
    try {
      const response = await api.get(`/technicians/${technicianId}`);
      setTechnician(response.data);
    } catch (error) {
      console.error('Error fetching technician profile:', error);
    }
  };

  const fetchTechnicianReviews = async () => {
    try {
      const response = await api.get(`/reviews/technician/${technicianId}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LanguageProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </main>
        </div>
      </LanguageProvider>
    );
  }

  if (!technician) {
    return (
      <LanguageProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'ne' ? 'टेक्निसियन फेला परेन' : 'Technician Not Found'}
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
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative">
                {technician.profileImage ? (
                  <img
                    src={technician.profileImage}
                    alt={technician.name}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserIcon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                {technician.isAvailable && (
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{technician.name}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
                  <div className="flex items-center justify-center sm:justify-start">
                    <StarIcon className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1 font-medium">{technician.rating}</span>
                    <span className="text-gray-500 ml-1">({technician.totalJobs} {language === 'ne' ? 'कामहरू' : 'jobs'})</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start text-gray-600">
                    <MapPinIcon className="h-5 w-5" />
                    <span className="ml-1">{technician.location}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start text-gray-600">
                    <CalendarIcon className="h-5 w-5" />
                    <span className="ml-1">{technician.experience} {language === 'ne' ? 'वर्ष अनुभव' : 'years experience'}</span>
                  </div>
                </div>
                
                {technician.bio && (
                  <p className="text-gray-600 mt-4">{technician.bio}</p>
                )}
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {language === 'ne' ? 'बुकिङ गर्नुहोस्' : 'Book Now'}
                  </button>
                  <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                    <PhoneIcon className="h-5 w-5 mr-2" />
                    {technician.phone}
                  </button>
                  <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                    {language === 'ne' ? 'सन्देश' : 'Message'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {language === 'ne' ? 'सेवाहरू' : 'Services'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {technician.services.map((service, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {language === 'ne' ? 'समीक्षाहरू' : 'Reviews'}
            </h2>
            
            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">⭐</div>
                <p className="text-gray-600">
                  {language === 'ne' ? 'अहिलेसम्म कुनै समीक्षा छैन' : 'No reviews yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{review.userId.name}</h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </LanguageProvider>
  );
}
