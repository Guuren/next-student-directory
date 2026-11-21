'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryToken = params.get('token');

    if (queryToken) {
      localStorage.setItem('auth_token', queryToken);
      document.cookie = `auth_token=${encodeURIComponent(queryToken)}; path=/; max-age=86400; SameSite=Lax`;
    }

    const hasCookieToken = document.cookie.includes('auth_token=');
    const hasLocalToken = !!localStorage.getItem('auth_token');

    if (!hasCookieToken && !hasLocalToken && !queryToken) {
      router.replace('/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
