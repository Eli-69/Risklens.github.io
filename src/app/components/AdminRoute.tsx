import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function AdminRoute({ children }: { children: JSX.Element }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/require-auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}