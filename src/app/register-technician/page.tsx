'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { LanguageProvider, useLanguage } from '@/components/LanguageSwitch';
import { useAuth } from '@/contexts/AuthContext';
import { 
  PhotoIcon, 
  DocumentIcon,
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { api } from '@/lib/api';

interface Service {
  _id: string;
  name: string;
  nameNe: string;
  icon: string;
}

const TechnicianRegistrationContent: React.FC = () => {
  const router = useRouter();
  const { language } = useLanguage();
  const { user } = useAuth();
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    skills: [] as string[],
    experience: '',
    serviceAreas: [] as string[],
    
    // Step 2: Availability
    available: true,
    workingHours: {
      start: '09:00',
      end: '18:00'
    },
    daysOff: [] as string[],
    
    // Step 3: Pricing
    hourlyRate: '',
    serviceRates: [] as Array<{
      service: string;
      price: string;
      unit: 'hour' | 'job';
    }>,
    
    // Step 4: Documents
    profilePhoto: '',
    idDocument: '',
    portfolio: [] as string[]
  });

  const districts = [
    'काठमाडौं', 'ललितपुर', 'भक्तपुर', 'पोखरा', 'बिराटनगर',
    'धरान', 'भरतपुर', 'नेपालगञ्ज', 'बिरगञ्ज', 'महेन्द्रनगर',
    'गुल्मी', 'पाल्पा', 'स्याङ्जा', 'तनहुँ', 'कास्की'
  ];

  const weekDays = [
    { value: 'monday', labelNe: 'सोमबार', labelEn: 'Monday' },
    { value: 'tuesday', labelNe: 'मंगलबार', labelEn: 'Tuesday' },
    { value: 'wednesday', labelNe: 'बुधबार', labelEn: 'Wednesday' },
    { value: 'thursday', labelNe: 'बिहिबार', labelEn: 'Thursday' },
    { value: 'friday', labelNe: 'शुक्रबार', labelEn: 'Friday' },
    { value: 'saturday', labelNe: 'शनिबार', labelEn: 'Saturday' },
    { value: 'sunday', labelNe: 'आइतबार', labelEn: 'Sunday' }
  ];

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSkillToggle = (skillId: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter(s => s !== skillId)
        : [...prev.skills, skillId]
    }));
  };

  const handleServiceAreaToggle = (area: string) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.includes(area)
        ? prev.serviceAreas.filter(a => a !== area)
        : [...prev.serviceAreas, area]
    }));
  };

  const handleDayOffToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      daysOff: prev.daysOff.includes(day)
        ? prev.daysOff.filter(d => d !== day)
        : [...prev.daysOff, day]
    }));
  };

  const addServiceRate = () => {
    setFormData(prev => ({
      ...prev,
      serviceRates: [...prev.serviceRates, { service: '', price: '', unit: 'hour' }]
    }));
  };

  const updateServiceRate = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      serviceRates: prev.serviceRates.map((rate, i) =>
        i === index ? { ...rate, [field]: value } : rate
      )
    }));
  };

  const removeServiceRate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      serviceRates: prev.serviceRates.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'profilePhoto' | 'idDocument' | 'portfolio') => {
    const files = e.target.files;
    if (files) {
      // TODO: Implement actual file upload to cloud storage
      if (type === 'portfolio') {
        const newImages = Array.from(files).map(file => URL.createObjectURL(file));
        setFormData(prev => ({
          ...prev,
          portfolio: [...prev.portfolio, ...newImages]
        }));
      } else {
        const file = files[0];
        const url = URL.createObjectURL(file);
        setFormData(prev => ({
          ...prev,
          [type]: url
        }));
      }
    }
  };

  const removePortfolioImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, i) => i !== index)
    }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (formData.skills.length === 0) {
          setError('Please select at least one skill');
          return false;
        }
        if (!formData.experience || parseFloat(formData.experience) < 0) {
          setError('Please enter valid experience');
          return false;
        }
        if (formData.serviceAreas.length === 0) {
          setError('Please select at least one service area');
          return false;
        }
        break;
      case 2:
        // Availability is always valid with defaults
        break;
      case 3:
        if (!formData.hourlyRate || parseFloat(formData.hourlyRate) <= 0) {
          setError('Please enter a valid hourly rate');
          return false;
        }
        break;
      case 4:
        if (!formData.profilePhoto) {
          setError('Please upload a profile photo');
          return false;
        }
        if (!formData.idDocument) {
          setError('Please upload your ID document');
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setError('');
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const technicianData = {
        skills: formData.skills,
        experience: parseFloat(formData.experience),
        serviceAreas: formData.serviceAreas,
        availability: {
          available: formData.available,
          workingHours: formData.workingHours,
          daysOff: formData.daysOff
        },
        pricing: {
          hourlyRate: parseFloat(formData.hourlyRate),
          serviceRates: formData.serviceRates
            .filter(rate => rate.service && rate.price)
            .map(rate => ({
              service: rate.service,
              price: parseFloat(rate.price),
              unit: rate.unit
            }))
        },
        profilePhoto: formData.profilePhoto,
        idDocument: formData.idDocument,
        portfolio: formData.portfolio
      };
      
      await api.post('/technicians/register', technicianData);
      setSuccess('Registration submitted successfully! Your profile will be reviewed.');
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/technician-dashboard');
      }, 3000);
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const texts = {
    ne: {
      title: 'प्रदानकर्ता दर्ता',
      subtitle: 'सेवाखोजमा प्रदानकर्ता बन्नुहोस्',
      step1: 'आधारभूत जानकारी',
      step2: 'उपलब्धता',
      step3: 'मूल्य निर्धारण',
      step4: 'कागजात',
      skills: 'सीपहरू',
      experience: 'अनुभव (वर्ष)',
      serviceAreas: 'सेवा क्षेत्रहरू',
      workingHours: 'कार्य समय',
      daysOff: 'विश्राम दिनहरू',
      hourlyRate: 'घण्टादार (रु)',
      serviceRates: 'सेवा दरहरू',
      addServiceRate: 'सेवा दर थप्नुहोस्',
      profilePhoto: 'प्रोफाइल फोटो',
      idDocument: 'परिचयपत्र',
      portfolio: 'पोर्टफोलियो',
      next: 'पछिल्लो',
      previous: 'अघिल्लो',
      submit: 'दर्ता गर्नुहोस्',
      registering: 'दर्ता हुँदैछ...',
      success: 'दर्ता सफलतापूर्वक पूरा भयो!',
      required: 'यो फिल्ड आवश्यक छ'
    },
    en: {
      title: 'Technician Registration',
      subtitle: 'Become a service provider on SewaKhoj',
      step1: 'Basic Information',
      step2: 'Availability',
      step3: 'Pricing',
      step4: 'Documents',
      skills: 'Skills',
      experience: 'Experience (years)',
      serviceAreas: 'Service Areas',
      workingHours: 'Working Hours',
      daysOff: 'Days Off',
      hourlyRate: 'Hourly Rate (Rs)',
      serviceRates: 'Service Rates',
      addServiceRate: 'Add Service Rate',
      profilePhoto: 'Profile Photo',
      idDocument: 'ID Document',
      portfolio: 'Portfolio',
      next: 'Next',
      previous: 'Previous',
      submit: 'Register',
      registering: 'Registering...',
      success: 'Registration completed successfully!',
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
        {/* Progress Bar */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t.title}
          </h1>
          <p className="text-gray-600 mb-6">
            {t.subtitle}
          </p>
          
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {step < currentStep ? (
                    <CheckCircleIcon className="h-6 w-6" />
                  ) : (
                    step
                  )}
                </div>
                {step < 4 && (
                  <div className={`w-full h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>{t.step1}</span>
            <span>{t.step2}</span>
            <span>{t.step3}</span>
            <span>{t.step4}</span>
          </div>
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
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.step1}</h3>
              
              {/* Skills */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.skills} *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {services.map((service) => (
                    <label key={service._id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.skills.includes(service._id)}
                        onChange={() => handleSkillToggle(service._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{language === 'ne' ? service.nameNe : service.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.experience} *
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  min="0"
                  step="0.5"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Service Areas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.serviceAreas} *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {districts.map((district) => (
                    <label key={district} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.serviceAreas.includes(district)}
                        onChange={() => handleServiceAreaToggle(district)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{district}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Availability */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.step2}</h3>
              
              {/* Available Status */}
              <div className="mb-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {language === 'ne' ? 'उपलब्ध छु' : 'Available for work'}
                  </span>
                </label>
              </div>

              {/* Working Hours */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.workingHours}
                </label>
                <div className="flex items-center space-x-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start</label>
                    <input
                      type="time"
                      name="workingHours.start"
                      value={formData.workingHours.start}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End</label>
                    <input
                      type="time"
                      name="workingHours.end"
                      value={formData.workingHours.end}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Days Off */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.daysOff}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {weekDays.map((day) => (
                    <label key={day.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.daysOff.includes(day.value)}
                        onChange={() => handleDayOffToggle(day.value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{language === 'ne' ? day.labelNe : day.labelEn}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pricing */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.step3}</h3>
              
              {/* Hourly Rate */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.hourlyRate} *
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleInputChange}
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Service Rates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.serviceRates}
                </label>
                <div className="space-y-3">
                  {formData.serviceRates.map((rate, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <select
                        value={rate.service}
                        onChange={(e) => updateServiceRate(index, 'service', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select service</option>
                        {services.map((service) => (
                          <option key={service._id} value={service._id}>
                            {language === 'ne' ? service.nameNe : service.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={rate.price}
                        onChange={(e) => updateServiceRate(index, 'price', e.target.value)}
                        placeholder="Price"
                        min="0"
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={rate.unit}
                        onChange={(e) => updateServiceRate(index, 'unit', e.target.value as 'hour' | 'job')}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="hour">/hour</option>
                        <option value="job">/job</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeServiceRate(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addServiceRate}
                  className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + {t.addServiceRate}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Documents */}
          {currentStep === 4 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.step4}</h3>
              
              {/* Profile Photo */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.profilePhoto} *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="profilePhoto" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Upload profile photo
                      </span>
                      <input
                        id="profilePhoto"
                        name="profilePhoto"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'profilePhoto')}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  {formData.profilePhoto && (
                    <div className="mt-4">
                      <img
                        src={formData.profilePhoto}
                        alt="Profile preview"
                        className="mx-auto h-32 w-32 object-cover rounded-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* ID Document */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.idDocument} *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="idDocument" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Upload ID document
                      </span>
                      <input
                        id="idDocument"
                        name="idDocument"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload(e, 'idDocument')}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  {formData.idDocument && (
                    <div className="mt-4">
                      <p className="text-sm text-green-600">Document uploaded</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Portfolio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.portfolio}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="portfolio" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Upload portfolio images
                      </span>
                      <input
                        id="portfolio"
                        name="portfolio"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'portfolio')}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  {formData.portfolio.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {formData.portfolio.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Portfolio ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removePortfolioImage(index)}
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
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.previous}
            </button>
            
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {t.next}
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t.registering : t.submit}
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
};

export default function TechnicianRegistrationPage() {
  return (
    <LanguageProvider>
      <TechnicianRegistrationContent />
    </LanguageProvider>
  );
}
