import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { useState } from 'react';
import { login, signup, loginWithGoogle } from '../services/authService';
import { Link, useSearchParams, useNavigate } from 'react-router';

export function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(
    searchParams.get('mode') === 'signup'
  );

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showError, setShowError] = useState(false);
  const [emailFormatError, setEmailFormatError] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (emailTouched && newEmail.length > 0) {
      setEmailFormatError(!validateEmail(newEmail));
    } else if (newEmail.length === 0) {
      setEmailFormatError(false);
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    if (email.length > 0) {
      setEmailFormatError(!validateEmail(email));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setShowError(false);
    setError('');
    setEmailTouched(true);

    if (!validateEmail(email) || email.length === 0) {
      setEmailFormatError(true);
      return;
    }

    setEmailFormatError(false);

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      if (isSignUp) {
        await signup(email, password);
        navigate('/verify-account');
        return;
      }

      const user = await login(email, password);

      if (!user.emailVerified) {
        navigate('/verify-account');
        return;
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Auth error:', err);

      if (!isSignUp) {
        setShowError(true);
      }

      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setLoading(true);
      setError('');
      setShowError(false);
      setEmailFormatError(false);

      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err.message || 'Google sign-in failed.');
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>

            <p className="text-gray-600 text-center mb-8">
              {isSignUp
                ? 'Sign up to access your RiskLens dashboard'
                : 'Log in to your RiskLens account'}
            </p>

            {showError && !isSignUp && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-red-800">Account Not Found</h3>
                    <p className="mt-1 text-sm text-red-700">
                      The email or password you entered is incorrect. Please try again or{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignUp(true);
                          setShowError(false);
                          setError('');
                        }}
                        className="font-semibold underline hover:text-red-900"
                      >
                        create a new account
                      </button>
                      .
                    </p>
                  </div>
                </div>
              </div>
            )}

            {emailFormatError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-red-800">Invalid Email Format</h3>
                    <p className="mt-1 text-sm text-red-700">
                      Please enter a valid email address.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && !showError && !emailFormatError && (
              <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="you@example.com"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {isSignUp && (
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              )}

              {!isSignUp && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 rounded border-gray-300" />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg h-12 text-base"
              >
                {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Log In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setShowError(false);
                    setEmailFormatError(false);
                    setEmailTouched(false);
                    setError('');
                  }}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  {isSignUp ? 'Log in' : 'Sign up'}
                </button>
              </p>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full border-gray-300 hover:bg-gray-50"
                >
                  Google
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}