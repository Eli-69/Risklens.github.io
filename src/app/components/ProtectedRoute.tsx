import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/require-auth" replace />;
  }

  const isGoogleUser = user.providerData.some(
    (provider) => provider.providerId === 'google.com'
  );

  if (!isGoogleUser && !user.emailVerified) {
    return <Navigate to="/verify-account" replace />;
  }

  return children;
}