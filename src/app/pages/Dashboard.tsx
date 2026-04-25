import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import {
  Shield,
  TrendingUp,
  Star,
  MessageSquare,
  Globe,
  Clock,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { Link } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { getUserScans } from '../services/scanService';
import { getSavedSites } from '../services/dashboardService';
import { getMyReviews } from '../services/reviewService';

type ScanItem = {
  id: string;
  url: string;
  score: number;
  verdict: string;
  source?: string;
  checkedAt?: any;
};

type SavedSite = {
  id: string;
  domain: string;
  url: string;
  riskScore: number;
  savedDate?: any;
};

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scans, setScans] = useState<ScanItem[]>([]);
  const [savedWebsites, setSavedWebsites] = useState<SavedSite[]>([]);
  const [myReviews, setMyReviews] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError('');

        const [scanData, savedData, reviews] = await Promise.all([
          getUserScans(),
          getSavedSites(),
          getMyReviews(),
        ]);

        setScans(scanData as ScanItem[]);
        setSavedWebsites(savedData as SavedSite[]);
        setMyReviews(reviews);
      } catch (err: any) {
        console.error('Dashboard load error:', err);
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    if (timestamp.toDate) return timestamp.toDate().toLocaleDateString();
    return String(timestamp);
  };

  const dashboardData = useMemo(() => {
    const normalizedScans = scans.map((scan) => {
      const rawScore = Number(scan.score || 0);
      const score = rawScore <= 1 ? Math.round(rawScore * 100) : Math.round(rawScore);

      let domain = scan.url || '';

      try {
        domain = new URL(scan.url).hostname.replace(/^www\./, '');
      } catch {
        domain = String(scan.url || '')
          .replace(/^https?:\/\//, '')
          .replace(/^www\./, '')
          .split('/')[0];
      }

      return {
        ...scan,
        score,
        domain,
      };
    });

    const totalScans = normalizedScans.length;
    const safeSites = normalizedScans.filter((scan) => scan.score <= 30).length;
    const warnings = normalizedScans.filter((scan) => scan.score > 30).length;

    const userRiskScore =
      totalScans > 0
        ? Math.round(
            normalizedScans.reduce((sum, scan) => sum + scan.score, 0) / totalScans
          )
        : 0;

    const domainMap = new Map<string, { visits: number; totalRisk: number }>();

    normalizedScans.forEach((scan) => {
      const current = domainMap.get(scan.domain) || {
        visits: 0,
        totalRisk: 0,
      };

      current.visits += 1;
      current.totalRisk += scan.score;

      domainMap.set(scan.domain, current);
    });

    const frequentWebsites = Array.from(domainMap.entries())
      .map(([domain, value]) => {
        const riskScore = Math.round(value.totalRisk / value.visits);

        let status = 'safe';
        if (riskScore > 60) status = 'warning';
        else if (riskScore > 30) status = 'moderate';

        return {
          domain,
          visits: value.visits,
          riskScore,
          status,
        };
      })
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 5);

    return {
      userRiskScore,
      totalScans,
      safeSites,
      warnings,
      frequentWebsites,
      stats: [
        { label: 'Total Scans', value: totalScans.toLocaleString(), icon: Globe },
        { label: 'Safe Sites', value: safeSites.toLocaleString(), icon: CheckCircle },
        { label: 'Warnings', value: warnings.toLocaleString(), icon: AlertTriangle },
        { label: 'Reviews', value: myReviews.length.toLocaleString(), icon: MessageSquare },
      ],
    };
  }, [scans, myReviews]);

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-green-600';
    if (score <= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskBgColor = (score: number) => {
    if (score <= 30) return 'bg-green-100';
    if (score <= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      safe: 'bg-green-100 text-green-700',
      moderate: 'bg-yellow-100 text-yellow-700',
      warning: 'bg-red-100 text-red-700',
    };
    return colors[status as keyof typeof colors] || colors.safe;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <main className="flex-1 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-lg text-gray-700">Loading dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <main className="flex-1 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-lg text-red-600">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Dashboard</h1>
            <p className="text-gray-600">
              Monitor your browsing safety and manage your RiskLens settings
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#4CAF50"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - dashboardData.userRiskScore / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">
                        {dashboardData.userRiskScore}
                      </div>
                      <div className="text-xs text-gray-500">/ 100</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-8 h-8 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Your Safety Score</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  This score is based on your saved scan history in RiskLens.
                  Lower scores indicate safer browsing habits.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">
                      {dashboardData.totalScans > 0
                        ? `${Math.round((dashboardData.safeSites / dashboardData.totalScans) * 100)}% Safe Sites`
                        : '0% Safe Sites'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm text-gray-700">
                      {dashboardData.totalScans > 0
                        ? `${Math.round((dashboardData.warnings / dashboardData.totalScans) * 100)}% Warnings`
                        : '0% Warnings'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">
                      {dashboardData.totalScans} Total Saved Scans
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardData.stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="w-8 h-8 text-green-600" />
                  <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                </div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Frequently Visited</h2>
              </div>
              <div className="space-y-4">
                {dashboardData.frequentWebsites.map((site, index) => (
                  <Link
                    key={index}
                    to={`/insights/${encodeURIComponent(site.domain)}`}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{site.domain}</span>
                      </div>
                      <div className="text-sm text-gray-500">{site.visits} visits</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(site.status)}`}>
                        {site.status}
                      </span>
                      <span className={`font-bold ${getRiskColor(site.riskScore)}`}>
                        {site.riskScore}
                      </span>
                    </div>
                  </Link>
                ))}

                {dashboardData.frequentWebsites.length === 0 && (
                  <p className="text-gray-500">No scan history yet.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Saved Websites</h2>
              </div>
              <div className="space-y-4">
                {savedWebsites.length === 0 ? (
                  <p className="text-gray-500">No saved websites yet.</p>
                ) : (
                  savedWebsites.map((site) => (
                    <Link
                      key={site.id}
                      to={`/insights/${encodeURIComponent(site.url || site.domain)}`}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{site.domain}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Saved {formatDate(site.savedDate)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-12 h-12 rounded-lg ${getRiskBgColor(site.riskScore)} flex items-center justify-center`}>
                          <span className={`font-bold ${getRiskColor(site.riskScore)}`}>
                            {site.riskScore}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Your Recent Reviews</h2>
              </div>
              <div className="space-y-4">
                {myReviews.length === 0 ? (
                  <p className="text-gray-500">No reviews yet.</p>
                ) : (
                  myReviews.map((review) => (
                    <div key={review.id} className="p-4 rounded-lg border border-gray-100">
                      <div className="flex items-start justify-between mb-2">
                        <Link
                          to={`/insights/${encodeURIComponent(review.url || review.domain)}`}
                          className="font-medium text-gray-900 hover:text-green-600 transition-colors"
                        >
                          {review.domain}
                        </Link>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{review.review}</p>
                      <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}