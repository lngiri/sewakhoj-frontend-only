'use client';

import React from 'react';
import Link from 'next/link';

interface ServiceCardProps {
  id: string;
  name: string;
  nameNe: string;
  icon: string;
  description: string;
  descriptionNe: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  name,
  nameNe,
  icon,
  description,
  descriptionNe,
}) => {
  return (
    <Link
      href={`/services/${id}`}
      className="block p-6 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">{icon}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          <span className="block">{nameNe}</span>
          <span className="text-sm text-gray-600">{name}</span>
        </h3>
        <p className="text-sm text-gray-600">
          {descriptionNe}
        </p>
      </div>
    </Link>
  );
};

export default ServiceCard;
