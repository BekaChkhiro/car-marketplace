import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import analyticsService from '../../../services/analyticsService';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Clock, 
  Globe, 
  Calendar,
  Activity,
  MousePointer,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: any) => void;
    dataLayer?: any[];
  }
}

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: { page: string; views: number }[];
  deviceTypes: { type: string; percentage: number }[];
  referralSources: { source: string; visits: number }[];
}

const Analytics: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    pageViews: 0,
    uniqueVisitors: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    topPages: [],
    deviceTypes: [],
    referralSources: []
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        // Fetch real data from Google Analytics API
        const data = await analyticsService.getDashboardData('30daysAgo', 'today');
        
        setAnalyticsData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'მობილური':
        return <Smartphone size={20} className="text-blue-500" />;
      case 'დესკტოპი':
        return <Monitor size={20} className="text-green-500" />;
      case 'ტაბლეტი':
        return <Tablet size={20} className="text-purple-500" />;
      default:
        return <Monitor size={20} className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ანალიტიკა</h1>
            <p className="text-gray-500 mt-1">საიტის ტრაფიკი და მომხმარებლის ქცევა</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={16} />
            <span>ბოლო 30 დღე</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
                <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 w-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Eye size={24} className="text-blue-600" />
                  </div>
                  <TrendingUp size={20} className="text-green-500" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">გვერდის ნახვები</h3>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.pageViews.toLocaleString()}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <Users size={24} className="text-green-600" />
                  </div>
                  <TrendingUp size={20} className="text-green-500" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">უნიკალური ვიზიტორები</h3>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.uniqueVisitors.toLocaleString()}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <MousePointer size={24} className="text-yellow-600" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Bounce Rate</h3>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.bounceRate}%</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Clock size={24} className="text-purple-600" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">საშუალო სესიის ხანგრძლივობა</h3>
                <p className="text-2xl font-bold text-gray-900">{formatDuration(analyticsData.avgSessionDuration)}</p>
              </div>
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Top Pages */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">ყველაზე პოპულარული გვერდები</h3>
                <div className="space-y-4">
                  {analyticsData.topPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">{index + 1}</span>
                        </div>
                        <span className="font-medium text-gray-700">{page.page}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{page.views.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">ნახვა</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Device Types */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">მოწყობილობის ტიპები</h3>
                <div className="space-y-4">
                  {analyticsData.deviceTypes.map((device, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getDeviceIcon(device.type)}
                        <span className="font-medium text-gray-700">{device.type}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{device.percentage}%</p>
                        <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${device.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Referral Sources */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">ტრაფიკის წყაროები</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {analyticsData.referralSources.map((source, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Globe size={20} className="text-primary" />
                    </div>
                    <p className="font-medium text-gray-700 mb-1">{source.source}</p>
                    <p className="text-xl font-bold text-gray-900">{source.visits.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">ვიზიტი</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Analytics Integration Notice */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <BarChart3 size={20} className="text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-900">Google Analytics</h3>
              </div>
              <p className="text-green-800 mb-4">
                ეს მონაცემები Google Analytics Reporting API-ს მეშვეობითაა მოპოვებული. 
                მონაცემები რეალურ დროში განახლება Google Analytics-იდან.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-700">
                <Activity size={16} />
                <span>რეალურ დროში განახლება: ყოველ 5 წუთში</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;