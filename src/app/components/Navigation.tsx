import { Button } from './ui/button';
import { Link, useNavigate } from 'react-router';
import Logo from '../../assets/logo.svg';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';
import { useState } from 'react';

export function Navigation() {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();

  console.log('NAV STATE:', {
  email: user?.email,
  loading,
  isAuthenticated,
  isAdmin,
});

  const navigate = useNavigate();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const handleAuthClick = () => {
    if (isAuthenticated) {
      setShowSignOutConfirm(true);
    } else {
      navigate('/login');
    }
  };

  const confirmSignOut = async () => {
    try {
      await logout();
      setShowSignOutConfirm(false);
      navigate('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-1">
              <div className="flex items-center -translate-y-0.5">
                <img
                  src={Logo}
                  alt="RiskLens Logo"
                  className="h-12 w-auto transition-transform duration-300 hover:scale-110"
                />
              </div>
              <span className="text-xl font-semibold text-gray-900">RiskLens</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-700 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <Link to="/report-site" className="text-gray-700 hover:text-gray-900 transition-colors">
                Report a site
              </Link>
              <Link to="/whos-at-risk" className="text-gray-700 hover:text-gray-900 transition-colors">
                Who&apos;s at risk
              </Link>
              <Link to="/help" className="text-gray-700 hover:text-gray-900 transition-colors">
                Help
              </Link>
              <Link to="/dashboard" className="text-gray-700 hover:text-gray-900 transition-colors">
                Dashboard
              </Link>

              {!loading && isAdmin && (
                <Link to="/admin" className="text-gray-700 hover:text-gray-900 transition-colors">
                  Admin
                </Link>
              )}

              {!loading && (
                <button
                  type="button"
                  onClick={handleAuthClick}
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {isAuthenticated ? 'Sign out' : 'Log in'}
                </button>
              )}

              {!loading && user?.email && (
                <span className="text-sm text-gray-500">
                  {user.email}
                </span>
              )}
            </div>

            <Button className="bg-green-600 hover:bg-green-700 text-white rounded-md">
              Add to Browser
            </Button>
          </div>
        </div>
      </nav>

      {showSignOutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Sign Out?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to sign out? You&apos;ll need to log in again to access your dashboard and saved data.
            </p>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => setShowSignOutConfirm(false)}
                variant="outline"
                className="flex-1 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={confirmSignOut}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}