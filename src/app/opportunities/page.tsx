"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OpportunitiesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard opportunities page
    router.push('/dashboard/opportunities');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
