'use client';

import { Server, RefreshCw, Clock, Database, Zap, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  strategy: 'SSR' | 'ISR';
  renderedAt: string;
  durationMs?: number;
  source: 'api' | 'mysql';
  totalStudents: number;
}

export default function RenderMetricsBanner({
  strategy,
  renderedAt,
  durationMs,
  source,
  totalStudents,
}: Props) {
  const router = useRouter();

  const isSSR = strategy === 'SSR';

  return (
    <div
      className={`rounded-2xl p-5 mb-8 border shadow-lg backdrop-blur-sm ${
        isSSR
          ? 'bg-gradient-to-r from-indigo-950/70 via-slate-900/80 to-blue-950/60 border-indigo-500/30 shadow-indigo-950/40'
          : 'bg-gradient-to-r from-emerald-950/70 via-slate-900/80 to-teal-950/60 border-emerald-500/30 shadow-emerald-950/40'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Strategy Badges */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            {isSSR ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500 text-white shadow-sm">
                <Server className="w-3.5 h-3.5" />
                SSR (Server-Side Rendering)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500 text-slate-950 shadow-sm">
                <RefreshCw className="w-3.5 h-3.5" />
                ISR (Incremental Static Regeneration)
              </span>
            )}

            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {isSSR ? 'Dynamic: cache: no-store' : 'Static: revalidate = 60s'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-1">
            {isSSR ? 'Live Database Query on Every Request' : 'Pre-Rendered Static Content with Background Cache'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
            {isSSR
              ? 'This page executes on the server for each incoming HTTP request, fetching fresh student records directly from MySQL via the protected API. Ideal for real-time dynamic data.'
              : 'This page serves lightning-fast pre-generated HTML from the static cache and revalidates in the background every 60 seconds. Ideal for high traffic and maximum throughput.'}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <button
            onClick={() => router.refresh()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all shadow-sm active:scale-95"
          >
            <RefreshCcw className="w-4 h-4 text-amber-300" />
            <span>Refresh Page</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80">
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Rendered At</span>
          </div>
          <div className="text-xs sm:text-sm font-mono font-bold text-slate-200">
            {renderedAt}
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Execution Duration</span>
          </div>
          <div className="text-xs sm:text-sm font-mono font-bold text-slate-200">
            {durationMs !== undefined ? `${durationMs} ms` : 'Static Cache'}
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Data Source</span>
          </div>
          <div className="text-xs sm:text-sm font-semibold text-cyan-300 capitalize">
            {source === 'api' ? 'Protected API (JWT)' : 'Direct MySQL'}
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Enrolled Students</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-emerald-300">
            {totalStudents} records
          </div>
        </div>
      </div>
    </div>
  );
}
