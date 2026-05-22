import { Navigate } from 'react-router-dom';

interface AdminGuardProps {
  children: React.ReactNode;
  user: { role?: string } | null;
}

function AdminGuard({ children, user }: AdminGuardProps) {
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export default AdminGuard;