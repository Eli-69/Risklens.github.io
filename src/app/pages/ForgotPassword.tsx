import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { resetPassword } from '../services/authService';

export function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await resetPassword(email);
      setEmailSent(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <main className="flex-1 flex items-center justify-center py-16">
        <div className="w-full max-w-md px-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">

            {!emailSent ? (
              <>
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                  Forgot Password?
                </h1>

                <p className="text-gray-600 text-center mb-8">
                  Enter your email and we&apos;ll send you a reset link.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />

                  {error && (
                    <div className="text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white"
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>

                <button
                  onClick={() => navigate('/login')}
                  className="mt-4 text-sm text-gray-600"
                >
                  Back to Login
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-center mb-4">
                  Check your email
                </h2>

                <p className="text-gray-600 text-center mb-6">
                  A reset link was sent to <strong>{email}</strong>.
                </p>

                <Button
                  onClick={() => setEmailSent(false)}
                  variant="outline"
                  className="w-full mb-3"
                >
                  Try Again
                </Button>

                <Button
                  onClick={() => navigate('/login')}
                  className="w-full bg-green-600 text-white"
                >
                  Back to Login
                </Button>
              </>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}