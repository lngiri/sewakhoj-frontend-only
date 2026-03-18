import React from 'react';
import TechnicianPageClient from './TechnicianPageClient';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default function TechnicianPage({ params }: { params: { id: string } }) {
  return <TechnicianPageClient technicianId={params.id} />;
}
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
  userId: {
    _id: string;
    name: string;
    phone: string;
    profilePhoto?: string;
    location: {
      address: string;
      district: string;
      province: string;
    };
  };
  skills: string[];
  experience: number;
  serviceAreas: string[];
  verificationStatus: 'pending' | 'approved' | 'rejected';
  rating: number;
  reviewsCount: number;
  portfolio: string[];
  availability: {
    available: boolean;
    workingHours: {
      start: string;
      end: string;
    };
    daysOff: string[];
  };
  pricing?: {
    hourlyRate?: number;
    serviceRates: Array<{
      service: string;
      price: number;
      unit: 'hour' | 'job';
    }>;
  };
}

interface Review {
  _id: string;
  customerId: {
    name: string;
    profilePhoto?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

const TechnicianProfileContent: React.FC = () => {
  const params = useParams();
  const { language } = useLanguage();
  
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'reviews'>('about');

  useEffect(() => {
    if (params.id) {
      fetchTechnicianProfile();
      fetchTechnicianReviews();
    }
  }, [params.id]);

  const fetchTechnicianProfile = async () => {
    try {
      const response = await api.get(`/technicians/${params.id}`);
      setTechnician(response.data);
    } catch (err) {
      setError('Failed to load technician profile');
      console.error('Failed to fetch technician:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicianReviews = async () => {
    try {
      const response = await api.get(`/technicians/${params.id}/reviews`);
      setReviews(response.data);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  const handleCall = () => {
    if (technician?.userId.phone) {
      window.location.href = `tel:${technician.userId.phone}`;
    }
  };

  const handleBookService = () => {
    // Navigate to job posting with pre-selected technician
    window.location.href = `/post-job?technician=${params.id}`;
  };

  const texts = {
    ne: {
      loading: 'लोड हुँदैछ...',
      about: 'बारेमा',
      portfolio: 'पोर्टफोलियो',
      reviews: 'समीक्षाहरू',
      bookService: 'सेवा बुक गर्नुहोस्',
      call: 'कल गर्नुहोस्',
      message: 'सन्देश',
      verified: 'प्रमाणित',
      yearsExperience: 'वर्ष अनुभव',
      serviceAreas: 'सेवा क्षेत्रहरू',
      workingHours: 'कार्य समय',
      available: 'उपलब्ध',
      unavailable: 'अनुपलब्ध',
      skills: 'सीपहरू',
    pricing: 'मूल्य निर्धारण',
      perHour: '/घण्टा',
      perJob: '/काम',
      noReviews: 'अहिलेसम्म कुनै समीक्षा छैन',
      writeReview: 'समीक्षा लेख्नुहोस्'
    },
    en: {
      loading: 'Loading...',
      about: 'About',
      portfolio: 'Portfolio',
      reviews: 'Reviews',
      bookService: 'Book Service',
      call: 'Call',
      message: 'Message',
      verified: 'Verified',
      yearsExperience: 'years experience',
      serviceAreas: 'Service Areas',
      workingHours: 'Working Hours',
      available: 'Available',
      unavailable: 'Unavailable',
      skills: 'Skills',
      pricing: 'Pricing',
      perHour: '/hour',
      perJob: '/job',
      noReviews: 'No reviews yet',
      writeReview: 'Write a Review'
    }
  };

  const t = texts[language];

  if (loading) {
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

  if (!technician) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-red-500">{error || 'Technician not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              {technician.userId.profilePhoto ? (
                <img
                  src={technician.userId.profilePhoto}
                  alt={technician.userId.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {technician.userId.name}
                </h1>
                {technician.verificationStatus === 'approved' && (
                  <span className="flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                    {t.verified}
                  </span>
                )}
              </div>

              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-medium text-gray-900">
                    {technician.rating.toFixed(1)}
                  </span>
                  <span className="ml-1">({technician.reviewsCount} {language === 'ne' ? 'समीक्षाहरू' : 'reviews'})</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {technician.experience} {t.yearsExperience}
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {technician.userId.location.district}
                </div>
              </div>

              <div className="mt-3">
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                  technician.availability.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  <span className={`w-2 h-2 rounded-full mr-1 ${
                    technician.availability.available ? 'bg-green-400' : 'bg-red-400'
                  }`}></span>
                  {technician.availability.available ? t.available : t.unavailable}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleBookService}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                {t.bookService}
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={handleCall}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
                >
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  {t.call}
                </button>
                <button className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                  {t.message}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {(['about', 'portfolio', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {t[tab]}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                {/* Skills */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{t.skills}</h3>
                  <div className="flex flex-wrap gap-2">
                    {technician.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Service Areas */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{t.serviceAreas}</h3>
                  <div className="flex flex-wrap gap-2">
                    {technician.serviceAreas.map((area, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Working Hours */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{t.workingHours}</h3>
                  <p className="text-gray-600">
                    {technician.availability.workingHours.start} - {technician.availability.workingHours.end}
                  </p>
                </div>

                {/* Pricing */}
                {technician.pricing && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{t.pricing}</h3>
                    {technician.pricing.hourlyRate && (
                      <p className="text-gray-600">
                        रु.{technician.pricing.hourlyRate}{t.perHour}
                      </p>
                    )}
                    {technician.pricing.serviceRates.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {technician.pricing.serviceRates.map((rate, index) => (
                          <p key={index} className="text-gray-600">
                            {rate.service}: रु.{rate.price}{rate.unit === 'hour' ? t.perHour : t.perJob}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div>
                {technician.portfolio.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {technician.portfolio.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                          <CameraIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No portfolio images available
                  </p>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <div className="flex items-start space-x-3">
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
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900">{review.customerId.name}</h4>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <StarIcon
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="mt-1 text-gray-600">{review.comment}</p>
                            <p className="mt-1 text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">{t.noReviews}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
