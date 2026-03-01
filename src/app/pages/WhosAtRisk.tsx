import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { AlertTriangle, ShieldCheck, ArrowRight, Globe, Star } from 'lucide-react';
import { Link } from 'react-router';

export function WhosAtRisk() {
  const riskyWebsites = [
    {
      domain: 'sketchy-deals.com',
      riskScore: 77,
      category: 'E-commerce',
      issues: ['No SSL encryption', 'Data breaches reported', 'Suspicious payment methods'],
      safeAlternatives: [
        { domain: 'amazon.com', riskScore: 15, reason: 'Trusted marketplace with buyer protection' },
        { domain: 'ebay.com', riskScore: 18, reason: 'Secure transactions and verified sellers' },
      ]
    },
    {
      domain: 'free-movies-now.net',
      riskScore: 82,
      category: 'Streaming',
      issues: ['Malware detected', 'Phishing attempts', 'Illegal content distribution'],
      safeAlternatives: [
        { domain: 'netflix.com', riskScore: 5, reason: 'Legal streaming with strong security' },
        { domain: 'hulu.com', riskScore: 7, reason: 'Legitimate service with encrypted connections' },
        { domain: 'disneyplus.com', riskScore: 6, reason: 'Family-friendly and secure platform' },
      ]
    },
    {
      domain: 'cheap-pharma.biz',
      riskScore: 85,
      category: 'Healthcare',
      issues: ['Unlicensed pharmacy', 'Fake medications', 'Credit card theft reports'],
      safeAlternatives: [
        { domain: 'cvs.com', riskScore: 12, reason: 'Licensed pharmacy with secure checkout' },
        { domain: 'walgreens.com', riskScore: 13, reason: 'Verified prescriptions and data protection' },
      ]
    },
    {
      domain: 'download-cracked-apps.ru',
      riskScore: 88,
      category: 'Software',
      issues: ['Malware distribution', 'Pirated software', 'Ransomware detected'],
      safeAlternatives: [
        { domain: 'microsoft.com', riskScore: 4, reason: 'Official software with security updates' },
        { domain: 'apple.com', riskScore: 3, reason: 'Trusted app store with verification' },
        { domain: 'github.com', riskScore: 8, reason: 'Open source software with community review' },
      ]
    },
    {
      domain: 'quick-loan-approval.xyz',
      riskScore: 80,
      category: 'Finance',
      issues: ['Identity theft reports', 'Predatory lending', 'Unregulated financial services'],
      safeAlternatives: [
        { domain: 'bankofamerica.com', riskScore: 10, reason: 'FDIC insured with fraud protection' },
        { domain: 'wellsfargo.com', riskScore: 11, reason: 'Regulated banking with secure services' },
      ]
    },
    {
      domain: 'win-prize-now.click',
      riskScore: 92,
      category: 'Scam Sites',
      issues: ['Phishing scam', 'Identity theft', 'Malicious redirects'],
      safeAlternatives: [
        { domain: 'sweepstakes.com', riskScore: 25, reason: 'Legitimate prize site with transparency' },
        { domain: 'pch.com', riskScore: 22, reason: 'Established sweepstakes with real prizes' },
      ]
    },
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Who's at Risk?</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Protect yourself from dangerous websites. See high-risk sites that threaten your privacy and security, 
              along with safer alternatives you can trust.
            </p>
          </div>

          {/* Warning Banner */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-12">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-red-900 mb-2">Warning: High-Risk Websites</h3>
                <p className="text-red-800">
                  The websites listed below have been flagged for serious security concerns including malware, 
                  phishing attempts, data breaches, and fraudulent activities. Avoid visiting these sites and 
                  use the recommended safe alternatives instead.
                </p>
              </div>
            </div>
          </div>

          {/* Risky Websites List */}
          <div className="space-y-8">
            {riskyWebsites.map((site, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Risky Website Header */}
                <div className="bg-red-50 p-6 border-b border-red-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <h2 className="text-2xl font-bold text-gray-900">{site.domain}</h2>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                          {site.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Risk Score:</span>
                          <span className={`text-xl font-bold ${getRiskColor(site.riskScore)}`}>
                            {site.riskScore}/100
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/insights/${site.domain}`}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                    >
                      View Details
                    </Link>
                  </div>
                  
                  {/* Issues List */}
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Security Issues:</p>
                    <ul className="space-y-2">
                      {site.issues.map((issue, issueIndex) => (
                        <li key={issueIndex} className="flex items-center gap-2 text-sm text-red-800">
                          <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Safe Alternatives */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    <h3 className="font-bold text-gray-900">Safer Alternatives</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {site.safeAlternatives.map((alt, altIndex) => (
                      <Link
                        key={altIndex}
                        to={`/insights/${alt.domain}`}
                        className="p-4 rounded-xl border border-gray-200 hover:border-green-500 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                              {alt.domain}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                        </div>
                        <div className={`inline-flex items-center justify-center px-3 py-1 rounded-lg ${getRiskBgColor(alt.riskScore)} mb-2`}>
                          <span className={`text-sm font-bold ${getRiskColor(alt.riskScore)}`}>
                            {alt.riskScore}/100
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{alt.reason}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Stay Protected with RiskLens</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Add the RiskLens browser extension to get real-time warnings about dangerous websites 
              and automatic suggestions for safer alternatives as you browse.
            </p>
            <button className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
              Add to Browser
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}