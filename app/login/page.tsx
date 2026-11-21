'use client';

import { useState } from 'react';
import { GraduationCap, Lock, User, ArrowRight, AlertCircle, KeyRound, Check, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filled, setFilled] = useState(false);

  function fillDemo() {
    setStudentId('2026-90000');
    setPassword('password123');
    setFilled(true);
    setError(null);
    setTimeout(() => setFilled(false), 2000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const id = studentId.trim();
    const pass = password;

    try {
      let token: string | null = null;
      let student: any = null;

      // 1. Try internal Next.js auth route
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: id, password: pass }),
        });
        const data = await res.json();
        if (res.ok && data.token) {
          token = data.token;
          student = data.student;
        } else if (!res.ok && res.status === 401) {
          throw new Error(data.message || 'Invalid Student ID or Password.');
        }
      } catch (err: any) {
        // If it was an explicit invalid credentials error, rethrow
        if (err.message && err.message.toLowerCase().includes('invalid')) {
          throw err;
        }
        console.warn('Internal /api/auth/login failed, attempting direct Netlify API:', err);
      }

      // 2. Fallback to direct Netlify API if needed
      if (!token) {
        const directRes = await fetch('https://ipt02-student-directory.netlify.app/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: id, password: pass }),
        });
        const directData = await directRes.json();
        if (!directRes.ok) {
          throw new Error(directData.message || 'Invalid Student ID or Password.');
        }
        token = directData.token;
        student = directData.student;
      }

      if (!token) {
        throw new Error('Authentication failed: No token received from server.');
      }

      // Store in localStorage
      localStorage.setItem('auth_token', token);
      if (student) {
        localStorage.setItem('student_user', JSON.stringify(student));
      }

      // Ensure cookie is explicitly set in the browser for SSR Server Components
      document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax`;
      if (student) {
        document.cookie = `student_user=${encodeURIComponent(JSON.stringify(student))}; path=/; max-age=86400; SameSite=Lax`;
      }

      setSuccess(true);

      // Full page navigation ensures fresh cookies are sent to the SSR Server Component
      setTimeout(() => {
        window.location.href = `/students-ssr?token=${encodeURIComponent(token!)}`;
      }, 300);

    } catch (err: any) {
      console.error('[Login Error]', err);
      setError(err.message || 'Failed to authenticate. Please check your credentials.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-900/20 via-slate-900/10 to-transparent blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* University Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 shadow-xl shadow-indigo-600/30 text-white mb-4">
            <GraduationCap className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            NEUST CICT
          </h1>
          <p className="text-xs uppercase tracking-widest text-amber-400 font-bold mt-1">
            IPT02 Student Directory Portal
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Sign in with your Student ID to access SSR and ISR directories
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl py-8 px-6 sm:px-8 shadow-2xl rounded-3xl">
          {/* Demo Fill Helper Card */}
          <div className="mb-6 p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between gap-3">
            <div className="text-xs">
              <span className="font-semibold text-amber-300 block">Need test credentials?</span>
              <span className="text-slate-400">ID: 2026-90000 | Pass: password123</span>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all flex-shrink-0"
            >
              {filled ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Filled!</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Use Demo</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start space-x-3 text-red-300 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Error</p>
                <p className="text-xs text-red-300/90 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start space-x-3 text-emerald-300 text-sm">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Successful!</p>
                <p className="text-xs text-emerald-300/90 mt-0.5">Redirecting to Student Directory...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Student ID
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. 2026-90000"
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : success ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Redirecting...</span>
                </>
              ) : (
                <>
                  <span>Sign In with Student ID</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Architecture Information Footer */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-400">
              Connected to MySQL on Aiven Cloud via Netlify Serverless API
            </p>
            <div className="mt-2 flex items-center justify-center gap-3 text-[11px] text-slate-500 font-mono">
              <span>Next.js 16</span>
              <span>•</span>
              <span>JWT Authentication</span>
              <span>•</span>
              <span>k6 Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
