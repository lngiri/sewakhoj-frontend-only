'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { LanguageProvider, useLanguage } from '@/components/LanguageSwitch';
import { useAuth } from '@/contexts/AuthContext';
import { 
  PhotoIcon, 
  MapPinIcon, 
  CalendarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { api } from '@/lib/api';

interface Service {
  _id: string;
  name: string;
  nameNe: string;
  icon: string;
}

const PostJobContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const { user } = useAuth();
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    serviceId: searchParams.get('service') || '',
    title: '',
    description: '',
    address: '',
    district: '',
    province: '',
    budgetType: 'fixed' as 'hourly' | 'fixed',
    minBudget: '',
    maxBudget: '',
    preferredDate: '',
    preferredTime: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
    images: [] as string[]
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchServices();
  }, [user, router]);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // TODO: Implement image upload to cloud storage
      // For now, just store file names
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const jobData = {
        serviceId: formData.serviceId,
        title: formData.title,
        description: formData.description,
        location: {
          address: formData.address,
          district: formData.district,
          province: formData.province,
          coordinates: [85.3240, 27.7172] // Default to Kathmandu
        },
        budget: formData.budgetType === 'hourly' ? {
          type: 'hourly',
          min: formData.minBudget ? parseFloat(formData.minBudget) : undefined,
          max: formData.maxBudget ? parseFloat(formData.maxBudget) : undefined
        } : {
          type: 'fixed',
          min: formData.minBudget ? parseFloat(formData.minBudget) : undefined,
          max: formData.maxBudget ? parseFloat(formData.maxBudget) : undefined
        },
        preferredDate: formData.preferredDate || undefined,
        preferredTime: formData.preferredTime || undefined,
        urgency: formData.urgency,
        images: formData.images
      };

      await api.post('/jobs', jobData);
      setSuccess('Job posted successfully!');
      
      // Redirect to customer dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const texts = {
    ne: {
      title: 'काम पोस्ट गर्नुहोस्',
      subtitle: 'तपाईंलाई आवश्यक सेवा विवरण दिनुहोस्',
      service: 'सेवा प्रकार',
      selectService: 'सेवा छान्नुहोस्',
      jobTitle: 'कामको शीर्षक',
      jobTitlePlaceholder: 'तपाईंलाई के गर्नु छ?',
      description: 'विवरण',
      descriptionPlaceholder: 'समस्या विस्तारमा वर्णन गर्नुहोस्...',
      location: 'स्थान',
      addressPlaceholder: 'आफ्नो ठेगाना प्रविष्ट गर्नुहोस्',
      district: 'जिल्ला',
      province: 'प्रदेश',
      budget: 'बजेट',
      budgetType: 'बजेट प्रकार',
      hourly: 'घण्टाको आधारमा',
      fixed: 'निश्चित मूल्य',
      minBudget: 'न्यूनतम बजेट',
      maxBudget: 'अधिकतम बजेट',
      preferredDate: 'प्राथमिक मिति',
      preferredTime: 'प्राथमिक समय',
      urgency: 'आवश्यकता स्तर',
      low: 'कम',
      medium: 'मध्यम',
      high: 'उच्च',
      images: 'फोटोहरू',
      addImages: 'फोटोहरू थप्नुहोस्',
      postJob: 'काम पोस्ट गर्नुहोस्',
      posting: 'पोस्ट गरिँदैछ...',
      success: 'काम सफलतापूर्वक पोस्ट गरियो!',
      required: 'यो फिल्ड आवश्यक छ'
    },
    en: {
      title: 'Post a Job',
      subtitle: 'Describe the service you need',
      service: 'Service Type',
      selectService: 'Select a service',
      jobTitle: 'Job Title',
      jobTitlePlaceholder: 'What do you need done?',
      description: 'Description',
      descriptionPlaceholder: 'Describe the problem in detail...',
      location: 'Location',
      addressPlaceholder: 'Enter your address',
      district: 'District',
      province: 'Province',
      budget: 'Budget',
      budgetType: 'Budget Type',
      hourly: 'Hourly Rate',
      fixed: 'Fixed Price',
      minBudget: 'Minimum Budget',
      maxBudget: 'Maximum Budget',
      preferredDate: 'Preferred Date',
      preferredTime: 'Preferred Time',
      urgency: 'Urgency Level',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      images: 'Images',
      addImages: 'Add Images',
      postJob: 'Post Job',
      posting: 'Posting...',
      success: 'Job posted successfully!',
      required: 'This field is required'
    }
  };

  const t = texts[language];

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t.title}
          </h1>
          <p className="text-gray-600">
            {t.subtitle}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-red-800">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Selection */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.service} *
            </label>
            <select
              name="serviceId"
              value={formData.serviceId}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t.selectService}</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {language === 'ne' ? service.nameNe : service.name}
                </option>
              ))}
            </select>
          </div>

          {/* Job Title and Description */}
          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.jobTitle} *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder={t.jobTitlePlaceholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.description} *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder={t.descriptionPlaceholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">{t.location}</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.addressPlaceholder} *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder={t.addressPlaceholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.district} *
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                    placeholder="काठमाडौं"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.province} *
                  </label>
                  <input
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    required
                    placeholder="बागमती प्रदेश"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">{t.budget}</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.budgetType}
                </label>
                <select
                  name="budgetType"
                  value={formData.budgetType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fixed">{t.fixed}</option>
                  <option value="hourly">{t.hourly}</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.minBudget}
                  </label>
                  <input
                    type="number"
                    name="minBudget"
                    value={formData.minBudget}
                    onChange={handleInputChange}
                    placeholder="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.maxBudget}
                  </label>
                  <input
                    type="number"
                    name="maxBudget"
                    value={formData.maxBudget}
                    onChange={handleInputChange}
                    placeholder="5000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preferred Date and Time */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">{t.preferredDate}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.preferredDate}
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.preferredTime}
                </label>
                <input
                  type="time"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.urgency}
              </label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">{t.low}</option>
                <option value="medium">{t.medium}</option>
                <option value="high">{t.high}</option>
              </select>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <PhotoIcon className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">{t.images}</h3>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="images" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      {t.addImages}
                    </span>
                    <input
                      id="images"
                      name="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t.posting : t.postJob}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default function PostJobPage() {
  return (
    <LanguageProvider>
      <PostJobContent />
    </LanguageProvider>
  );
}
