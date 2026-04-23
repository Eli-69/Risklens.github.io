import { Button } from './ui/button';
import logoImage from '../../assets/logo.svg';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export function Navigation() {
  const { isAuthenticated, logout, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const handleAuthClick = () => {
    if (isAuthenticated) {
      setShowSignOutConfirm(true);
    } else {
      navigate('/login');
    }
  };

  const confirmSignOut = () => {
    logout();
    setShowSignOutConfirm(false);
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoImage} alt="RiskLens Logo" className="h-10 w-auto" />
              <span className="text-xl font-semibold text-gray-900">RiskLens</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-700 hover:text-gray-900">
                Home
              </Link>
              <Link to="/report-site" className="text-gray-700 hover:text-gray-900">
                Report a site
              </Link>
              <Link to="/whos-at-risk" className="text-gray-700 hover:text-gray-900">
                Who's at risk
              </Link>
              <Link to="/help" className="text-gray-700 hover:text-gray-900">
                Help
              </Link>
              <Link to="/dashboard" className="text-gray-700 hover:text-gray-900">
                Dashboard
              </Link>

              {/* ✅ Admin link only shows for admins */}
              {!loading && isAdmin && (
                <Link to="/admin" className="text-red-600 font-semibold">
                  Admin
                </Link>
              )}

              <button
                onClick={handleAuthClick}
                className="text-gray-700 hover:text-gray-900"
              >
                {isAuthenticated ? 'Sign out' : 'Log in'}
              </button>
            </div>

            <Button className="bg-green-600 hover:bg-green-700 text-white rounded-md">
              Add to Browser
            </Button>
          </div>
        </div>
      </nav>

      {showSignOutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Sign Out?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to sign out?
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowSignOutConfirm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmSignOut}
                className="flex-1 bg-green-600 text-white"
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