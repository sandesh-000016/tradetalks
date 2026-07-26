import React from "react";

export default function LeaderboardLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl space-y-8 relative z-10">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <div className="h-6 w-48 bg-slate-900/60 border border-slate-800/40 rounded-full mx-auto animate-pulse" />
          <div className="h-10 w-96 bg-slate-900/60 border border-slate-800/40 rounded-xl mx-auto animate-pulse" />
          <div className="h-4 w-72 bg-slate-900/60 border border-slate-800/40 rounded-full mx-auto animate-pulse" />
        </div>

        {/* Podiums Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto pt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 h-64 flex flex-col justify-end items-center space-y-4 animate-pulse">
              <div className="w-16 h-16 rounded-full bg-slate-800" />
              <div className="h-4 w-28 bg-slate-800 rounded-full" />
              <div className="h-6 w-16 bg-slate-800 rounded-full" />
              <div className="h-8 w-24 bg-slate-800 rounded-xl" />
            </div>
          ))}
        </div>

        {/* Table Skeletons */}
        <div className="bg-slate-900/30 border border-slate-800/50 rounded-3xl overflow-hidden backdrop-blur-md">
          <div className="p-6 border-b border-slate-800/80 flex justify-between items-center">
            <div className="h-6 w-32 bg-slate-800 rounded-full animate-pulse" />
            <div className="h-8 w-64 bg-slate-800 rounded-xl animate-pulse" />
          </div>
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800/30 last:border-0 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-slate-800 rounded-lg" />
                  <div className="w-10 h-10 bg-slate-800 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-slate-800 rounded-full" />
                    <div className="h-3 w-16 bg-slate-800 rounded-full" />
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <div className="h-4 w-16 bg-slate-800 rounded-full" />
                  <div className="h-4 w-20 bg-slate-800 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
