'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { LanguageProvider, useLanguage } from '@/components/LanguageSwitch';
import { useAuth } from '@/contexts/AuthContext';
import PaymentModal from '@/components/PaymentModal';
import { 
  BriefcaseIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  CreditCardIcon
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
  assignedTechnician?: {
    userId: {
      name: string;
      profilePhoto?: string;
    };
  };
  createdAt: string;
  preferredDate?: string;
  budget?: {
    min?: number;
    max?: number;
    type: 'hourly' | 'fixed';
  };
  paymentStatus?: 'pending' | 'paid' | 'failed';
  paymentTransaction?: {
    amount: number;
    method: string;
    status: string;
  };
}

const DashboardContent: React.FC = () => {
  const router = useRouter();
  const { language } = useLanguage();
  const { user, logout } = useAuth();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'assigned' | 'in_progress' | 'completed'>('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchJobs();
  }, [user, router]);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs/customer');
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
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

  const handlePayment = (job: Job) => {
    setSelectedJob(job);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    fetchJobs(); // Refresh jobs to update payment status
    setShowPaymentModal(false);
    setSelectedJob(null);
  };

  const filteredJobs = jobs.filter(job => 
    activeTab === 'all' || job.status === activeTab
  );

  const texts = {
    ne: {
      title: 'मेरो ड्यासबोर्ड',
      welcome: 'स्वागतम्',
      postJob: 'नयाँ काम पोस्ट गर्नुहोस्',
      myJobs: 'मेरा कामहरू',
      allJobs: 'सबै कामहरू',
      openJobs: 'खुला कामहरू',
      assignedJobs: 'तोकिएका कामहरू',
      inProgressJobs: 'प्रगतिमा कामहरू',
      completedJobs: 'सम्पन्न कामहरू',
      noJobs: 'कुनै काम छैन',
      service: 'सेवा',
      technician: 'प्रदानकर्ता',
      postedOn: 'पोस्ट गरिएको',
      preferredDate: 'प्राथमिक मिति',
      viewDetails: 'विवरण हेर्नुहोस्',
      chat: 'च्याट',
      leaveReview: 'समीक्षा छोड्नुहोस्'
    },
    en: {
      title: 'My Dashboard',
      welcome: 'Welcome',
      postJob: 'Post New Job',
      myJobs: 'My Jobs',
      allJobs: 'All Jobs',
      openJobs: 'Open Jobs',
      assignedJobs: 'Assigned Jobs',
      inProgressJobs: 'In Progress',
      completedJobs: 'Completed Jobs',
      noJobs: 'No jobs found',
      service: 'Service',
      technician: 'Technician',
      postedOn: 'Posted on',
      preferredDate: 'Preferred Date',
      viewDetails: 'View Details',
      chat: 'Chat',
      leaveReview: 'Leave Review'
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => router.push('/post-job')}
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
          >
            <PlusIcon className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">{t.postJob}</h3>
          </button>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <BriefcaseIcon className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              {jobs.filter(j => j.status === 'completed').length} {t.completedJobs}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <ClockIcon className="h-8 w-8 text-yellow-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              {jobs.filter(j => j.status === 'open').length} {t.openJobs}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <ExclamationCircleIcon className="h-8 w-8 text-orange-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              {jobs.filter(j => j.status === 'in_progress').length} {t.inProgressJobs}
            </h3>
          </div>
        </div>

        {/* Jobs Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'all', label: t.allJobs },
                { key: 'open', label: t.openJobs },
                { key: 'assigned', label: t.assignedJobs },
                { key: 'in_progress', label: t.inProgressJobs },
                { key: 'completed', label: t.completedJobs }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
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
                        
                        <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="mr-1">{job.serviceId.icon}</span>
                            {language === 'ne' ? job.serviceId.nameNe : job.serviceId.name}
                          </div>
                          
                          {job.assignedTechnician && (
                            <div>
                              {t.technician}: {job.assignedTechnician.userId.name}
                            </div>
                          )}
                          
                          <div>
                            {t.postedOn}: {new Date(job.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        {job.preferredDate && (
                          <div className="mt-1 text-sm text-gray-500">
                            {t.preferredDate}: {new Date(job.preferredDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => router.push(`/jobs/${job._id}`)}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          {t.viewDetails}
                        </button>
                        
                        {job.assignedTechnician && (
                          <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            <ChatBubbleLeftRightIcon className="h-4 w-4 inline mr-1" />
                            {t.chat}
                          </button>
                        )}
                        
                        {job.status === 'completed' && (
                          <>
                            {job.paymentStatus !== 'paid' && (
                              <button 
                                onClick={() => handlePayment(job)}
                                className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                              >
                                <CreditCardIcon className="h-4 w-4 inline mr-1" />
                                {language === 'ne' ? 'भुक्तानी गर्नुहोस्' : 'Pay Now'}
                              </button>
                            )}
                            <button 
                              onClick={() => router.push(`/leave-review?job=${job._id}`)}
                              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                              <StarIcon className="h-4 w-4 inline mr-1" />
                              {t.leaveReview}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">{t.noJobs}</p>
                <button
                  onClick={() => router.push('/post-job')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {t.postJob}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Payment Modal */}
      {selectedJob && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedJob(null);
          }}
          jobId={selectedJob._id}
          jobTitle={selectedJob.title}
          amount={selectedJob.budget?.max || selectedJob.budget?.min || 1000}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default function DashboardPage() {
  return (
    <LanguageProvider>
      <DashboardContent />
    </LanguageProvider>
  );
}
