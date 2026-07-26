"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Shield,
  Share2,
  Download,
  Copy,
  Check,
  Send
} from "lucide-react";
import { fetchLeaderboard, Trader, Timeframe } from "@/lib/leaderboardApi";
import {
  TopRankBadge,
  ConsistentTraderBadge,
  MostActiveTraderBadge,
  TraderOfWeekBadge,
  BestRiskManagerBadge
} from "@/components/BadgeIcons";

interface LeaderboardClientProps {
  initialTraders: Trader[];
}

const BADGE_DETAILS: Record<string, {
  icon: React.ReactNode;
  color: string;
  desc: string;
  condition: string;
}> = {
  "Top Rank Monthly": {
    icon: <TopRankBadge className="w-8 h-8" />,
    color: "hover:scale-110",
    desc: "Awarded to the top ranked trader each month.",
    condition: "Achieve the absolute #1 rank in the monthly challenge leaderboard."
  },
  "Consistent Trader": {
    icon: <ConsistentTraderBadge className="w-8 h-8" />,
    color: "hover:scale-110",
    desc: "Awarded for consistent performance throughout the challenge.",
    condition: "Maintain a minimum activity level of 12 completed trades."
  },
  "Most Active Trader": {
    icon: <MostActiveTraderBadge className="w-8 h-8" />,
    color: "hover:scale-110",
    desc: "Awarded for highest active volume (settled + unsettled).",
    condition: "Accumulate an aggregate volume (settled + unsettled) of 8.00 Lots or more."
  },
  "Trader of the Week": {
    icon: <TraderOfWeekBadge className="w-8 h-8" />,
    color: "hover:scale-110",
    desc: "Recognizing outstanding trading performance of the week.",
    condition: "Secure a Top 3 rank in weekly standings."
  },
  "Best Risk Manager": {
    icon: <BestRiskManagerBadge className="w-8 h-8" />,
    color: "hover:scale-110",
    desc: "Awarded for excellent risk management and discipline.",
    condition: "Achieve a return above 12% with at least 10 trades."
  }
};

