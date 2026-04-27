import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import {
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  Globe,
  Shield,
  Info,
  ShoppingCart,
  Film,
  Download,
  Phone,
  Search,
  Lock,
  Gift,
  TrendingUp,
  Newspaper,
  Wifi,
  Pill,
  Briefcase,
} from 'lucide-react';
import { Link } from 'react-router';
import { dangerousSiteCategories } from '../data/dangerousCategories';

const EXTENSION_DOWNLOAD_URL =
  'https://github.com/unixthug/risk-lens-phishing-detection/releases';

export function WhosAtRisk() {
  const scamCategories = dangerousSiteCategories;

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: typeof ShoppingCart } = {
      'Fake Shopping / Scam Stores': ShoppingCart,
      'Free Streaming / Piracy Sites': Film,
      'Free Software / Crack Sites': Download,
      'Fake Tech Support Sites': Phone,
      'Fake Antivirus / Security Scanners': Search,
      'Phishing Login Pages': Lock,
      'Fake Giveaway / Prize Sites': Gift,
      'Fake Crypto / Investment Platforms': TrendingUp,
      'Fake News / Misinformation Sites': Newspaper,
      'Torrent / Illegal File Sharing Sites': Wifi,
      'Fake Online Pharmacy Sites': Pill,
      'Fake Job / Work From Home Sites': Briefcase,
    };

    return iconMap[category] || AlertTriangle;
  };

  const getSafeAlternativeScore = (domain: string) => {
    const scores: { [key: string]: number } = {
      'amazon.com': 15,
      'ebay.com': 18,
      'walmart.com': 12,
      'target.com': 14,
      'netflix.com': 5,
      'hulu.com': 7,
      'youtube.com': 10,
      'tubi.tv': 8,
      'peacocktv.com': 9,
      'ninite.com': 6,
      'softpedia.com': 11,
      'support.microsoft.com': 3,
      'apple.com': 4,
      'malwarebytes.com': 5,
      'avast.com': 9,
      'coinbase.com': 16,
      'kraken.com': 15,
      'binance.com': 17,
      'apnews.com': 8,
      'reuters.com': 7,
      'bbc.com': 6,
      'npr.org': 7,
      'spotify.com': 8,
      'store.steampowered.com': 9,
      'archive.org': 4,
      'cvs.com': 12,
      'walgreens.com': 13,
      'safe.pharmacy': 10,
      'linkedin.com': 14,
      'indeed.com': 11,
      'glassdoor.com': 13,
      'usajobs.gov': 5,
    };

    return scores[domain] || 10;
  };

  const parseAlternative = (alt: string) => {
    const isUrl = alt.startsWith('http');

    if (!isUrl) {
      return {
        isUrl: false,
        url: '',
        description: alt,
        displayDomain: alt,
        scoreDomain: '',
      };
    }

    const urlMatch = alt.match(/^(https?:\/\/[^\s]+?)(?:\s+(.+))?$/);
    const url = urlMatch ? urlMatch[1] : alt;
    const description = urlMatch && urlMatch[2] ? urlMatch[2] : '';

    try {
      const parsed = new URL(url);
      const cleanHost = parsed.hostname.replace('www.', '');
      const displayDomain =
        cleanHost + (parsed.pathname !== '/' ? parsed.pathname : '');

      return {
        isUrl: true,
        url,
        description,
        displayDomain,
        scoreDomain: cleanHost,
      };
    } catch {
      return {
        isUrl: false,
        url: '',
        description: alt,
        displayDomain: alt,
        scoreDomain: '',
      };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Internet Safety Guide
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn to identify different types of scam websites and protect yourself while browsing.
              Understanding these threats is your first line of defense.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-12">
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">
                  How to Navigate the Internet Safely
                </h3>
                <p className="text-blue-800 mb-3">
                  Scammers use sophisticated techniques to create fake websites that look legitimate.
                  This guide helps you recognize common scam patterns, understand the security risks,
                  and choose safe alternatives.
                </p>

                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    Always verify the website URL before entering personal information
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    Look for HTTPS and a valid SSL certificate
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    Be skeptical of deals that seem too good to be true
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    Never disable your antivirus or download executable files from untrusted sources
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    Use RiskLens to get real-time security analysis before visiting unfamiliar sites
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {scamCategories.map((category, index) => {
              const CategoryIcon = getCategoryIcon(category.category);
              const hasUrlAlternatives = category.saferAlternatives.some((alt) =>
                alt.startsWith('http')
              );

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 border-b border-red-100">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <CategoryIcon className="w-6 h-6 text-red-600" />
                      </div>

                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                          {category.category}
                        </h2>

                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Example Patterns to Watch For:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {category.patternExamples.map((pattern, patternIndex) => (
                              <span
                                key={patternIndex}
                                className="px-3 py-1 bg-white border border-red-200 rounded-full text-sm font-mono text-red-700"
                              >
                                {pattern}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-white border border-red-200 rounded-lg p-4 mb-4">
                          <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Why This is Dangerous:
                          </h3>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {category.whyDangerous}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-900 mb-3">
                            🚨 Red Flags to Identify These Scams:
                          </p>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {category.securityIssues.map((issue, issueIndex) => (
                              <li
                                key={issueIndex}
                                className="flex items-start gap-2 text-sm text-gray-700 bg-white p-2 rounded border border-gray-200"
                              >
                                <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 flex-shrink-0" />
                                <span>{issue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                      <h3 className="font-bold text-gray-900">
                        {hasUrlAlternatives
                          ? '✅ Use These Safe Alternatives Instead'
                          : '✅ Safe Browsing Practices'}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.saferAlternatives.map((alt, altIndex) => {
                        const parsedAlt = parseAlternative(alt);

                        if (parsedAlt.isUrl) {
                          const riskScore = getSafeAlternativeScore(parsedAlt.scoreDomain);

                          return (
                            <Link
                              key={altIndex}
                              to={`/insights/${encodeURIComponent(parsedAlt.url)}`}
                              className="p-4 rounded-xl border-2 border-green-200 bg-green-50 hover:border-green-500 hover:shadow-md transition-all group"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <Globe className="w-4 h-4 text-green-600 flex-shrink-0" />
                                  <span className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors truncate">
                                    {parsedAlt.displayDomain}
                                  </span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                              </div>

                              {parsedAlt.description && (
                                <p className="text-xs text-gray-600 mb-2">
                                  {parsedAlt.description}
                                </p>
                              )}

                              <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-green-100">
                                <span className="text-sm font-bold text-green-700">
                                  Risk: {riskScore}/100
                                </span>
                              </div>
                            </Link>
                          );
                        }

                        return (
                          <div
                            key={altIndex}
                            className="p-4 rounded-xl border-2 border-green-200 bg-green-50"
                          >
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-green-600" />
                              <span className="font-semibold text-gray-900 text-sm">
                                {parsedAlt.description}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center mt-12">
            <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Stay Protected with RiskLens
            </h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Now that you know what to look for, let RiskLens do the heavy lifting. Get
              real-time security analysis, instant warnings about dangerous sites, and automatic
              suggestions for safer alternatives as you browse.
            </p>

            <a
              href={EXTENSION_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                Add to Browser
              </button>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}