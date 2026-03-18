'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { LanguageProvider, useLanguage } from '@/components/LanguageSwitch';
import { useAuth } from '@/contexts/AuthContext';
import ReviewForm from '@/components/ReviewForm';
import { api } from '@/lib/api';

interface Job {
  _id: string;
  title: string;
  status: string;
  assignedTechnician: {
    _id: string;
    userId: {
      _id: string;
      name: string;
      profilePhoto?: string;
    };
  };
  reviewed: boolean;
}

function ReviewPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const { user } = useAuth();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    const jobId = searchParams.get('job');
    if (jobId) {
      fetchJobs(jobId);
    } else {
      fetchJobs();
    }
  }, [user, router, searchParams]);

  const fetchJobs = async (specificJobId?: string) => {
    try {
      setLoading(true);
      const response = await api.get('/jobs/customer');
      let completedJobs = response.data.jobs.filter((job: Job) => 
        job.status === 'completed' && !job.reviewed
      );
      
      if (specificJobId) {
        completedJobs = completedJobs.filter((job: Job) => job._id === specificJobId);
      }
      
      setJobs(completedJobs);
      
      // Auto-select if there's only one job
      if (completedJobs.length === 1) {
        setSelectedJob(completedJobs[0]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (reviewData: { rating: number; comment: string }) => {
    if (!selectedJob) return;
    
    try {
      await api.post('/reviews', {
        technicianId: selectedJob.assignedTechnician._id,
        jobId: selectedJob._id,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      
      setSuccess('Review submitted successfully!');
      
      // Remove the reviewed job from the list
      setJobs(prev => prev.filter(job => job._id !== selectedJob._id));
      setSelectedJob(null);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const texts = {
    ne: {
      title: 'समीक्षा छोड्नुहोस्',
      subtitle: 'सम्पन्न कामहरूको लागि समीक्षा दिनुहोस्',
      selectJob: 'समीक्षा गर्न काम छनौट गर्नुहोस्',
      noJobs: 'समीक्षा गर्न कुनै सम्पन्न काम छैन',
      technician: 'प्रदानकर्ता',
      success: 'समीक्षा सफलतापूर्वक पेश गरियो!',
      backToDashboard: 'ड्यासबोर्डमा फर्कनुहोस्'
    },
    en: {
      title: 'Leave a Review',
      subtitle: 'Rate your experience with completed jobs',
      selectJob: 'Select a job to review',
      noJobs: 'No completed jobs to review',
      technician: 'Technician',
      success: 'Review submitted successfully!',
      backToDashboard: 'Back to Dashboard'
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t.title}
          </h1>
          <p className="text-gray-600">
            {t.subtitle}
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">{t.success}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-2 text-green-600 hover:text-green-800 underline"
            >
              {t.backToDashboard}
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t.noJobs}
              </h3>
              <p className="text-gray-600 mb-4">
                You don't have any completed jobs that need reviewing.
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {t.backToDashboard}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Job Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t.selectJob}
              </h3>
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    onClick={() => setSelectedJob(job)}
                    className={`bg-white rounded-lg shadow-sm border p-4 cursor-pointer hover:shadow-md transition-shadow ${
                      selectedJob?._id === job._id ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <h4 className="font-medium text-gray-900">{job.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {t.technician}: {job.assignedTechnician.userId.name}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        Completed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Form */}
            <div>
              {selectedJob ? (
                <ReviewForm
                  technicianId={selectedJob.assignedTechnician._id}
                  jobId={selectedJob._id}
                  technicianName={selectedJob.assignedTechnician.userId.name}
                  onSubmit={handleReviewSubmit}
                  onCancel={() => setSelectedJob(null)}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a Job
                  </h3>
                  <p className="text-gray-600">
                    Choose a completed job from the left to leave a review.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default function LeaveReviewPage() {
  return (
    <LanguageProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </main>
        </div>
      }>
        <ReviewPageContent />
      </Suspense>
    </LanguageProvider>
  );
}
