import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router';
import { Shield, Lock } from 'lucide-react';

export function RequireAuth() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <main className="flex-1 flex items-center justify-center py-16">
        <div className="w-full max-w-lg px-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 relative">
              <Shield className="w-10 h-10 text-gray-400" />
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Lock className="w-4 h-4 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Authentication Required
            </h1>

            <p className="text-gray-600 mb-8">
              Please sign up or log in to view your personalized RiskLens dashboard and track your browsing safety.
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => navigate('/login')}
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg h-12 text-base"
              >
                Log In
              </Button>

              <Button
                onClick={() => navigate('/login?mode=signup')}
                variant="outline"
                className="w-full border-gray-300 hover:bg-gray-50 rounded-lg h-12 text-base"
              >
                Create Account
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4">
                <strong>Why sign up?</strong>
              </p>

              <ul className="text-sm text-gray-600 text-left space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Track your browsing safety score</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>View detailed risk analysis for visited websites</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Save and manage your favorite secure sites</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Submit and view community reviews</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}