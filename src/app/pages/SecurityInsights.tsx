import { useParams, Link } from 'react-router';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Star, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useState, useEffect } from 'react';
import { saveScanResult } from '../services/scanService';

export function SecurityInsights() {
  const { domain } = useParams();

  // 🔥 URL NORMALIZATION (MATCH EXTENSION)
  const decodedInput = domain ? decodeURIComponent(domain).trim() : '';

  function normalizeUrl(input: string) {
    if (!input) return '';

    let url = input.startsWith('http') ? input : `https://${input}`;

    try {
      const parsed = new URL(url);

      // add www if missing (for common domains)
      if (
        !parsed.hostname.startsWith('www.') &&
        parsed.hostname.split('.').length === 2
      ) {
        parsed.hostname = `www.${parsed.hostname}`;
      }

      // ensure trailing slash
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analysisData, setAnalysisData] = useState<any>(null);

  const [userName, setUserName] = useState('');
  const [userReview, setUserReview] = useState('');
  const [userRating, setUserRating] = useState(0);

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
        console.log('MODEL SCORE:', data?.result?.score);
        console.log('MODEL VERDICT:', data?.result?.verdict);

        if (!response.ok) {
          throw new Error(data.error || 'Failed to analyze site');
        }

        setAnalysisData(data);

        // save scan (only if logged in)
        try {
          const savedScore =
            typeof data.result?.score === 'number'
              ? data.result.score
              : typeof data.result?.riskScore === 'number'
                ? data.result.riskScore
                : 0;

          const savedVerdict = data.result?.verdict ?? 'unknown';

          await saveScanResult({
            url: fullUrl,
            score: savedScore,
            verdict: savedVerdict,
            source: data.source,
          });
        } catch (err: any) {
          if (err?.message !== 'User not logged in') {
            console.log('Scan not saved:', err);
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

  // 🎯 SCORE HANDLING (MATCH MODEL BETTER)
  const result = analysisData?.result ?? {};

  const rawScore =
    typeof result.score === 'number'
      ? result.score
      : typeof result.riskScore === 'number'
        ? result.riskScore
        : 0;

  // ⚠️ DO NOT multiply by 100 — model already scaled inconsistently
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

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-green-600';
    if (score <= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBarColor = (score: number) => {
    if (score <= 30) return 'bg-green-500';
    if (score <= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="p-10">Analyzing...</div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="p-10 text-red-600">{error}</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-6 py-12 space-y-8">

        {/* MAIN CARD */}
        <div className="bg-white p-8 rounded-xl border">
          <h1 className="text-3xl font-bold mb-2">
            Is {displayDomain} safe?
          </h1>

          <div className={`text-4xl font-bold ${getRiskColor(riskScore)}`}>
            {riskScore}
          </div>

          <div className="mt-2 capitalize">
            Verdict: {verdict}
          </div>

          <div className="mt-2 text-sm text-gray-500">
            Source: {analysisData?.source}
          </div>

          <div className="mt-4">
            {whyFlagged.length > 0
              ? whyFlagged.join(', ')
              : 'No major issues detected'}
          </div>
        </div>

        {/* DETAILS */}
        <div className="bg-white p-8 rounded-xl border space-y-6">
          <h2 className="text-xl font-bold">Detailed Analysis</h2>

          <div>
            <div className="flex justify-between">
              <span>Security</span>
              <span>{riskScore}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded">
              <div
                className={`h-2 ${getBarColor(riskScore)}`}
                style={{ width: `${riskScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between">
              <span>Phishing</span>
              <span>{phishingScore}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded">
              <div
                className={`h-2 ${getBarColor(phishingScore)}`}
                style={{ width: `${phishingScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* DEBUG */}
        <div className="bg-white p-6 rounded border">
          <h3 className="font-bold mb-2">Debug Response</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(analysisData, null, 2)}
          </pre>
        </div>

      </div>

      <Footer />
    </div>
  );
}