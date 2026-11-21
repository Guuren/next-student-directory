'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuthStudent } from '@/types/student';
import { Users, Server, RefreshCw, LogOut, GraduationCap, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthStudent | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    // Read student user from cookie or localStorage
    try {
      const match = document.cookie.match(/(^|;)\s*student_user=([^;]+)/);
      if (match) {
        setUser(JSON.parse(decodeURIComponent(match[2])));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
      setLoggingOut(false);
    }
  }

  const isSSR = pathname === '/students-ssr';
  const isISR = pathname === '/students-isr';

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white">
                  NEUST CICT
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  IPT02
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Student Directory & Performance Benchmarks
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <Link
              href="/students-ssr"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isSSR
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Server className="w-4 h-4 text-amber-400" />
              <span>SSR Directory</span>
              <span className="text-[10px] hidden md:inline-block px-1.5 py-0.5 rounded bg-black/30 text-amber-200">
                Dynamic
              </span>
            </Link>

            <Link
              href="/students-isr"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isISR
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <span>ISR Directory</span>
              <span className="text-[10px] hidden md:inline-block px-1.5 py-0.5 rounded bg-black/30 text-emerald-200">
                Static (60s)
              </span>
            </Link>
          </nav>

          {/* User profile & Logout */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="hidden lg:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/60 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-medium text-slate-200">{user.student_name}</span>
                <span className="text-slate-400 font-mono">({user.student_id})</span>
              </div>
            ) : null}

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center space-x-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{loggingOut ? 'Signing out...' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
