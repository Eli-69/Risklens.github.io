import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import {
  Users,
  Search,
  MessageSquare,
  TrendingUp,
  Globe,
  Shield,
  AlertTriangle,
  CheckCircle,
  Star,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { getAllSiteReviews } from '../services/reviewService';

type Stats = {
  totalUsers: number;
  totalScans: number;
  totalComments: number;
  activeSites: number;
  riskySites: number;
  safeSites: number;
};

type FrequentlyBrowsedSite = {
  id: string;
  domain: string;
  scans: number;
  avgRisk: number;
  status: string;
};

type RecentActivityItem = {
  id: string;
  action: string;
  user: string;
  time: string;
};

type HelpRequest = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  time: string;
};

type ReportedSite = {
  id: string;
  url: string;
  category: string;
  reporter: string;
  description: string;
  status: string;
  time: string;
};

export function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalScans: 0,
    totalComments: 0,
    activeSites: 0,
    riskySites: 0,
    safeSites: 0,
  });

  const [frequentlyBrowsedSites, setFrequentlyBrowsedSites] = useState<FrequentlyBrowsedSite[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [reportedSites, setReportedSites] = useState<ReportedSite[]>([]);
  const [allReviews, setAllReviews] = useState<any[]>([]);

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);
        setError('');

        const [
          statsSnap,
          sitesSnap,
          activitySnap,
          helpSnap,
          reportsSnap,
          reviews,
        ] = await Promise.all([
          getDoc(doc(db, 'adminStats', 'overview')),
          getDocs(collection(db, 'frequentlyBrowsedSites')),
          getDocs(collection(db, 'recentActivity')),
          getDocs(collection(db, 'helpRequests')),
          getDocs(collection(db, 'siteReports')),
          getAllSiteReviews(),
        ]);

        if (statsSnap.exists()) {
          const data = statsSnap.data();
          setStats({
            totalUsers: Number(data.totalUsers || 0),
            totalScans: Number(data.totalScans || 0),
            totalComments: Number(data.totalComments || 0),
            activeSites: Number(data.activeSites || 0),
            riskySites: Number(data.riskySites || 0),
            safeSites: Number(data.safeSites || 0),
          });
        }

        setFrequentlyBrowsedSites(
          sitesSnap.docs.map((docItem) => ({
            id: docItem.id,
            domain: String(docItem.data().domain || ''),
            scans: Number(docItem.data().scans || 0),
            avgRisk: Number(docItem.data().avgRisk || 0),
            status: String(docItem.data().status || 'safe'),
          }))
        );

        setRecentActivity(
          activitySnap.docs.map((docItem) => ({
            id: docItem.id,
            action: String(docItem.data().action || ''),
            user: String(docItem.data().user || ''),
            time: String(docItem.data().time || ''),
          }))
        );

        setHelpRequests(
          helpSnap.docs.map((docItem) => ({
            id: docItem.id,
            name: String(docItem.data().name || ''),
            email: String(docItem.data().email || ''),
            subject: String(docItem.data().subject || ''),
            message: String(docItem.data().message || ''),
            status: String(docItem.data().status || 'pending'),
            time: docItem.data().time?.toDate
              ? docItem.data().time.toDate().toLocaleString()
              : 'Unknown date',
          }))
        );

        setReportedSites(
          reportsSnap.docs.map((docItem) => ({
            id: docItem.id,
            url: String(docItem.data().url || ''),
            category: String(docItem.data().category || ''),
            reporter: String(
              docItem.data().submittedByEmail ||
              docItem.data().submittedBy ||
              docItem.data().reporter ||
              'Anonymous'
            ),
            description: String(docItem.data().description || ''),
            status: String(docItem.data().status || 'pending'),
            time: docItem.data().createdAt?.toDate
              ? docItem.data().createdAt.toDate().toLocaleString()
              : String(docItem.data().time || 'Unknown date'),
          }))
        );

        setAllReviews(reviews);
      } catch (err: any) {
        console.error('Admin dashboard load error:', err);
        setError(err.message || 'Failed to load admin dashboard data.');
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, [timeRange]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    if (timestamp.toDate) return timestamp.toDate().toLocaleString();
    return String(timestamp);
  };

  const getRiskColor = (risk: number) => {
    if (risk < 20) return 'text-green-600';
    if (risk < 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    if (status === 'safe') return 'bg-green-100 text-green-700';
    if (status === 'moderate') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getHelpStatusBadge = (status: string) => {
    if (status === 'resolved') return 'bg-green-100 text-green-700';
    if (status === 'in-progress') return 'bg-blue-100 text-blue-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const getReportStatusBadge = (status: string) => {
    if (status === 'confirmed') return 'bg-red-100 text-red-700';
    if (status === 'under-review') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-6 pt-24 pb-16">
          <p className="text-lg text-gray-700">Loading admin dashboard...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-6 pt-24 pb-16">
          <p className="text-lg text-red-600">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  const moderateRiskCount = stats.activeSites - stats.safeSites - stats.riskySites;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-6 pt-24 pb-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor and manage RiskLens platform analytics</p>
          </div>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="size-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Search className="size-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Scans</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalScans.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="size-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Comments</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalComments.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Globe className="size-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Active Sites</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.activeSites.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="size-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Safe Sites</h3>
            </div>
            <p className="text-3xl font-bold text-green-600 mb-2">{stats.safeSites.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Risk score below 20</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="size-5 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Moderate Risk</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-600 mb-2">
              {moderateRiskCount.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Risk score 20-50</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="size-5 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900">High Risk Sites</h3>
            </div>
            <p className="text-3xl font-bold text-red-600 mb-2">{stats.riskySites.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Risk score above 50</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Browsed Sites</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Domain</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total Scans</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Avg Risk</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {frequentlyBrowsedSites.map((site) => (
                    <tr key={site.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Shield className="size-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{site.domain}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{site.scans.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <span className={`font-semibold ${getRiskColor(site.avgRisk)}`}>
                          {site.avgRisk}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(site.status)}`}>
                          {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {frequentlyBrowsedSites.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 px-4 text-gray-500">
                        No frequently browsed site data yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="pb-4 border-b border-gray-100 last:border-0">
                  <p className="font-medium text-gray-900 text-sm mb-1">{activity.action}</p>
                  <p className="text-sm text-gray-600 mb-1">{activity.user}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <p className="text-gray-500">No recent activity yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Help Requests</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                {helpRequests.filter((r) => r.status === 'pending').length} Pending
              </span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {helpRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{request.name}</h3>
                      <p className="text-sm text-gray-600">{request.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getHelpStatusBadge(request.status)}`}>
                      {request.status.replace('-', ' ').charAt(0).toUpperCase() + request.status.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Subject: {request.subject}</p>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{request.message}</p>
                  <p className="text-xs text-gray-500">{request.time}</p>
                </div>
              ))}
              {helpRequests.length === 0 && (
                <p className="text-gray-500">No help requests yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Reported Sites</h2>
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                {reportedSites.filter((r) => r.status === 'pending').length} Pending
              </span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {reportedSites.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 break-all">{report.url}</h3>
                      <p className="text-sm text-gray-600">Reporter: {report.reporter}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${getReportStatusBadge(report.status)}`}>
                      {report.status.replace('-', ' ').charAt(0).toUpperCase() + report.status.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-orange-600 mb-1">{report.category}</p>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{report.description}</p>
                  <p className="text-xs text-gray-500">{report.time}</p>
                </div>
              ))}
              {reportedSites.length === 0 && (
                <p className="text-gray-500">No reported sites yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* All Site Reviews */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Star className="size-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">All Site Reviews</h2>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
              {allReviews.length} Total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Domain</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">URL</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rating</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Review</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {allReviews.map((review) => (
                  <tr key={review.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{review.domain}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-blue-600 break-all max-w-[160px] block truncate" title={review.url}>
                        {review.url}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">
                        {review.userEmail || review.email || 'Anonymous'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`size-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-700 max-w-[240px] line-clamp-2">{review.review}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(review.createdAt ?? review.date)}
                      </span>
                    </td>
                  </tr>
                ))}
                {allReviews.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-4 px-4 text-gray-500">
                      No reviews yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Firebase Index Warning */}
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-yellow-800 mb-1">Firebase Composite Index Required</p>
              <p className="text-sm text-yellow-700">
                The reviews query uses <code className="bg-yellow-100 px-1 rounded">where('url', '==', url)</code> combined
                with <code className="bg-yellow-100 px-1 rounded">orderBy('createdAt', 'desc')</code>. Firestore requires
                a composite index for this. If you see a missing index error in the console, open the Firebase link
                provided in the error to create it automatically, or go to{' '}
                <span className="font-medium">Firestore → Indexes → Composite</span> and add an index on the{' '}
                <code className="bg-yellow-100 px-1 rounded">siteReviews</code> collection with fields{' '}
                <code className="bg-yellow-100 px1 rounded">url (Ascending)</code> and{' '}
                <code className="bg-yellow-100 px-1 rounded">createdAt (Descending)</code>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}