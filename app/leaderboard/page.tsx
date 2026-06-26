"use client";

import React, { useState } from "react";
import {
  Trophy,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Star,
  X,
} from "lucide-react";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { Trader, Timeframe } from "@/lib/leaderboardApi";

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState<Timeframe>("monthly");
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);
  const { data, isLoading, error } = useLeaderboard(timeframe);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 uppercase tracking-tight">
            Leaderboard
          </h1>
          <p className="text-lg text-slate-400">
            Top traders ranked by overall performance
          </p>
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
            <button className="p-2 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
              <Filter className="w-5 h-5" />
            </button>
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
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${trader.name}`}
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
                        <span className="text-emerald-400 font-display font-bold">
                          +{trader.profit.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-slate-300">
                          {trader.drawdown.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-slate-300">{trader.winRate}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <div className="flex items-center gap-1 text-accent-500 bg-accent-500/10 px-2 py-1 rounded text-xs font-medium border border-accent-500/20">
                            <Star className="w-3 h-3 fill-current" />{" "}
                            {trader.badges}
                          </div>
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
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setSelectedTrader(null)}
          ></div>
          <div className="relative w-full max-w-md glass-panel rounded-3xl overflow-hidden shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="relative h-32 bg-gradient-to-br from-brand-900 to-slate-900">
              <button
                onClick={() => setSelectedTrader(null)}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-8 pb-8">
              <div className="relative -mt-16 mb-4 flex justify-between items-end">
                <div className="w-32 h-32 rounded-2xl bg-slate-800 border-4 border-slate-900 overflow-hidden shadow-xl">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedTrader.name}`}
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
                  <div className="text-emerald-400 font-display font-bold text-xl mb-1">
                    +{selectedTrader.profit.toFixed(2)}%
                  </div>
                  <div className="text-xs text-slate-500 uppercase">Profit</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 text-center border border-slate-800">
                  <div className="text-white font-display font-bold text-xl mb-1">
                    {selectedTrader.winRate}%
                  </div>
                  <div className="text-xs text-slate-500 uppercase">
                    Win Rate
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 text-center border border-slate-800">
                  <div className="text-white font-display font-bold text-xl mb-1">
                    {selectedTrader.drawdown.toFixed(2)}%
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
                  Badges Earned
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[...Array(Math.min(5, selectedTrader.badges))].map(
                    (_, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            i === 0
                              ? "text-accent-500 fill-accent-500"
                              : "text-slate-400"
                          }`}
                        />
                      </div>
                    )
                  )}
                  {selectedTrader.badges > 5 && (
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-medium text-slate-400">
                      +{selectedTrader.badges - 5}
                    </div>
                  )}
                </div>
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

              <button className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors">
                View Full Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
