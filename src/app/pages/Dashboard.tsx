import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Shield, TrendingUp, Star, MessageSquare, Globe, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router';

export function Dashboard() {
  // Mock data for demonstration
  const userRiskScore = 22; // Out of 100 (lower is better - less risk)
  
  const frequentWebsites = [
    { domain: 'github.com', visits: 142, riskScore: 8, status: 'safe' },
    { domain: 'stackoverflow.com', visits: 89, riskScore: 12, status: 'safe' },
    { domain: 'reddit.com', visits: 67, riskScore: 25, status: 'moderate' },
    { domain: 'amazon.com', visits: 45, riskScore: 15, status: 'safe' },
    { domain: 'youtube.com', visits: 38, riskScore: 20, status: 'safe' },
  ];

  const savedWebsites = [
    { domain: 'mozilla.org', riskScore: 5, savedDate: '2024-02-20' },
    { domain: 'wikipedia.org', riskScore: 10, savedDate: '2024-02-18' },
    { domain: 'developer.mozilla.org', riskScore: 7, savedDate: '2024-02-15' },
    { domain: 'npmjs.com', riskScore: 13, savedDate: '2024-02-12' },
  ];

  const recentComments = [
    { domain: 'example-shop.com', comment: 'Great security features, easy checkout process', date: '2024-02-25', rating: 5 },
    { domain: 'news-site.com', comment: 'Lots of trackers detected, be cautious', date: '2024-02-22', rating: 3 },
    { domain: 'tech-blog.com', comment: 'Secure and fast loading. Highly recommended!', date: '2024-02-20', rating: 5 },
  ];

  const stats = [
    { label: 'Total Scans', value: '1,247', icon: Globe },
    { label: 'Safe Sites', value: '892', icon: CheckCircle },
    { label: 'Warnings', value: '45', icon: AlertTriangle },
    { label: 'Reviews', value: '23', icon: MessageSquare },
  ];

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Dashboard</h1>
            <p className="text-gray-600">Monitor your browsing safety and manage your RiskLens settings</p>
          </div>

          {/* User Risk Score Card */}
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
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - userRiskScore / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{userRiskScore}</div>
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
                  Your browsing habits are generally safe! You visit mostly trusted websites with strong security measures. 
                  Keep up the good work and stay vigilant when exploring new sites.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">71% Safe Sites</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm text-gray-700">4% Warnings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">+5% This Week</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="w-8 h-8 text-green-600" />
                  <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                </div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Frequently Visited Websites */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Frequently Visited</h2>
              </div>
              <div className="space-y-4">
                {frequentWebsites.map((site, index) => (
                  <Link
                    key={index}
                    to={`/insights/${site.domain}`}
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
              </div>
            </div>

            {/* Saved Websites */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Saved Websites</h2>
              </div>
              <div className="space-y-4">
                {savedWebsites.map((site, index) => (
                  <Link
                    key={index}
                    to={`/insights/${site.domain}`}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{site.domain}</span>
                      </div>
                      <div className="text-sm text-gray-500">Saved {site.savedDate}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-12 h-12 rounded-lg ${getRiskBgColor(site.riskScore)} flex items-center justify-center`}>
                        <span className={`font-bold ${getRiskColor(site.riskScore)}`}>
                          {site.riskScore}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Comments */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Your Recent Reviews</h2>
              </div>
              <div className="space-y-4">
                {recentComments.map((comment, index) => (
                  <div key={index} className="p-4 rounded-lg border border-gray-100">
                    <div className="flex items-start justify-between mb-2">
                      <Link
                        to={`/insights/${comment.domain}`}
                        className="font-medium text-gray-900 hover:text-green-600 transition-colors"
                      >
                        {comment.domain}
                      </Link>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < comment.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{comment.comment}</p>
                    <p className="text-sm text-gray-500">{comment.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}