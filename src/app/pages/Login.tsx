import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { useState } from 'react';
import { login, signup, loginWithGoogle } from '../services/authService';
import { Link, useSearchParams } from "react-router";

export function Login() {
  const [searchParams] = useSearchParams();

  const [isSignUp, setIsSignUp] = useState(
    searchParams.get("mode") === "signup"
  );

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      // 🔥 SIGN UP FLOW
      if (isSignUp) {
        await signup(email, password);
        window.location.href = '/verify-account';
        return;
      }

      // 🔥 LOGIN FLOW
      const user = await login(email, password);

      if (!user.emailVerified) {
        window.location.href = '/verify-account';
        return;
      }

      window.location.href = '/dashboard';

    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setLoading(true);
      setError('');
      setMessage('');

      await loginWithGoogle();
      window.location.href = '/dashboard';

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

            <form className="space-y-4" onSubmit={handleSubmit}>

              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              )}

              {!isSignUp && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
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

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              {message && (
                <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                  {message}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white h-12"
              >
                {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Log In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                    setMessage('');
                  }}
                  className="text-green-600"
                >
                  {isSignUp ? 'Log in' : 'Sign up'}
                </button>
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-500 mb-2">Or continue with</p>

              <Button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                Google
              </Button>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}