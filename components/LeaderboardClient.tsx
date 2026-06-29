"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Star,
  X,
  Medal,
  CheckCircle2,
  TrendingDown,
  BarChart3,
  Shield,
} from "lucide-react";
import { fetchLeaderboard, Trader, Timeframe, BADGE_DEFINITIONS, determineTraderBadges } from "@/lib/leaderboardApi";

const getBadgeIcon = (iconName: string) => {
  switch (iconName) {
    case "medal":
      return <Medal className="w-5 h-5" />;
    case "star":
      return <Star className="w-5 h-5 animate-pulse text-violet-400" />;
    case "check":
      return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
    case "down":
      return <TrendingDown className="w-5 h-5 text-blue-400" />;
    case "chart":
      return <BarChart3 className="w-5 h-5 text-fuchsia-400" />;
    case "shield":
      return <Shield className="w-5 h-5 text-rose-400" />;
    default:
      return <Star className="w-5 h-5 text-slate-400" />;
  }
};

const renderCustomBadge = (id: string, className = "w-10 h-10") => {
  switch (id) {
    case "final_winner":
      return (
        <svg className={className} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22 L9 32 L15 29 L21 32 L18 22 Z" fill="#D97706" />
          <path d="M24 22 L21 32 L27 29 L33 32 L30 22 Z" fill="#B45309" />
          <circle cx="18" cy="16" r="11" fill="url(#goldGradient)" stroke="#FBBF24" strokeWidth="1.5" />
          <circle cx="18" cy="16" r="8.5" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 1" />
          <path d="M13 20 H23 L25 14 L21 17 L18 13 L15 17 L13 14 Z" fill="#78350F" />
          <circle cx="13" cy="13" r="1" fill="#78350F" />
          <circle cx="18" cy="12" r="1" fill="#78350F" />
          <circle cx="23" cy="13" r="1" fill="#78350F" />
          <defs>
            <radialGradient id="goldGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(18 16) rotate(45) scale(11)">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </radialGradient>
          </defs>
        </svg>
      );
    case "top_rank_monthly":
      return (
        <svg className={className} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22 L9 32 L15 29 L21 32 L18 22 Z" fill="#D97706" />
          <path d="M24 22 L21 32 L27 29 L33 32 L30 22 Z" fill="#B45309" />
          <circle cx="18" cy="16" r="11" fill="url(#goldGradient)" stroke="#FBBF24" strokeWidth="1.5" />
          <circle cx="18" cy="16" r="8.5" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 1" />
          <text x="18" y="20.5" fill="#78350F" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif">1</text>
          <defs>
            <radialGradient id="goldGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(18 16) rotate(45) scale(11)">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </radialGradient>
          </defs>
        </svg>
      );
    case "weekly_top":
      return (
        <svg className={className} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22 L9 32 L15 29 L21 32 L18 22 Z" fill="#7C3AED" />
          <path d="M24 22 L21 32 L27 29 L33 32 L30 22 Z" fill="#6D28D9" />
          <circle cx="18" cy="16" r="11" fill="url(#purpleGradient)" stroke="#C084FC" strokeWidth="1.5" />
          <path d="M18 10 L20.2 14.5 L25 15.2 L21.5 18.6 L22.3 23.4 L18 21.1 L13.7 23.4 L14.5 18.6 L11 15.2 L15.8 14.5 Z" fill="#FFFFFF" />
          <defs>
            <radialGradient id="purpleGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(18 16) rotate(45) scale(11)">
              <stop offset="0%" stopColor="#E9D5FF" />
              <stop offset="70%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#7C3AED" />
            </radialGradient>
          </defs>
        </svg>
      );
    case "consistent_trader":
      return (
        <svg className={className} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 4 C24 4 28 6 28 12 C28 20 22 26 18 30 C14 26 8 20 8 12 C8 6 12 4 18 4 Z" fill="url(#greenGradient)" stroke="#34D399" strokeWidth="1.5" />
          <path d="M18 11 L19.8 14.8 L24 15.4 L21 18.3 L21.7 22.5 L18 20.5 L14.3 22.5 L15 18.3 L12 15.4 L16.2 14.8 Z" fill="#FFFFFF" />
          <defs>
            <radialGradient id="greenGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(18 17) rotate(45) scale(13)">
              <stop offset="0%" stopColor="#A7F3D0" />
              <stop offset="70%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </radialGradient>
          </defs>
        </svg>
      );
    case "low_drawdown":
      return (
        <svg className={className} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 4 C24 4 28 6 28 12 C28 20 22 26 18 30 C14 26 8 20 8 12 C8 6 12 4 18 4 Z" fill="url(#blueGradient)" stroke="#60A5FA" strokeWidth="1.5" />
          <path d="M18 11 L19.8 14.8 L24 15.4 L21 18.3 L21.7 22.5 L18 20.5 L14.3 22.5 L15 18.3 L12 15.4 L16.2 14.8 Z" fill="#FFFFFF" />
          <defs>
            <radialGradient id="blueGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(18 17) rotate(45) scale(13)">
              <stop offset="0%" stopColor="#BFDBFE" />
              <stop offset="70%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </radialGradient>
          </defs>
        </svg>
      );
    case "trader_of_the_week":
      return (
        <svg className={className} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22 L9 32 L15 29 L21 32 L18 22 Z" fill="#EA580C" />
          <path d="M24 22 L21 32 L27 29 L33 32 L30 22 Z" fill="#C2410C" />
          <circle cx="18" cy="16" r="11" fill="url(#orangeGradient)" stroke="#FDBA74" strokeWidth="1.5" />
          <path d="M18 10 L20.2 14.5 L25 15.2 L21.5 18.6 L22.3 23.4 L18 21.1 L13.7 23.4 L14.5 18.6 L11 15.2 L15.8 14.5 Z" fill="#FFFFFF" />
          <defs>
            <radialGradient id="orangeGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(18 16) rotate(45) scale(11)">
              <stop offset="0%" stopColor="#FFEDD5" />
              <stop offset="70%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EA580C" />
            </radialGradient>
          </defs>
        </svg>
      );
    case "best_risk_manager":
      return (
        <svg className={className} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 4 C24 4 28 6 28 12 C28 20 22 26 18 30 C14 26 8 20 8 12 C8 6 12 4 18 4 Z" fill="url(#tealGradient)" stroke="#2DD4BF" strokeWidth="1.5" />
          <path d="M18 11 L19.8 14.8 L24 15.4 L21 18.3 L21.7 22.5 L18 20.5 L14.3 22.5 L15 18.3 L12 15.4 L16.2 14.8 Z" fill="#FFFFFF" />
          <defs>
            <radialGradient id="tealGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(18 17) rotate(45) scale(13)">
              <stop offset="0%" stopColor="#CCFBF1" />
              <stop offset="70%" stopColor="#14B8A6" />
              <stop offset="100%" stopColor="#0F766E" />
            </radialGradient>
          </defs>
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="12" fill="#334155" stroke="#475569" strokeWidth="1.5" />
          <path d="M18 11 L19.8 14.8 L24 15.4 L21 18.3 L21.7 22.5 L18 20.5 L14.3 22.5 L15 18.3 L12 15.4 L16.2 14.8 Z" fill="#94A3B8" />
        </svg>
      );
  }
};

interface LeaderboardClientProps {
  initialTraders: Trader[];
}

export default function LeaderboardClient({ initialTraders }: LeaderboardClientProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("monthly");
  const [data, setData] = useState<Trader[]>(initialTraders);
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [selectedBadge, setSelectedBadge] = useState<any | null>(null);

  // Listen to timeframe changes and fetch from the API route (which is cached)
  useEffect(() => {
    // Skip loading for initial "monthly" load since it's pre-loaded on server
    if (timeframe === "monthly" && data === initialTraders) {
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchLeaderboard(timeframe)
      .then((rows) => {
        if (!cancelled) setData(rows);
      })
      .catch((e) => {
        if (!cancelled)
          setError(
            e instanceof Error ? e.message : "Failed to load leaderboard"
          );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [timeframe, initialTraders]);

  // Filter the leaderboard list by search query
  const filteredData = React.useMemo(() => {
    if (!data) return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return data;
    return data.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        String(t.id).toLowerCase().includes(q)
    );
  }, [data, searchQuery]);

  // Paginated chunk of filtered data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  // Generate dynamic page numbers for pagination controls
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="pt-12 pb-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 uppercase tracking-tight">
            Leaderboard
          </h1>
          <p className="text-lg text-slate-400">
            Top traders ranked by overall performance
          </p>
        </div>

        {/* Season Info Banner */}
        <div className="max-w-4xl mx-auto mb-10 bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="p-3 bg-brand-500/10 rounded-xl text-brand-400 border border-brand-500/20 shrink-0">
              <Shield className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-display font-bold text-white text-base uppercase tracking-wider mb-1">
                New Season Rules & Eligibility
              </h3>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                To keep the challenge fair, all participants must comply with the following global season rules to be eligible for any rankings, badges, or rewards:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-850/50">
                  <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Min Trades</div>
                  <div className="text-white text-sm font-semibold">10 Trades Required / Month</div>
                </div>
                <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-850/50">
                  <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Volume Scale</div>
                  <div className="text-white text-sm font-semibold">0.6 Lots per $100 Balance</div>
                </div>
                <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-850/50">
                  <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Risk Limit</div>
                  <div className="text-white text-sm font-semibold">Washout (100% Drawdown) = Out</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex bg-slate-900/80 p-1 rounded-lg border border-slate-800 backdrop-blur-sm w-full sm:w-auto overflow-x-auto">
            {(["all", "monthly", "weekly", "daily"] as Timeframe[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTimeframe(t);
                  setCurrentPage(1);
                }}
                className={`px-6 py-2 rounded-md text-sm font-medium capitalize whitespace-nowrap transition-all ${
                  timeframe === t
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                {t === "all" ? "All Time" : t}
              </button>
            ))}
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search trader..."
                className="w-full bg-slate-900/50 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4 font-medium">Rank</th>
                  <th className="px-6 py-4 font-medium">Trader</th>
                  <th className="px-6 py-4 font-medium text-right">Profit %</th>
                  <th className="px-6 py-4 font-medium text-right">
                    Drawdown %
                  </th>
                  <th className="px-6 py-4 font-medium text-center">
                    Win Rate
                  </th>
                  <th className="px-6 py-4 font-medium text-center">Badges</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {error ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-20 text-center text-rose-400"
                    >
                      {error}
                    </td>
                  </tr>
                ) : isLoading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-20 text-center text-slate-500"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        Loading leaderboard data...
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-20 text-center text-slate-500 font-medium"
                    >
                      No traders found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((trader) => (
                    <tr
                      key={trader.id}
                      className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
                      onClick={() => setSelectedTrader(trader)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800/50 border border-slate-700 font-display font-bold text-sm">
                          {trader.rank === 1 ? (
                            <Trophy className="w-4 h-4 text-accent-500" />
                          ) : trader.rank === 2 ? (
                            <Trophy className="w-4 h-4 text-slate-300" />
                          ) : trader.rank === 3 ? (
                            <Trophy className="w-4 h-4 text-amber-700" />
                          ) : (
                            trader.rank
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden border border-slate-600">
                              <img
                                src={trader.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trader.name)}`}
                                alt={trader.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {trader.status === "online" && (
                              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
                            )}
                          </div>
                          <span className="font-medium text-white">
                            {trader.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`font-display font-bold ${trader.profit >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          {trader.profit >= 0 ? "+" : ""}{(trader.profit ?? 0).toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-slate-300">
                          {(trader.drawdown ?? 0).toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-slate-300">{trader.winRate ?? 0}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          {(() => {
                            const earnedBadgeIds = trader.earnedBadges || determineTraderBadges({
                              rank: trader.rank,
                              profit: trader.profit,
                              drawdown: trader.drawdown,
                              winRate: trader.winRate,
                              volume: trader.volume,
                              totalBalance: trader.totalBalance,
                              tradesCount: trader.tradesCount,
                            }, timeframe);
                            if (earnedBadgeIds.length === 0) return <span className="text-slate-600">-</span>;
                            return (
                              <div className="flex items-center justify-center gap-1.5">
                                {earnedBadgeIds.map((badgeId) => {
                                  const badgeInfo = BADGE_DEFINITIONS[badgeId];
                                  if (!badgeInfo) return null;
                                  return (
                                    <button
                                      key={badgeId}
                                      onClick={(e) => {
                                        e.stopPropagation(); // Stop row click
                                        setSelectedBadge(badgeInfo);
                                      }}
                                      title={`${badgeInfo.title} - Click to see requirements`}
                                      className="transition-all duration-300 hover:scale-115 active:scale-90 cursor-pointer filter hover:brightness-110 shrink-0"
                                    >
                                      {renderCustomBadge(badgeId, "w-8 h-8")}
                                    </button>
                                  );
                                })}
                              </div>
                            );
                          })()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-brand-400 transition-colors" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-400">
              Showing{" "}
              <span className="font-medium text-white">
                {filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-white">
                {Math.min(currentPage * itemsPerPage, filteredData.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-white">
                {filteredData.length}
              </span>{" "}
              traders
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {getPageNumbers().map((page, index) => {
                if (page === "...") {
                  return (
                    <span key={`ellipsis-${index}`} className="px-2 text-slate-500">
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={`page-${page}`}
                    onClick={() => setCurrentPage(page as number)}
                    className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-brand-600 text-white"
                        : "hover:bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trader Profile Modal */}
      {selectedTrader && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setSelectedTrader(null)}
          ></div>
          <div className="relative w-full max-w-md glass-panel rounded-3xl overflow-hidden shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Fixed/Sticky Close Button */}
            <button
              onClick={() => setSelectedTrader(null)}
              className="absolute top-6 right-6 z-50 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white/70 hover:text-white transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Container */}
            <div className="overflow-y-auto flex-1 w-full rounded-b-3xl">
              {/* Modal Header */}
              <div className="h-32 bg-gradient-to-br from-brand-900 to-slate-900">
              </div>

            {/* Modal Body */}
            <div className="px-8 pb-8">
              <div className="relative -mt-16 mb-4 flex justify-between items-end">
                <div className="w-32 h-32 rounded-2xl bg-slate-800 border-4 border-slate-900 overflow-hidden shadow-xl">
                  <img
                    src={selectedTrader.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedTrader.name)}`}
                    alt={selectedTrader.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mb-2 text-center">
                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Current Rank
                  </div>
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-display font-bold text-xl shadow-lg shadow-accent-500/30">
                    {selectedTrader.rank}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                  {selectedTrader.name}
                  {selectedTrader.status === "online" && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  )}
                </h2>
                <p className="text-brand-400 text-sm">
                  {selectedTrader.title ?? "Trader"}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-900/50 rounded-xl p-4 text-center border border-slate-800">
                  <div className={`font-display font-bold text-xl mb-1 ${selectedTrader.profit >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {selectedTrader.profit >= 0 ? "+" : ""}{(selectedTrader.profit ?? 0).toFixed(2)}%
                  </div>
                  <div className="text-xs text-slate-500 uppercase">Profit</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 text-center border border-slate-800">
                  <div className="text-white font-display font-bold text-xl mb-1">
                    {selectedTrader.winRate ?? 0}%
                  </div>
                  <div className="text-xs text-slate-500 uppercase">
                    Win Rate
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 text-center border border-slate-800">
                  <div className="text-white font-display font-bold text-xl mb-1">
                    {(selectedTrader.drawdown ?? 0).toFixed(2)}%
                  </div>
                  <div className="text-xs text-slate-500 uppercase">
                    Drawdown
                  </div>
                </div>
              </div>

              {/* Live Alpari API Data Summary */}
              <div className="mb-8 bg-slate-900/60 rounded-xl p-4 border border-slate-800">
                <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider text-xs">
                  Account Summary (Live Data)
                </h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                  <div>
                    <span className="text-slate-500 block text-xs">Country</span>
                    <span className="text-white font-medium">{selectedTrader.country || "India"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Registered</span>
                    <span className="text-white font-medium">{selectedTrader.registrationDate || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Total Volume</span>
                    <span className="text-white font-medium">{selectedTrader.volume?.toFixed(2) ?? "0.00"} Lots</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Total Trades</span>
                    <span className="text-white font-medium">{selectedTrader.tradesCount ?? 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Net Deposits</span>
                    <span className="text-white font-medium">${selectedTrader.mtNetDeposits?.toFixed(2) ?? "0.00"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Total Balance</span>
                    <span className="text-white font-medium">${selectedTrader.totalBalance?.toFixed(2) ?? "0.00"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Account Equity</span>
                    <span className="text-white font-medium">${selectedTrader.totalEquity?.toFixed(2) ?? "0.00"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Settled Rebates</span>
                    <span className="text-emerald-400 font-medium">${selectedTrader.settledRebates?.toFixed(2) ?? "0.00"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Program</span>
                    <span className="text-white font-medium text-xs truncate block" title={selectedTrader.programName}>
                      {selectedTrader.programName || "Scheme 1.0, MT"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-medium text-slate-300 mb-3">
                  Badges & Medals Earned
                </h3>
                {(() => {
                  const earnedBadgeIds = selectedTrader.earnedBadges || determineTraderBadges({
                    rank: selectedTrader.rank,
                    profit: selectedTrader.profit,
                    drawdown: selectedTrader.drawdown,
                    winRate: selectedTrader.winRate,
                    volume: selectedTrader.volume,
                    totalBalance: selectedTrader.totalBalance,
                    tradesCount: selectedTrader.tradesCount,
                  }, timeframe);

                  if (earnedBadgeIds.length === 0) {
                    return <div className="text-xs text-slate-500 italic">No badges earned yet.</div>;
                  }

                  return (
                    <div className="grid grid-cols-1 gap-2.5">
                      {earnedBadgeIds.map((badgeId) => {
                        const badgeInfo = BADGE_DEFINITIONS[badgeId];
                        if (!badgeInfo) return null;
                        return (
                          <div
                            key={badgeId}
                            className={`flex gap-3 items-center rounded-xl p-2.5 border ${badgeInfo.color}`}
                          >
                            <div className="shrink-0">
                              {renderCustomBadge(badgeId, "w-8 h-8")}
                            </div>
                            <div className="text-left">
                              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                {badgeInfo.title}
                                {badgeInfo.subtitle && (
                                  <span className="text-[8px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-1 py-0.5 rounded font-black tracking-wider uppercase">
                                    {badgeInfo.subtitle}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                                {badgeInfo.desc}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {selectedTrader.activity && selectedTrader.activity.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-slate-300 mb-3">
                    Trading Activity{" "}
                    <span className="text-slate-500">(Recent)</span>
                  </h3>
                  <div className="rounded-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-900/60 text-[10px] uppercase tracking-wider text-slate-500">
                          <th className="px-3 py-2 font-medium">Instrument</th>
                          <th className="px-3 py-2 font-medium">Action</th>
                          <th className="px-3 py-2 font-medium text-right">
                            P/L %
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {selectedTrader.activity.slice(0, 5).map((a, i) => (
                          <tr key={i} className="text-xs">
                            <td className="px-3 py-2 text-slate-300 font-medium">
                              {a.instrument}
                            </td>
                            <td className="px-3 py-2">
                              <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                      a.action === "Buy"
                                          ? "bg-emerald-500/10 text-emerald-400"
                                          : "bg-rose-500/10 text-rose-400"
                                  }`}
                              >
                                {a.action}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right font-medium text-emerald-400">
                              +{a.pl.toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}


            </div>
          </div>
        </div>
        </div>
      )}

      {/* Badge Rules Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setSelectedBadge(null)}
          />
          
          {/* Modal Container */}
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header Glow */}
            <div className="h-24 bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center border-b border-slate-800/50">
              <div className="scale-125 hover:rotate-6 transition-transform duration-300">
                {renderCustomBadge(selectedBadge.id, "w-12 h-12")}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-850 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Body */}
            <div className="p-6 text-center space-y-4">
              <div>
                <h3 className="text-xl font-display font-bold text-white uppercase tracking-wide">
                  {selectedBadge.title}
                </h3>
                {selectedBadge.subtitle && (
                  <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded font-semibold uppercase tracking-widest inline-block mt-2">
                    {selectedBadge.subtitle}
                  </span>
                )}
              </div>

              <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-850/50 text-left space-y-3">
                <span className="text-xs font-semibold text-brand-400 uppercase tracking-widest block">
                  Requirements
                </span>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                  {selectedBadge.desc}
                </p>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-4 text-left border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  ⚠️ Global Season Rules (Applies to all Badges)
                </span>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                  <li>Minimum of <b>10 trades</b> required.</li>
                  <li>Volume requirement: <b>0.6 lots per $100</b> of account balance (e.g., 1.2 lots for $200, 3.0 lots for $500).</li>
                  <li>Washed out accounts (balance/equity reaching $0) are disqualified.</li>
                </ul>
              </div>

              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors border border-slate-700/80"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
