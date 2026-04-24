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
          const savedScore =
            typeof data.result?.score === 'number'
              ? data.result.score
              : typeof data.result?.riskScore === 'number'
                ? data.result.riskScore
                : 0;

          const savedVerdict =
            data.result?.verdict ??
            (savedScore > 60
              ? 'warning'
              : savedScore > 30
                ? 'moderate'
                : 'legitimate');

          await saveScanResult({
            url: fullUrl,
            score: savedScore,
            verdict: savedVerdict,
            source: data.source,
          });
        } catch (saveError: any) {
          if (saveError?.message !== 'User not logged in') {
            console.log('Scan not saved:', saveError);
          }
        }
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
    if (score <= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBarColor = (score: number) => {
    if (score <= 30) return 'bg-green-500';
    if (score <= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleSubmitReview = () => {
    console.log('Review submitted:', { userName, userReview, userRating });
    setUserName('');
    setUserReview('');
    setUserRating(0);
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

  const result = analysisData?.result ?? {};

  const rawScore =
    typeof result.score === 'number'
      ? result.score
      : typeof result.riskScore === 'number'
        ? result.riskScore
        : 0;

  const riskScore = Math.round(rawScore);

  const phishingScore =
    typeof result.prob_phishing === 'number'
      ? Math.round(result.prob_phishing * 100)
      : 0;

  const verdict =
    result.verdict ??
    (riskScore > 60
      ? 'warning'
      : riskScore > 30
        ? 'moderate'
        : 'legitimate');

  const whyFlagged = Array.isArray(result.why_flagged)
    ? result.why_flagged
    : [];

  const cleanDomain = displayDomain.split('/')[0];

  const siteData = {
    domain: displayDomain,
    logo: `https://logo.clearbit.com/${cleanDomain}`,
    securityHistory: {
      dataBreaches: 'No recent breach data',
      serverCrash: 'No recent crash data',
    },
    riskScore,
    verdict,
    whyFlagged,
    source: analysisData?.source ?? 'unknown',
    detailedAnalysis: {
      security: {
        score: riskScore,
        text: `Verdict: ${verdict}`,
      },
      phishing: {
        score: phishingScore,
        text:
          whyFlagged.length > 0
            ? whyFlagged.join(', ')
            : 'No major phishing signals detected.',
      },
      tracking: {
        score: 0,
        text: 'Tracking analysis not connected yet.',
      },
      aiFlags: {
        score: 0,
        text: 'AI flag details not connected yet.',
      },
    },
    trustedSites: [
      'https://www.wikipedia.org',
      'https://archive.org',
      'https://www.gutenberg.org',
      'https://www.khanacademy.org',
      'https://www.nasa.gov',
      'https://www.nih.gov',
      'https://www.data.gov',
      'https://www.duolingo.com',
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
                  <div className={`text-3xl font-bold ${getRiskScoreColor(siteData.riskScore)} mb-1`}>
                    Risk Score: {siteData.riskScore}
                  </div>

                  <div className="text-gray-900 font-semibold">Verdict:</div>
                  <div className="text-gray-700 capitalize">{siteData.verdict}</div>

                  <div className="text-gray-900 font-semibold mt-4">Source:</div>
                  <div className="text-gray-700">{siteData.source}</div>

                  <div className="text-gray-900 font-semibold mt-4">Why flagged:</div>
                  <div className="text-gray-700">
                    {siteData.whyFlagged.length > 0
                      ? siteData.whyFlagged.join(', ')
                      : 'No major suspicious patterns detected.'}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-900 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Detailed Analysis Report
              </h2>

              <div className="space-y-6">
                {Object.entries(siteData.detailedAnalysis).map(([key, section]) => (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {key === 'aiFlags' ? 'AI Flags' : key}
                      </h3>
                      <span className="text-sm text-gray-600">{section.score}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full ${getBarColor(section.score)}`}
                        style={{ width: `${Math.min(section.score, 100)}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">{section.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-900 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                User Reports
              </h2>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">User2361242692194</div>
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="size-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700">
                      This site is very cool and awesome! I&apos;ve never had any problems with it.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-start gap-2 mb-4">
                  <MessageSquare className="size-6 text-gray-900" />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold text-gray-900 mb-2">Your Name:</label>
                    <Input
                      type="text"
                      placeholder="Enter your name..."
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full border-2 border-gray-900 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-900 mb-2">Your Rating:</label>
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
                              star <= userRating ? 'fill-yellow-400 text-yellow-400' : 'fill-none text-gray-400'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-900 mb-2">Your Review:</label>
                    <Textarea
                      placeholder="Share your experience good or bad..."
                      value={userReview}
                      onChange={(e) => setUserReview(e.target.value)}
                      className="w-full border-2 border-gray-900 rounded-lg min-h-32"
                    />
                  </div>

                  <Button
                    onClick={handleSubmitReview}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-8 h-12 font-semibold"
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border-2 border-gray-900 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                More trusted websites
              </h2>
              <ul className="space-y-2">
                {siteData.trustedSites.map((site, index) => (
                  <li key={index}>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Sign In Required</h2>
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