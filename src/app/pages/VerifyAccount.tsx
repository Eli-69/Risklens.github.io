import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import {
  resendVerificationEmail,
  refreshCurrentUser,
  logout,
} from '../services/authService';

export function VerifyAccount() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleResendVerification() {
    try {
      setLoading(true);
      setMessage('');
      setError('');

      await resendVerificationEmail();
      setMessage('Verification email sent again. Please check your inbox.');
    } catch (err: any) {
      console.error('Resend verification error:', err);
      setError(err.message || 'Failed to resend verification email.');
    } finally {
      setLoading(false);
    }
  }

  async function handleIHaveVerified() {
    try {
      setLoading(true);
      setMessage('');
      setError('');

      const user = await refreshCurrentUser();

      if (!user) {
        setError('No logged-in user found.');
        return;
      }

      const isGoogleUser = user.providerData.some(
        (provider) => provider.providerId === 'google.com'
      );

      if (isGoogleUser || user.emailVerified) {
        navigate('/dashboard');
        return;
      }

      setError('Your email is not verified yet. Please click the link in your email first.');
    } catch (err: any) {
      console.error('Refresh verification error:', err);
      setError(err.message || 'Failed to refresh verification status.');
    } finally {
      setLoading(false);
    }
  }

  async function handleBackToLogin() {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      navigate('/login');
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <main className="flex-1 flex items-center justify-center py-16">
        <div className="w-full max-w-md px-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Verify Your Email
            </h1>

            <p className="text-gray-600 mb-6">
              We&apos;ve sent a verification link to your email address. Please check your inbox and click the link to verify your account.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>Didn&apos;t receive the email?</strong>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Check your spam folder or click the button below to resend the verification email.
              </p>
            </div>

            {message && (
              <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-4">
                {message}
              </div>
            )}

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
                {error}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={handleResendVerification}
              disabled={loading}
              className="w-full border-gray-300 hover:bg-gray-50 mb-3"
            >
              {loading ? 'Sending...' : 'Resend Verification Email'}
            </Button>

            <Button
              type="button"
              onClick={handleIHaveVerified}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white mb-3"
            >
              I&apos;ve Verified My Email
            </Button>

            <Button
              type="button"
              onClick={handleBackToLogin}
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}