export default function LeaderboardClient({ initialTraders }: LeaderboardClientProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("monthly");
  const [data, setData] = useState<Trader[]>(initialTraders);
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<{
    name: string;
    desc: string;
    condition: string;
    color: string;
    icon: React.ReactNode;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [badgeRules, setBadgeRules] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/badge-rules")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBadgeRules(data);
        }
      })
      .catch((err) => console.error("Error fetching badge rules:", err));
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [sharingTrader, setSharingTrader] = useState<Trader | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate scorecard image on the fly when modal opens
  useEffect(() => {
    if (!sharingTrader) {
      setPreviewImage(null);
      return;
    }
    
    setIsGenerating(true);
    const timer = setTimeout(() => {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setIsGenerating(false);
        return;
      }

      // Draw premium gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 1200, 630);
      bgGradient.addColorStop(0, "#020617"); // slate-950
      bgGradient.addColorStop(0.5, "#0b1528");
      bgGradient.addColorStop(1, "#030712");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, 1200, 630);

      // Radial background glow circles
      const glow1 = ctx.createRadialGradient(1000, 500, 50, 1000, 500, 400);
      glow1.addColorStop(0, "rgba(99, 102, 241, 0.2)"); // indigo-500
      glow1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow1;
      ctx.beginPath();
      ctx.arc(1000, 500, 400, 0, Math.PI * 2);
      ctx.fill();

      const glow2 = ctx.createRadialGradient(200, 100, 50, 200, 100, 300);
      glow2.addColorStop(0, "rgba(139, 92, 246, 0.15)"); // violet-500
      glow2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow2;
      ctx.beginPath();
      ctx.arc(200, 100, 300, 0, Math.PI * 2);
      ctx.fill();

      // Subtle decorative grid lines
      ctx.strokeStyle = "rgba(148, 163, 184, 0.05)";
      ctx.lineWidth = 1;
      for (let x_pos = 0; x_pos < 1200; x_pos += 80) {
        ctx.beginPath();
        ctx.moveTo(x_pos, 0);
        ctx.lineTo(x_pos, 630);
        ctx.stroke();
      }
      for (let y_pos = 0; y_pos < 630; y_pos += 80) {
        ctx.beginPath();
        ctx.moveTo(0, y_pos);
        ctx.lineTo(1200, y_pos);
        ctx.stroke();
      }

      // Outer border frame
      ctx.strokeStyle = "rgba(56, 189, 248, 0.2)"; // brand-400
      ctx.lineWidth = 3;
      ctx.strokeRect(30, 30, 1140, 570);

      // Thin inner border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 40, 1120, 550);

      // Header Branding Title
      ctx.font = "bold 20px 'Space Grotesk', 'Inter', sans-serif";
      ctx.fillStyle = "#38bdf8"; // brand-400
      ctx.textAlign = "center";
      ctx.fillText("TRADE TALKS CHALLENGE STANDINGS", 600, 85);

      // Accent divider line
      ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(480, 110);
      ctx.lineTo(720, 110);
      ctx.stroke();

      // Main Glassmorphic Container Box
      ctx.fillStyle = "rgba(15, 23, 42, 0.7)"; // slate-900/70
      const r_val = 24;
      const cardX = 160, cardY = 145, cardW = 880, cardH = 370;
      
      ctx.beginPath();
      ctx.moveTo(cardX + r_val, cardY);
      ctx.lineTo(cardX + cardW - r_val, cardY);
      ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + r_val);
      ctx.lineTo(cardX + cardW, cardY + cardH - r_val);
      ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - r_val, cardY + cardH);
      ctx.lineTo(cardX + r_val, cardY + cardH);
      ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - r_val);
      ctx.lineTo(cardX, cardY + r_val);
      ctx.quadraticCurveTo(cardX, cardY, cardX + r_val, cardY);
      ctx.closePath();
      ctx.fill();

      // Border outline for container
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Trader's Name
      ctx.font = "bold 44px 'Space Grotesk', 'Inter', sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(sharingTrader.name, 600, 215);

      // Rank Badge Pill
      const rankText = `RANK #${sharingTrader.rank}`;
      ctx.font = "bold 22px 'Space Grotesk', 'Inter', sans-serif";
      const w_text = ctx.measureText(rankText).width;
      const bW = w_text + 36;
      const bH = 42;
      const bX = 600 - bW / 2;
      const bY = 245;
      const bR = 10;

      // Rank badge gradient background
      const rankGradient = ctx.createLinearGradient(bX, bY, bX + bW, bY);
      if (sharingTrader.rank === 1) {
        rankGradient.addColorStop(0, "#f59e0b"); // gold
        rankGradient.addColorStop(1, "#d97706");
      } else if (sharingTrader.rank === 2) {
        rankGradient.addColorStop(0, "#cbd5e1"); // silver
        rankGradient.addColorStop(1, "#94a3b8");
      } else if (sharingTrader.rank === 3) {
        rankGradient.addColorStop(0, "#b45309"); // bronze
        rankGradient.addColorStop(1, "#78350f");
      } else {
        rankGradient.addColorStop(0, "#6d28d9"); // violet
        rankGradient.addColorStop(1, "#4f46e5");
      }

      ctx.beginPath();
      ctx.moveTo(bX + bR, bY);
      ctx.lineTo(bX + bW - bR, bY);
      ctx.quadraticCurveTo(bX + bW, bY, bX + bW, bY + bR);
      ctx.lineTo(bX + bW, bY + bH - bR);
      ctx.quadraticCurveTo(bX + bW, bY + bH, bX + bW - bR, bY + bH);
      ctx.lineTo(bX + bR, bY + bH);
      ctx.quadraticCurveTo(bX, bY + bH, bX, bY + bH - bR);
      ctx.lineTo(bX, bY + bR);
      ctx.quadraticCurveTo(bX, bY, bX + bR, bY);
      ctx.closePath();
      ctx.fillStyle = rankGradient;
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.fillText(rankText, 600, bY + 28);

      // Profit return percent
      const profitVal = sharingTrader.profit ?? 0;
      const isPositive = profitVal >= 0;
      const profitText = `${isPositive ? "+" : ""}${profitVal.toFixed(2)}%`;
      ctx.font = "bold 76px 'Space Grotesk', 'Inter', sans-serif";
      ctx.fillStyle = isPositive ? "#10b981" : "#f43f5e"; // emerald-500 or rose-500
      ctx.fillText(profitText, 600, 375);

      ctx.font = "bold 14px 'Inter', sans-serif";
      ctx.fillStyle = "#64748b"; // slate-500
      ctx.fillText("PROFIT ROI RETURN", 600, 405);

      // Separator inside card
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(240, 435);
      ctx.lineTo(960, 435);
      ctx.stroke();

      // Volume & Starting balance metrics
      ctx.font = "bold 18px 'Space Grotesk', 'Inter', sans-serif";
      ctx.fillStyle = "#cbd5e1";
      ctx.textAlign = "left";
      ctx.fillText(`VOLUME: ${(sharingTrader.volume ?? 0).toFixed(2)} Lots`, 270, 475);

      ctx.textAlign = "right";
      ctx.fillText(`START CAPITAL: $${(sharingTrader.mtNetDeposits ?? 100).toFixed(2)}`, 930, 475);

      // Card Bottom Footer
      ctx.font = "medium 15px 'Inter', sans-serif";
      ctx.fillStyle = "#475569"; // slate-600
      ctx.textAlign = "center";
      ctx.fillText("WWW.TRADETALKS.IN  |  COMPETE & WIN REAL PRIZES", 600, 565);

      try {
        const url = canvas.toDataURL("image/png");
        setPreviewImage(url);
      } catch (err) {
        console.error("Canvas toDataURL error:", err);
        setShareError("Could not generate image on this device.");
      } finally {
        setIsGenerating(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [sharingTrader]);

  const handleShare = (e: React.MouseEvent, trader: any) => {
    e.stopPropagation(); // prevent opening details modal
    setSharingTrader(trader);
  };

  // Listen to timeframe changes and fetch from the API route
  useEffect(() => {
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

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Reset page when search query or timeframe changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, timeframe]);

  return (
    <div className="w-full bg-[#050814] text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-wider uppercase">
            Leaderboard
          </h1>
          <p className="text-slate-400 mt-3 text-sm md:text-base max-w-2xl mx-auto">
            Top traders ranked by overall performance
          </p>
        </div>

        {/* Timeframe selector (centered) */}
        <div className="flex justify-center mb-10">
          <div className="flex bg-slate-900/60 p-1.5 rounded-xl border border-slate-800 backdrop-blur-sm shadow-inner">
            {(["all", "monthly", "weekly", "daily"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-4 py-2 rounded-lg font-semibold text-[10px] sm:text-xs tracking-wider uppercase transition-all duration-200 ${
                  timeframe === t
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-950/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {t === "all" ? "All Time" : t}
              </button>
            ))}
          </div>
        </div>
        {/* Rules & Requirements Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Rules Card (2/3 width on large screens) */}
          <div className="lg:col-span-2 bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 flex flex-col sm:flex-row items-start gap-6 relative overflow-hidden h-full">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shrink-0">
              <Shield className="w-6 h-6 text-brand-400" />
            </div>
            <div className="space-y-4 flex-1 w-full">
              <div>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  New Season Rules & Eligibility
                </h2>
                <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                  To keep the challenge fair, all participants must comply with the following global season rules to be eligible for any rankings, badges, or rewards:
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Box 1 */}
                <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-3">
                  <span className="text-[9px] text-slate-500 block font-bold uppercase tracking-wider">Min Trades</span>
                  <span className="text-white font-medium text-[11px] sm:text-xs mt-0.5 block">10 Trades Required / Month</span>
                </div>
                {/* Box 2 */}
                <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-3">
                  <span className="text-[9px] text-slate-500 block font-bold uppercase tracking-wider">Volume Scale</span>
                  <span className="text-white font-medium text-[11px] sm:text-xs mt-0.5 block">0.6 Lots per $100 Balance / Month</span>
                </div>
                {/* Box 3 */}
                <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-3">
                  <span className="text-[9px] text-slate-500 block font-bold uppercase tracking-wider">Risk Limit</span>
                  <span className="text-white font-medium text-[11px] sm:text-xs mt-0.5 block">Washout (100% Drawdown) = Out</span>
                </div>
              </div>
            </div>
          </div>

          {/* Required Documents Card (1/3 width on large screens) */}
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between h-full">
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Required Documents
              </h2>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-brand-400 mt-0.5">01</span>
                  <span className="text-xs text-slate-300 font-medium leading-relaxed">
                    MT4 or MT5 trading history statement
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-brand-400 mt-0.5">02</span>
                  <span className="text-xs text-slate-300 font-medium leading-relaxed">
                    Account ledger and full fund statement
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-brand-400 mt-0.5">03</span>
                  <span className="text-xs text-slate-300 font-medium leading-relaxed">
                    Investor password access if requested
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          {/* Search */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or Client ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-medium"
            />
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
                  <th className="px-6 py-4 font-medium text-center">Badges</th>
                  <th className="px-6 py-4 font-medium text-center">Points</th>
                  <th className="px-6 py-4 font-medium text-right">Current Balance</th>
                  <th className="px-6 py-4 font-medium text-right">Net Deposit</th>
                  <th className="px-6 py-4 font-medium text-right">Profit %</th>
                  <th className="px-6 py-4 font-medium text-center">Share</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {error ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-20 text-center text-rose-400"
                    >
                      {error}
                    </td>
                  </tr>
                ) : isLoading ? (
                  <tr>
                    <td
                      colSpan={9}
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
                      colSpan={9}
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
                          <div>
                            <div className="font-medium text-white">{trader.name}</div>
                            <div className="text-[10px] text-slate-500 font-medium">{trader.country || "India"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex gap-1.5 flex-wrap items-center justify-center">
                          {trader.earnedBadges && trader.earnedBadges.length > 0 ? (
                            trader.earnedBadges.map((badgeName, idx) => {
                              const badge = BADGE_DETAILS[badgeName];
                              if (!badge) return null;

                              return (
                                <button
                                  key={idx}
                                  onClick={(e) => {
                                    e.stopPropagation(); // prevent opening trader details modal
                                    const matchedRule = badgeRules.find((r) => r._id === badgeName);
                                    
                                    const formatConditions = (rule: any) => {
                                      if (rule.conditions && Array.isArray(rule.conditions) && rule.conditions.length > 0) {
                                        return rule.conditions.map((cond: any) => {
                                          const opSign = cond.operator === "gte" ? ">=" : cond.operator === "lte" ? "<=" : cond.operator === "gt" ? ">" : cond.operator === "lt" ? "<" : "=";
                                          return `${cond.metric} ${opSign} ${cond.value}`;
                                        }).join(" AND ");
                                      }
                                      const opSign = rule.operator === "gte" ? ">=" : rule.operator === "lte" ? "<=" : rule.operator === "gt" ? ">" : rule.operator === "lt" ? "<" : "=";
                                      return `${rule.metric} ${opSign} ${rule.value}`;
                                    };

                                    setSelectedBadge({
                                      name: badgeName,
                                      desc: matchedRule?.description || badge.desc,
                                      condition: matchedRule
                                        ? `Requires: ${formatConditions(matchedRule)} (${matchedRule.points} Points) - Next evaluation: ${matchedRule.nextEvaluationTime ? new Date(matchedRule.nextEvaluationTime).toLocaleString() : 'N/A'}`
                                        : badge.condition,
                                      color: badge.color,
                                      icon: badge.icon
                                    });
                                  }}
                                  title={`Click to view condition: ${badgeName}`}
                                  className="transition-all hover:scale-110 active:scale-95 cursor-pointer focus:outline-none outline-none"
                                >
                                  {badge.icon}
                                </button>
                              );
                            })
                          ) : (
                            <span className="text-slate-655 text-xs">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 font-bold text-xs">
                          {trader.totalPoints ?? 0} pts
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-slate-300 font-medium font-display">
                        ${(trader.totalBalance ?? 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-slate-300 font-medium font-display">
                        ${(trader.mtNetDeposits ?? 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`font-display font-bold ${trader.profit >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          {trader.profit >= 0 ? "+" : ""}{(trader.profit ?? 0).toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={(e) => handleShare(e, trader)}
                          className="p-2 bg-slate-850/80 hover:bg-violet-600/30 border border-slate-800 hover:border-violet-500/50 rounded-lg text-slate-400 hover:text-violet-400 transition-all cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold"
                          title="Share Achievement"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Share</span>
                        </button>
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
              <span className="font-medium text-white">{filteredData.length}</span> entries
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                // Only show a window of pages around current page
                if (
                  page !== 1 &&
                  page !== totalPages &&
                  Math.abs(page - currentPage) > 1
                ) {
                  if (page === 2 || page === totalPages - 1) {
                    return <span key={page} className="text-slate-600 px-1">...</span>;
                  }
                  return null;
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded text-sm font-semibold transition-all ${
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
                  <p className="text-brand-400 text-sm mb-3">
                    {selectedTrader.title ?? "Trader"}
                  </p>

                  {/* Badges Display */}
                  {selectedTrader.earnedBadges && selectedTrader.earnedBadges.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {selectedTrader.earnedBadges.map((badgeName, idx) => {
                        const badge = BADGE_DETAILS[badgeName];
                        if (!badge) return null;
                        return (
                          <div
                            key={idx}
                            title={`${badgeName}: ${badge.desc}`}
                            className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-800 transition-colors"
                          >
                            <span className="w-4 h-4 flex items-center justify-center shrink-0">{badge.icon}</span>
                            <span className="font-medium">{badgeName}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-900/50 rounded-xl p-4 text-center border border-slate-800">
                    <div className={`font-display font-bold text-xl mb-1 ${selectedTrader.profit >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {selectedTrader.profit >= 0 ? "+" : ""}{(selectedTrader.profit ?? 0).toFixed(2)}%
                    </div>
                    <div className="text-xs text-slate-500 uppercase">Profit Return</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 text-center border border-slate-800">
                    <div className="text-white font-display font-bold text-xl mb-1">
                      {(selectedTrader.volume ?? 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-500 uppercase">
                      Lots Traded
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
                      <span className="text-slate-500 block text-xs">Total Balance</span>
                      <span className="text-white font-medium">${selectedTrader.totalBalance?.toFixed(2) ?? "0.00"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-xs">Account Equity</span>
                      <span className="text-white font-medium">${selectedTrader.totalEquity?.toFixed(2) ?? "0.00"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-xs">Net Deposit</span>
                      <span className="text-white font-medium">${selectedTrader.mtNetDeposits?.toFixed(2) ?? "0.00"}</span>
                    </div>
                  </div>
                </div>

                {/* Share Button in Modal */}
                <div className="mb-6">
                  <button
                    onClick={(e) => handleShare(e, selectedTrader)}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    Share My Achievement
                  </button>
                </div>

                {selectedTrader.activity && selectedTrader.activity.length > 0 && (
                  <div className="mb-4">
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

      {/* Badge Condition Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setSelectedBadge(null)}
          />

          {/* Modal Container */}
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-850 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="p-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center border-2 bg-slate-950/60 shadow-inner scale-110">
                {selectedBadge.icon}
              </div>
              
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  {selectedBadge.name}
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {selectedBadge.desc}
                </p>
              </div>

              <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 text-left space-y-2">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-black">
                  Award Criteria & Conditions
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {selectedBadge.condition}
                </p>
              </div>

              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-white text-xs font-semibold transition-all border border-slate-800 cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Scorecard Modal */}
      {sharingTrader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setSharingTrader(null)}
          />

          {/* Modal Container */}
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSharingTrader(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-850 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="p-6 space-y-5">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  Share Scorecard
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Share your rank and returns with other traders
                </p>
              </div>

              {/* Preview Box */}
              <div className="relative aspect-[1200/630] w-full rounded-2xl border border-slate-800/85 bg-slate-950/60 overflow-hidden flex items-center justify-center">
                {isGenerating && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-800 border-t-brand-400" />
                    <span className="text-xs text-slate-400">Rendering high-res card...</span>
                  </div>
                )}
                {!isGenerating && previewImage && (
                  <img
                    src={previewImage}
                    alt={`${sharingTrader.name}'s Scorecard`}
                    className="w-full h-full object-contain"
                  />
                )}
                {shareError && (
                  <div className="text-rose-400 text-xs px-4 text-center">
                    {shareError}
                  </div>
                )}
              </div>

              {/* Action grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Download Button */}
                <button
                  onClick={() => {
                    if (!previewImage) return;
                    const link = document.createElement("a");
                    link.download = `${sharingTrader.name.toLowerCase().replace(/\s+/g, "-")}-scorecard.png`;
                    link.href = previewImage;
                    link.click();
                  }}
                  disabled={!previewImage}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-850 hover:bg-slate-850/80 disabled:opacity-50 text-white font-semibold text-xs transition-colors border border-slate-800 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-brand-400" />
                  Download PNG
                </button>

                {/* Copy Link Button */}
                <button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/leaderboard`;
                    navigator.clipboard.writeText(shareUrl);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-850 hover:bg-slate-850/80 text-white font-semibold text-xs transition-colors border border-slate-800 cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-brand-400" />
                      Copy Link
                    </>
                  )}
                </button>
              </div>

              {/* Direct share buttons */}
              <div className="space-y-2">
                {/* Web Share API (Mobile Direct Image Share) */}
                {typeof navigator !== "undefined" && navigator.share && (
                  <button
                    onClick={async () => {
                      if (!previewImage) return;
                      try {
                        const blob = await (await fetch(previewImage)).blob();
                        const file = new File(
                          [blob],
                          `${sharingTrader.name.toLowerCase().replace(/\s+/g, "-")}-scorecard.png`,
                          { type: "image/png" }
                        );
                        
                        const profitStr = sharingTrader.profit >= 0 
                          ? `+${sharingTrader.profit.toFixed(2)}%` 
                          : `${sharingTrader.profit.toFixed(2)}%`;
                        const text = `🔥 My performance on the Trade Talks leaderboard! Rank: #${sharingTrader.rank}, Profit return: ${profitStr}.`;

                        if (navigator.canShare && navigator.canShare({ files: [file] })) {
                          await navigator.share({
                            files: [file],
                            title: "Trade Talks Scorecard",
                            text: text,
                          });
                        } else {
                          await navigator.share({
                            title: "Trade Talks Scorecard",
                            text: text,
                            url: `${window.location.origin}/leaderboard`,
                          });
                        }
                      } catch (err) {
                        console.error("Web Share failed:", err);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition-all shadow-md shadow-brand-600/10 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Image Directly
                  </button>
                )}

                {/* WhatsApp Web share */}
                <button
                  onClick={() => {
                    const profitStr = sharingTrader.profit >= 0 
                      ? `+${sharingTrader.profit.toFixed(2)}%` 
                      : `${sharingTrader.profit.toFixed(2)}%`;
                    const text = `🔥 My performance on the Trade Talks leaderboard!\nRank: #${sharingTrader.rank}\nProfit Return: ${profitStr}\nVolume: ${(sharingTrader.volume ?? 0).toFixed(2)} Lots\n\nTrack standings: ${window.location.origin}/leaderboard`;
                    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
                    window.open(waUrl, "_blank");
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4 fill-white" />
                  Share Text Standings to WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
