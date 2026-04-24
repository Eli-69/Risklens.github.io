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

  const cleanDomain = displayDomain.split('/')[0];

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

        const response = await fetch('/api/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ input: fullUrl }),
        });

        const data = await response.json();

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
  const riskScore = Math.round(result.score ?? result.riskScore ?? 0);
  const verdict =
    result.verdict ??
    (riskScore > 60 ? 'warning' : riskScore > 30 ? 'moderate' : 'legitimate');

  const siteData = {
    domain: displayDomain,
    riskScore,
    verdict,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-4">
          Is {siteData.domain} safe?
        </h1>

        <Button
          onClick={handleAddToDashboard}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6"
        >
          {siteSaved ? '✓ Saved to Dashboard' : 'Add to Dashboard'}
        </Button>

        <p className="mt-4">Risk Score: {siteData.riskScore}</p>
        <p>Verdict: {siteData.verdict}</p>
      </div>

      <Footer />

      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold mb-3">Sign In Required</h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to save sites to your dashboard.
            </p>

            <div className="flex gap-3">
              <Button onClick={() => setShowLoginPrompt(false)}>
                Cancel
              </Button>

              <Button onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}