import { useParams, Link, useNavigate } from 'react-router';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Star, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useState, useEffect } from 'react';
import { saveScanResult } from '../services/scanService';
import { saveSite } from '../services/dashboardService';
import { submitSiteReview, getReviewsForSite } from '../services/reviewService';
import { auth } from '../../lib/firebase';

export function SecurityInsights() {
  const { domain } = useParams();
  const navigate = useNavigate();

  const decodedInput = domain ? decodeURIComponent(domain).trim() : '';

  function normalizeUrl(input: string) {
    if (!input) return '';

    let url = input.startsWith('http') ? input : `https://${input}`;

    try {
      const parsed = new URL(url);

      if (
        !parsed.hostname.startsWith('www.') &&
        parsed.hostname.split('.').length === 2
      ) {
        parsed.hostname = `www.${parsed.hostname}`;
      }

      if (!parsed.pathname || parsed.pathname === '') {
        parsed.pathname = '/';
      }

      return parsed.toString();
    } catch {
      return url;
    }
  }

  const fullUrl = normalizeUrl(decodedInput);

  const displayDomain = fullUrl
    ? fullUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : 'example.com';

  const [userName, setUserName] = useState('');
  const [userReview, setUserReview] = useState('');
  const [userRating, setUserRating] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analysisData, setAnalysisData] = useState<any>(null);

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [siteSaved, setSiteSaved] = useState(false);

  const [siteReviews, setSiteReviews] = useState<any[]>([]);
  const [reviewError, setReviewError] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    async function loadInsights() {
      if (!fullUrl) return;

      try {
        setLoading(true);
        setError('');

        console.log('FULL URL SENT:', fullUrl);

        const response = await fetch('/api/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: fullUrl,
          }),
        });

        const data = await response.json();
        console.log('PREDICT RESPONSE:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Failed to analyze site');
        }

        setAnalysisData(data);

        try {
          const result = data.result ?? data;

          const savedRawScore =
            typeof result.score === 'number'
              ? result.score
              : typeof result.riskScore === 'number'
                ? result.riskScore
                : typeof result.prediction_score === 'number'
                  ? result.prediction_score * 100
                  : typeof result.prob_phishing === 'number'
                    ? result.prob_phishing * 100
                    : 0;

          const savedScore =
            savedRawScore <= 1
              ? Math.round(savedRawScore * 100)
              : Math.round(savedRawScore);

          const savedVerdict =
            result.verdict ??
            result.classification ??
            (savedScore >= 60
              ? 'dangerous'
              : savedScore >= 30
                ? 'suspicious'
                : 'safe');

          await saveScanResult({
            url: fullUrl,
            score: savedScore,
            verdict: savedVerdict,
            source: data.source ?? result.decision_source ?? 'ml',
          });
        } catch (saveError: any) {
          if (saveError?.message !== 'User not logged in') {
            console.log('Scan not saved:', saveError);
          }
        }

        const reviews = await getReviewsForSite(fullUrl);
        setSiteReviews(reviews);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    loadInsights();
  }, [fullUrl]);

  const getRiskScoreColor = (score: number) => {
    if (score <= 30) return 'text-green-600';
    if (score <= 60) return 'text-orange-500';
    return 'text-red-600';
  };

  const getClassificationBadge = (classification: string) => {
    switch (classification) {
      case 'safe':
      case 'legitimate':
        return { bg: 'bg-green-100', text: 'text-green-700', label: 'Safe' };
      case 'suspicious':
      case 'warning':
      case 'moderate':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Suspicious' };
      case 'dangerous':
      case 'phishing':
      case 'malicious':
        return { bg: 'bg-red-100', text: 'text-red-700', label: 'Dangerous' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Unknown' };
    }
  };

  const getRecommendedActionColor = (classification: string) => {
    switch (classification) {
      case 'safe':
      case 'legitimate':
        return 'border-green-600';
      case 'suspicious':
      case 'warning':
      case 'moderate':
        return 'border-yellow-600';
      case 'dangerous':
      case 'phishing':
      case 'malicious':
        return 'border-red-600';
      default:
        return 'border-gray-600';
    }
  };

  const handleSubmitReview = async () => {
    try {
      setReviewSubmitting(true);
      setReviewError('');
      if (!auth.currentUser) {
        setShowLoginPrompt(true);
        return;
      }
      await submitSiteReview({
        name: userName,
        rating: userRating,
        review: userReview,
        url: fullUrl,
        domain: cleanDomain,
      });
      const updatedReviews = await getReviewsForSite(fullUrl);
      setSiteReviews(updatedReviews);
      setUserName('');
      setUserReview('');
      setUserRating(0);
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-6 py-12">
          <p className="text-lg text-gray-700">Analyzing site...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-6 py-12">
          <p className="text-lg text-red-600">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  const result = analysisData?.result ?? analysisData ?? {};

  const rawScore =
    typeof result.score === 'number'
      ? result.score
      : typeof result.riskScore === 'number'
        ? result.riskScore
        : typeof result.prediction_score === 'number'
          ? result.prediction_score * 100
          : typeof result.prob_phishing === 'number'
            ? result.prob_phishing * 100
            : 0;

  const riskScore =
    rawScore <= 1 ? Math.round(rawScore * 100) : Math.round(rawScore);

  const shouldWarn =
    typeof result.should_warn === 'boolean'
      ? result.should_warn
      : riskScore >= 30;

  const shouldBlock =
    typeof result.should_block === 'boolean'
      ? result.should_block
      : riskScore >= 60;

  const classification =
    shouldBlock
      ? 'dangerous'
      : shouldWarn
        ? 'suspicious'
        : 'safe';

  const recommendedAction =
    shouldBlock
      ? 'Do not use this site. It shows strong phishing or malicious patterns.'
      : shouldWarn
        ? 'Proceed with caution. This site shows some suspicious signals.'
        : 'No major risks detected. This site appears safe based on the current scan.';

  const aiOverview =
    typeof result.ai_feedback === 'string' && result.ai_feedback.trim().length > 0
      ? result.ai_feedback
      : Array.isArray(result.why_flagged) && result.why_flagged.length > 0
        ? result.why_flagged.join(' ')
        : 'No detailed AI explanation was returned by the model.';

  const signals = Array.isArray(result.why_flagged)
    ? result.why_flagged
    : Array.isArray(result.signals)
      ? result.signals
      : [];

  const certificateCheck = result.certificate_check ?? {};

  const sslCertificate = {
    checked: Boolean(certificateCheck.checked),
    hasSSL: certificateCheck.checked ? Boolean(certificateCheck.cert_valid) : false,
    isExpired: certificateCheck.checked ? Boolean(certificateCheck.cert_expired) : false,
  };

  const cleanDomain = displayDomain.split('/')[0];

  const siteData = {
    domain: displayDomain,
    logo: `https://logo.clearbit.com/${cleanDomain}`,
    riskScore,
    classification,
    recommendedAction,
    aiOverview,
    signals,
    sslCertificate,
    trustedSites: [
      {
        category: '🔍 Search & Tools',
        sites: [
          'https://www.google.com',
          'https://www.bing.com',
          'https://duckduckgo.com',
          'https://www.yahoo.com',
          'https://www.wolframalpha.com',
        ],
      },
      {
        category: '🎓 Education & Learning',
        sites: [
          'https://www.khanacademy.org',
          'https://www.coursera.org',
          'https://www.edx.org',
          'https://ocw.mit.edu',
          'https://www.nationalgeographic.com',
          'https://www.bbc.com',
          'https://www.si.edu',
        ],
      },
      {
        category: '🛒 Shopping & E-commerce',
        sites: [
          'https://www.amazon.com',
          'https://www.walmart.com',
          'https://www.target.com',
          'https://www.bestbuy.com',
          'https://www.ebay.com',
          'https://www.etsy.com',
          'https://www.apple.com',
        ],
      },
      {
        category: '🍿 Movies, TV & Streaming',
        sites: [
          'https://www.netflix.com',
          'https://www.disneyplus.com',
          'https://www.hulu.com',
          'https://www.youtube.com',
          'https://www.imdb.com',
        ],
      },
      {
        category: '🚗 Cars & Automotive',
        sites: [
          'https://www.carmax.com',
          'https://www.autotrader.com',
          'https://www.kbb.com',
          'https://www.cars.com',
          'https://www.edmunds.com',
        ],
      },
      {
        category: '🥦 Groceries & Food',
        sites: [
          'https://www.instacart.com',
          'https://www.wholefoodsmarket.com',
          'https://www.kroger.com',
          'https://www.hellofresh.com',
          'https://www.doordash.com',
        ],
      },
      {
        category: '🎁 Giveaways, Deals & Discounts',
        sites: [
          'https://www.joinhoney.com',
          'https://www.retailmenot.com',
          'https://www.slickdeals.net',
          'https://www.groupon.com',
          'https://www.rakuten.com',
        ],
      },
      {
        category: '💼 Tech & Productivity',
        sites: [
          'https://www.microsoft.com',
          'https://www.github.com',
          'https://stackoverflow.com',
          'https://www.dropbox.com',
          'https://www.notion.so',
        ],
      },
      {
        category: '🌐 News & Information',
        sites: [
          'https://www.cnn.com',
          'https://www.nytimes.com',
          'https://www.reuters.com',
          'https://www.npr.org',
        ],
      },
      {
        category: '🏛️ Government & Official',
        sites: [
          'https://www.usa.gov',
          'https://www.irs.gov',
        ],
      },
    ],
  };

  const handleAddToDashboard = async () => {
    if (!auth.currentUser) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      await saveSite({
        domain: cleanDomain,
        url: fullUrl,
        riskScore: siteData.riskScore,
      });

      setSiteSaved(true);
      setTimeout(() => setSiteSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save site:', err);
    }
  };

  const badge = getClassificationBadge(siteData.classification);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border-2 border-gray-900 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-white rounded-lg border-2 border-gray-900 flex items-center justify-center p-4">
                    <img
                      src={siteData.logo}
                      alt={siteData.domain}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;
                      }}
                    />
                  </div>

                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Is {siteData.domain} safe?
                    </h1>
                    <Button
                      onClick={handleAddToDashboard}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6"
                    >
                      {siteSaved ? '✓ Saved to Dashboard' : 'Add to Dashboard'}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className={`text-3xl font-bold ${getRiskScoreColor(siteData.riskScore)} mb-3`}>
                    Risk Score: {siteData.riskScore}%
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-gray-900 font-semibold">Classification:</span>
                    <span className={`px-4 py-2 rounded-full font-semibold ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                  </div>

                  <div className={`bg-gray-100 border-l-4 ${getRecommendedActionColor(siteData.classification)} p-4 rounded`}>
                    <div className="text-gray-900 font-semibold mb-1">
                      Recommended Action:
                    </div>
                    <div className="text-gray-700 font-medium">
                      {siteData.recommendedAction}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-900 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                AI Overview
              </h2>

              <div className="space-y-6">
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    {siteData.aiOverview}
                  </p>
                </div>

                {siteData.signals.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Key Signals
                    </h3>
                    <ul className="space-y-2">
                      {siteData.signals.map((signal: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="mt-2 w-1.5 h-1.5 bg-gray-900 rounded-full flex-shrink-0" />
                          <span>{signal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    SSL Certificate Status
                  </h3>

                  {siteData.sslCertificate.checked ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Certificate Checked:</span>
                        <span className="font-semibold text-green-600">Yes ✓</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Has Valid SSL Certificate:</span>
                        <span className={`font-semibold ${siteData.sslCertificate.hasSSL ? 'text-green-600' : 'text-red-600'}`}>
                          {siteData.sslCertificate.hasSSL ? 'Yes ✓' : 'No ✗'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Certificate Expired:</span>
                        <span className={`font-semibold ${siteData.sslCertificate.isExpired ? 'text-red-600' : 'text-green-600'}`}>
                          {siteData.sslCertificate.isExpired ? 'Yes ✗' : 'No ✓'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">
                      Certificate check was not available for this scan.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-900 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                User Reports
              </h2>

              {siteReviews.length > 0 ? (
                <div className="space-y-4 mb-8">
                  {siteReviews.map((review, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 mb-1">
                            {review.name || 'Anonymous'}
                          </div>
                          <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`size-4 ${
                                  star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-none text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-700">{review.review}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm mb-8">
                  No reviews yet. Be the first to share your experience!
                </p>
              )}

              <div className="mt-8">
                <div className="flex items-start gap-2 mb-4">
                  <MessageSquare className="size-6 text-gray-900" />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold text-gray-900 mb-2">
                      Your Name:
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter your name..."
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full border-2 border-gray-900 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-900 mb-2">
                      Your Rating:
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`size-6 cursor-pointer transition-colors ${
                              star <= userRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-none text-gray-400'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-900 mb-2">
                      Your Review:
                    </label>
                    <Textarea
                      placeholder="Share your experience good or bad..."
                      value={userReview}
                      onChange={(e) => setUserReview(e.target.value)}
                      className="w-full border-2 border-gray-900 rounded-lg min-h-32"
                    />
                  </div>

                  {reviewError && (
                    <p className="text-red-600 text-sm">{reviewError}</p>
                  )}

                  <Button
                    onClick={handleSubmitReview}
                    disabled={reviewSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-8 h-12 font-semibold disabled:opacity-50"
                  >
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border-2 border-gray-900 p-6 sticky top-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                More trusted websites
              </h2>

              <div className="space-y-4">
                {siteData.trustedSites.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                      {category.category}
                    </h3>

                    <ul className="space-y-1 ml-2">
                      {category.sites.map((site, siteIndex) => (
                        <li key={siteIndex}>
                          <a
                            href={site}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm break-all"
                          >
                            {site}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Try it for yourself.
          </h2>
          <Link to="/">
            <Button className="bg-green-600 hover:bg-green-700 text-white rounded-md px-8 h-12">
              Add to Browser →
            </Button>
          </Link>
        </div>
      </div>

      <Footer />

      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Sign In Required
            </h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to save sites to your dashboard. Sign in now to keep track of your saved websites and their security scores.
            </p>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowLoginPrompt(false)}
                variant="outline"
                className="flex-1 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>

              <Button
                onClick={() => navigate('/login')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}