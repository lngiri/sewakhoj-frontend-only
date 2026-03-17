'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { LanguageProvider, useLanguage } from '@/components/LanguageSwitch';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BriefcaseIcon,
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  CalendarIcon,
  MapPinIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { api } from '@/lib/api';

interface Job {
  _id: string;
  title: string;
  description: string;
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  serviceId: {
    _id: string;
    name: string;
    nameNe: string;
    icon: string;
  };
  customerId: {
    _id: string;
    name: string;
    profilePhoto?: string;
    location: {
      district: string;
    };
  };
  preferredDate?: string;
  budget?: {
    min?: number;
    max?: number;
    type: 'hourly' | 'fixed';
  };
  createdAt: string;
}

interface TechnicianProfile {
  _id: string;
  skills: string[];
  experience: number;
  rating: number;
  reviewsCount: number;
  serviceAreas: string[];
  availability: {
    available: boolean;
    workingHours: {
      start: string;
      end: string;
    };
  };
  pricing?: {
    hourlyRate?: number;
  };
}

const TechnicianDashboardContent: React.FC = () => {
  const router = useRouter();
  const { language } = useLanguage();
  const { user, logout } = useAuth();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [profile, setProfile] = useState<TechnicianProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'available' | 'assigned' | 'in_progress' | 'completed'>('available');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      // Fetch technician profile
      const profileResponse = await api.get('/technicians/profile');
      setProfile(profileResponse.data);

      // Fetch assigned jobs
      const jobsResponse = await api.get('/jobs/technician');
      setJobs(jobsResponse.data.jobs);

      // Fetch available jobs
      const availableResponse = await api.get('/jobs/technician?status=available');
      setAvailableJobs(availableResponse.data.jobs);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // If profile doesn't exist, redirect to registration
      if (error.response?.status === 404) {
        router.push('/register-technician');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptJob = async (jobId: string) => {
    try {
      await api.put(`/jobs/${jobId}/status`, { 
        status: 'assigned',
        technicianId: profile?._id 
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to accept job:', error);
    }
  };

  const handleStartJob = async (jobId: string) => {
    try {
      await api.put(`/jobs/${jobId}/status`, { status: 'in_progress' });
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to start job:', error);
    }
  };

  const handleCompleteJob = async (jobId: string) => {
    try {
      await api.put(`/jobs/${jobId}/status`, { status: 'completed' });
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to complete job:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'assigned':
        return <BriefcaseIcon className="h-5 w-5 text-blue-500" />;
      case 'in_progress':
        return <ExclamationCircleIcon className="h-5 w-5 text-orange-500" />;
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      ne: {
        open: 'खुला',
        assigned: 'तोकिएको',
        in_progress: 'प्रगतिमा',
        completed: 'सम्पन्न',
        cancelled: 'रद्द'
      },
      en: {
        open: 'Open',
        assigned: 'Assigned',
        in_progress: 'In Progress',
        completed: 'Completed',
        cancelled: 'Cancelled'
      }
    };
    return statusTexts[language as 'ne' | 'en'][status as keyof typeof statusTexts.ne];
  };

  const getFilteredJobs = () => {
    switch (activeTab) {
      case 'available':
        return availableJobs;
      case 'assigned':
        return jobs.filter(job => job.status === 'assigned');
      case 'in_progress':
        return jobs.filter(job => job.status === 'in_progress');
      case 'completed':
        return jobs.filter(job => job.status === 'completed');
      default:
        return [];
    }
  };

  const texts = {
    ne: {
      title: 'प्रदानकर्ता ड्यासबोर्ड',
      welcome: 'स्वागतम्',
      myProfile: 'मेरो प्रोफाइल',
      availableJobs: 'उपलब्ध कामहरू',
      assignedJobs: 'तोकिएका कामहरू',
      inProgressJobs: 'प्रगतिमा कामहरू',
      completedJobs: 'सम्पन्न कामहरू',
      accept: 'स्वीकार गर्नुहोस्',
      start: 'सुरु गर्नुहोस्',
      complete: 'सम्पन्न गर्नुहोस्',
      chat: 'च्याट',
      viewDetails: 'विवरण हेर्नुहोस्',
      earnings: 'कमाइ',
      rating: 'रेटिंग',
      experience: 'अनुभव',
      serviceAreas: 'सेवा क्षेत्रहरू',
      noJobs: 'कुनै काम छैन',
      customer: 'ग्राहक',
      budget: 'बजेट',
      location: 'स्थान',
      postedOn: 'पोस्ट गरिएको',
      preferredDate: 'प्राथमिक मिति'
    },
    en: {
      title: 'Technician Dashboard',
      welcome: 'Welcome',
      myProfile: 'My Profile',
      availableJobs: 'Available Jobs',
      assignedJobs: 'Assigned Jobs',
      inProgressJobs: 'In Progress Jobs',
      completedJobs: 'Completed Jobs',
      accept: 'Accept',
      start: 'Start',
      complete: 'Complete',
      chat: 'Chat',
      viewDetails: 'View Details',
      earnings: 'Earnings',
      rating: 'Rating',
      experience: 'Experience',
      serviceAreas: 'Service Areas',
      noJobs: 'No jobs found',
      customer: 'Customer',
      budget: 'Budget',
      location: 'Location',
      postedOn: 'Posted on',
      preferredDate: 'Preferred Date'
    }
  };

  const t = texts[language];

  if (!user) {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null; // Will redirect to registration
  }

  const filteredJobs = getFilteredJobs();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t.title}
          </h1>
          <p className="text-gray-600">
            {t.welcome}, {user.name}!
          </p>
        </div>

        {/* Profile Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <UserIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">{t.rating}</p>
                <p className="text-xl font-semibold">{profile.rating.toFixed(1)}</p>
                <p className="text-xs text-gray-500">({profile.reviewsCount} reviews)</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <BriefcaseIcon className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">{t.experience}</p>
                <p className="text-xl font-semibold">{profile.experience} {language === 'ne' ? 'वर्ष' : 'years'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">{t.earnings}</p>
                <p className="text-xl font-semibold">रु.{profile.pricing?.hourlyRate || 0}/hr</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">{t.completedJobs}</p>
                <p className="text-xl font-semibold">{jobs.filter(j => j.status === 'completed').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'available', label: t.availableJobs, count: availableJobs.length },
                { key: 'assigned', label: t.assignedJobs, count: jobs.filter(j => j.status === 'assigned').length },
                { key: 'in_progress', label: t.inProgressJobs, count: jobs.filter(j => j.status === 'in_progress').length },
                { key: 'completed', label: t.completedJobs, count: jobs.filter(j => j.status === 'completed').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {filteredJobs.length > 0 ? (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <div key={job._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(job.status)}
                          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            {getStatusText(job.status)}
                          </span>
                        </div>
                        
                        <p className="mt-2 text-gray-600 line-clamp-2">{job.description}</p>
                        
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="mr-1">{job.serviceId.icon}</span>
                            {language === 'ne' ? job.serviceId.nameNe : job.serviceId.name}
                          </div>
                          
                          <div className="flex items-center">
                            <UserIcon className="h-4 w-4 mr-1" />
                            {t.customer}: {job.customerId.name}
                          </div>
                          
                          <div className="flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            {job.customerId.location.district}
                          </div>
                        </div>

                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          {job.budget && (
                            <div>
                              {t.budget}: रु.{job.budget.min || 0} - {job.budget.max || 0}
                            </div>
                          )}
                          
                          <div>
                            {t.postedOn}: {new Date(job.createdAt).toLocaleDateString()}
                          </div>

                          {job.preferredDate && (
                            <div>
                              {t.preferredDate}: {new Date(job.preferredDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        {activeTab === 'available' && (
                          <button
                            onClick={() => handleAcceptJob(job._id)}
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                          >
                            {t.accept}
                          </button>
                        )}
                        
                        {activeTab === 'assigned' && (
                          <button
                            onClick={() => handleStartJob(job._id)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            {t.start}
                          </button>
                        )}
                        
                        {activeTab === 'in_progress' && (
                          <button
                            onClick={() => handleCompleteJob(job._id)}
                            className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
                          >
                            {t.complete}
                          </button>
                        )}
                        
                        <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                          {t.viewDetails}
                        </button>
                        
                        <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                          <ChatBubbleLeftRightIcon className="h-4 w-4 inline mr-1" />
                          {t.chat}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">{t.noJobs}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default function TechnicianDashboardPage() {
  return (
    <LanguageProvider>
      <TechnicianDashboardContent />
    </LanguageProvider>
  );
}
