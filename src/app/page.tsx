'use client';

import { useAuth, AuthProvider } from '@/lib/auth-context';
import DashboardClient from './dashboard-client';
import { LoginPage } from '@/components/login-page';

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <DashboardClient />;
}

export default function Page() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
