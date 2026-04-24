import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { AlertTriangle, Shield, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useState } from 'react';
import { submitSiteReport } from '../services/reportService';
import emailjs from '@emailjs/browser';

export function ReportSite() {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError('');

      const reportId = await submitSiteReport({
        url,
        category,
        description,
      });

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          url,
          category,
          description,
          report_id: reportId,
          submitted_by: 'RiskLens User',
        },
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Report was saved, but email failed.');
      }

      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setUrl('');
        setDescription('');
        setCategory('');
      }, 3000);
    } catch (err: any) {
      console.error('Report submit error:', err);
      setError(err.message || 'Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    'Phishing/Scam',
    'Malware Distribution',
    'Data Breach',
    'Fraudulent E-commerce',
    'Identity Theft',
    'Illegal Content',
    'Privacy Violation',
    'Other',
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Report a Dangerous Site
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Help protect the community by reporting suspicious or dangerous websites.
              Your report helps us keep RiskLens updated with the latest threats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Community Protection</h3>
              <p className="text-sm text-gray-600">
                Your reports help protect millions of users
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
              <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Fast Response</h3>
              <p className="text-sm text-gray-600">
                We review reports within 24-48 hours
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
              <Send className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Anonymous Reporting</h3>
              <p className="text-sm text-gray-600">
                Your identity remains private
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            {submitted ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Report Submitted!
                </h2>
                <p className="text-gray-600">
                  Thank you for helping keep the internet safer. We'll review this site
                  and update our database.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Report Details
                </h2>

                <div className="mb-6">
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://suspicious-website.com"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Enter the full URL of the website you want to report
                  </p>
                </div>

                <div className="mb-6">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Threat Category <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder={
                      'Please describe what makes this site dangerous. Include details such as:\n• Suspicious behavior you noticed\n• Type of scam or threat\n• Any warnings from your browser\n• Personal experience or impact'
                    }
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Minimum 20 characters. Be as detailed as possible to help our review team.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Important Guidelines:</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Only report sites you believe are genuinely dangerous</li>
                        <li>Do not report sites simply because you disagree with their content</li>
                        <li>False reports may result in your account being flagged</li>
                        <li>If you're in immediate danger, contact local authorities first</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="text-red-600 text-sm mb-4">{error}</p>
                )}

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setUrl('');
                      setDescription('');
                      setCategory('');
                      setError('');
                    }}
                    className="px-6"
                    disabled={submitting}
                  >
                    Clear Form
                  </Button>

                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-8"
                    disabled={
                      submitting ||
                      !url ||
                      !description ||
                      !category ||
                      description.length < 20
                    }
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {submitting ? 'Submitting...' : 'Submit Report'}
                  </Button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-2">What Happens Next?</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-900 font-bold text-xs">1</span>
                Our security team reviews your report within 24-48 hours
              </p>
              <p className="flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-900 font-bold text-xs">2</span>
                We analyze the site using our automated security tools
              </p>
              <p className="flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-900 font-bold text-xs">3</span>
                The risk score is updated and users are warned about potential threats
              </p>
              <p className="flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-900 font-bold text-xs">4</span>
                You'll receive a notification once the review is complete, if logged in
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
