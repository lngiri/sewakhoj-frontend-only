'use client';

import React from 'react';
import Link from 'next/link';
import { 
  StarIcon, 
  MapPinIcon, 
  PhoneIcon, 
  ChatBubbleLeftRightIcon,
  UserIcon 
} from '@heroicons/react/24/outline';

interface TechnicianCardProps {
  technician: {
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
  };
}

const TechnicianCard: React.FC<TechnicianCardProps> = ({ technician }) => {
  const handleCall = () => {
    window.location.href = `tel:+977${technician.userId.phone || ''}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 p-4">
      <div className="flex items-start space-x-4">
        {/* Profile Photo */}
        <div className="flex-shrink-0">
          {technician.userId.profilePhoto ? (
            <img
              src={technician.userId.profilePhoto}
              alt={technician.userId.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Technician Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {technician.userId.name}
            </h3>
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm font-medium text-gray-900">
                {technician.rating.toFixed(1)}
              </span>
              <span className="ml-1 text-sm text-gray-500">
                ({technician.reviewsCount})
              </span>
            </div>
          </div>

          <div className="mt-1 flex items-center text-sm text-gray-500">
            <MapPinIcon className="h-4 w-4 mr-1" />
            {technician.userId.location.district}
          </div>

          <div className="mt-2">
            <p className="text-sm text-gray-600">
              {technician.skills.join(', ')}
            </p>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {technician.experience} वर्ष अनुभव
            </span>
            {technician.pricing?.hourlyRate && (
              <span className="text-sm font-medium text-green-600">
                रु.{technician.pricing.hourlyRate}/घण्टा
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex space-x-2">
        <button
          onClick={handleCall}
          className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
        >
          <PhoneIcon className="h-4 w-4 mr-2" />
          कल गर्नुहोस्
        </button>
        
        <button className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
          <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
          सन्देश
        </button>
        
        <Link
          href={`/technicians/${technician._id}`}
          className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
        >
          प्रोफाइल हेर्नुहोस्
        </Link>
      </div>
    </div>
  );
};

export default TechnicianCard;
