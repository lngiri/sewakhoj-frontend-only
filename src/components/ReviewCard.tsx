'use client';

import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { UserIcon } from '@heroicons/react/24/outline';

interface ReviewCardProps {
  review: {
    _id: string;
    customerId: {
      _id: string;
      name: string;
      profilePhoto?: string;
    };
    jobId?: {
      _id: string;
      title: string;
    };
    rating: number;
    comment: string;
    isVerified: boolean;
    createdAt: string;
  };
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-start space-x-3">
        {/* Customer Photo */}
        <div className="flex-shrink-0">
          {review.customerId.profilePhoto ? (
            <img
              src={review.customerId.profilePhoto}
              alt={review.customerId.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
          )}
        </div>

        {/* Review Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">
                {review.customerId.name}
              </h4>
              <div className="flex items-center space-x-2 mt-1">
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
                {review.isVerified && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Verified
                  </span>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {formatDate(review.createdAt)}
            </span>
          </div>

          {review.jobId && (
            <p className="text-sm text-blue-600 mt-2">
              Service: {review.jobId.title}
            </p>
          )}

          {review.comment && (
            <p className="mt-3 text-gray-700">
              {review.comment}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
