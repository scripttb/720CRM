"use client";

import { useAuth } from '@/contexts/AuthContext';
import { CRMSidebar } from '@/components/crm/CRMSidebar';
import { CRMHeader } from '@/components/crm/CRMHeader';
import { LoginForm } from '@/components/crm/LoginForm';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="flex h-screen bg-background">
      <CRMSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <CRMHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
