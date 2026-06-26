"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Trophy, 
  Star, 
  Users, 
  Gift, 
  Calendar, 
  Shield, 
  UserPlus, 
  DollarSign, 
  Link2, 
  Play, 
  TrendingUp, 
  Award,
  ChevronRight,
  TrendingDown
} from "lucide-react";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { Trader } from "@/lib/leaderboardApi";

// Hardcoded fallback data in case the API is loading, empty, or fails
const fallbackTraders: Trader[] = [
  {
    id: "fallback-1",
    rank: 1,
    name: "Alex Trader",
    title: "Elite Trader",
    profit: 32.45,
    drawdown: 3.21,
    winRate: 78,
    badges: 12,
    status: "online",
    country: "India",
  },
  {
    id: "fallback-2",
    rank: 2,
    name: "Sophia FX",
    title: "Elite Trader",
    profit: 28.17,
    drawdown: 3.45,
    winRate: 74,
    badges: 9,
    status: "online",
    country: "United Kingdom",
  },
  {
    id: "fallback-3",
    rank: 3,
    name: "Trader Max",
    title: "Pro Trader",
    profit: 24.38,
    drawdown: 4.12,
    winRate: 71,
    badges: 11,
    status: "offline",
    country: "United States",
  },
  {
    id: "fallback-4",
    rank: 4,
    name: "Nina Pro",
    title: "Pro Trader",
    profit: 21.09,
    drawdown: 3.65,
    winRate: 69,
    badges: 8,
    status: "online",
    country: "Canada",
  },
  {
    id: "fallback-5",
    rank: 5,
    name: "Jay Capital",
    title: "Rising Star",
    profit: 18.76,
    drawdown: 4.01,
    winRate: 65,
    badges: 7,
    status: "offline",
    country: "Germany",
  }
];

export default function Home() {
  // Fetch monthly data for the Top Traders this month section
  const { data: rawData, isLoading, error } = useLeaderboard("monthly");

  // Perform calculations and sorting:
  // Get top 5 traders sorted by profit descending. If data is missing or empty, use fallback values.
  const topTraders = React.useMemo(() => {
    if (isLoading || error || !rawData || rawData.length === 0) {
      return fallbackTraders;
    }
    
    // Create a copy, sort by profit descending, and take the top 5
    return [...rawData]
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 5)
      .map((trader, index) => {
        // Calculate title based on volume/profit if not provided
        let calculatedTitle = trader.title;
        if (!calculatedTitle) {
          const vol = trader.volume ?? 0;
          if (vol > 10 || trader.profit > 30) {
            calculatedTitle = "Elite Trader";
          } else if (vol > 2 || trader.profit > 15) {
            calculatedTitle = "Pro Trader";
          } else {
            calculatedTitle = "Rising Star";
          }
        }

        return {
          ...trader,
          rank: index + 1,
          title: calculatedTitle,
        };
      });
  }, [rawData, isLoading, error]);

  return (
    <div className="flex flex-col w-full bg-[#050814] text-slate-100 overflow-x-hidden min-h-screen">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:py-32 overflow-hidden border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Text */}
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-violet-400 animate-pulse"></span>
                <span className="text-xs md:text-sm font-semibold tracking-wider uppercase">
                  🏆 Next-Gen Trading Leaderboard
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight leading-[1.1] text-white">
                FOREX TRADING <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300">
                  CHALLENGE
                </span>
              </h1>
              
              <h3 className="text-xl md:text-2xl font-semibold text-slate-300 font-display">
                Compete. Rank. Earn Rewards.
              </h3>
              
              <p className="text-base md:text-lg text-slate-400 max-w-xl leading-relaxed">
                Join traders worldwide, climb the leaderboard, earn badges, win cash rewards, and prove your trading skills on our verified metrics portal.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <a
                  href="https://alpari.com/en/?Referral=72725"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-base shadow-[0_0_30px_-5px_rgba(124,58,237,0.5)] transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                >
                  Join the Challenge
                </a>
                <Link
                  href="/leaderboard"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-white font-semibold text-base backdrop-blur-sm transition-all flex items-center justify-center gap-2 hover:border-slate-700"
                >
                  View Leaderboard
                  <ArrowRight className="w-4 h-4 text-violet-400" />
                </Link>
              </div>
            </div>

            {/* Hero Image / Trophy Illustration */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              
              {/* Outer Glow Circles */}
              <div className="absolute w-[350px] h-[350px] bg-violet-600/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
              <div className="absolute w-[250px] h-[250px] bg-amber-500/5 rounded-full blur-3xl -z-10"></div>
              
              {/* Main Trophy Asset */}
              <div className="relative group max-w-[380px] w-full aspect-square flex justify-center items-center">
                <img
                  src="/trading_trophy.png"
                  alt="Forex Trading Challenge Trophy"
                  className="object-contain w-full h-full drop-shadow-[0_15px_50px_rgba(124,58,237,0.25)] group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Reward Card */}
                <div className="absolute -bottom-4 right-4 bg-slate-900/90 border border-violet-500/30 backdrop-blur-md rounded-2xl p-4 shadow-2xl flex items-center gap-3 animate-bounce [animation-duration:4s]">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Trophy className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Total Rewards</div>
                    <div className="text-lg font-bold font-display text-white">$50,000+</div>
                  </div>
                </div>

                {/* Floating Active Traders Card */}
                <div className="absolute -top-4 -left-4 bg-slate-900/90 border border-blue-500/30 backdrop-blur-md rounded-2xl p-4 shadow-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Active Now</div>
                    <div className="text-lg font-bold font-display text-white">2,500+</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-violet-600/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-bl from-blue-600/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Top Traders Section */}
      <section className="py-20 bg-slate-950/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-extrabold uppercase tracking-wider text-white">
                Top Traders This Month
              </h2>
              <p className="text-slate-400 text-sm md:text-base mt-2">
                Real-time rankings calculated directly from platform api metrics
              </p>
            </div>
            <Link
              href="/leaderboard"
              className="text-violet-400 hover:text-violet-300 font-semibold text-sm flex items-center gap-1.5 transition-colors group"
            >
              View Full Leaderboard 
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {isLoading ? (
              // Loading Skeleton
              [...Array(5)].map((_, i) => (
                <div key={i} className="glass-panel p-6 rounded-2xl border border-slate-900 animate-pulse space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-800"></div>
                    <div className="w-12 h-5 rounded bg-slate-800"></div>
                  </div>
                  <div className="flex flex-col items-center py-4 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-slate-800"></div>
                    <div className="w-24 h-4 rounded bg-slate-800"></div>
                    <div className="w-16 h-3 rounded bg-slate-800"></div>
                  </div>
                  <div className="pt-4 border-t border-slate-900 flex justify-between">
                    <div className="w-12 h-3 bg-slate-800 rounded"></div>
                    <div className="w-12 h-3 bg-slate-800 rounded"></div>
                  </div>
                </div>
              ))
            ) : (
              topTraders.map((trader) => (
                <div
                  key={trader.id}
                  className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-violet-500/40 hover:bg-slate-900/40 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Card Subtle Top Color Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                    trader.rank === 1 ? "from-amber-400 to-yellow-500" :
                    trader.rank === 2 ? "from-slate-300 to-slate-400" :
                    trader.rank === 3 ? "from-amber-700 to-amber-800" :
                    "from-slate-800 to-slate-700"
                  }`}></div>

                  <div>
                    {/* Top Row: Rank & Badges */}
                    <div className="flex justify-between items-center mb-6">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-black text-sm border ${
                        trader.rank === 1 ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
                        trader.rank === 2 ? "bg-slate-300/10 border-slate-300/30 text-slate-300" :
                        trader.rank === 3 ? "bg-amber-700/10 border-amber-700/30 text-amber-600" :
                        "bg-slate-800/50 border-slate-700/50 text-slate-400"
                      }`}>
                        {trader.rank === 1 ? "1st" : trader.rank === 2 ? "2nd" : trader.rank === 3 ? "3rd" : trader.rank}
                      </div>
                      
                      <div className="flex items-center gap-1 text-amber-500 bg-amber-500/5 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-semibold">
                        <Star className="w-3 h-3 fill-current" /> {trader.badges}
                      </div>
                    </div>

                    {/* Trader Core Info */}
                    <div className="flex flex-col items-center text-center mb-6">
                      <div className="relative mb-3">
                        <div className="w-16 h-16 rounded-full bg-slate-800 overflow-hidden border-2 border-slate-700/80 group-hover:border-violet-500/50 transition-colors">
                          <img
                            src={trader.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${trader.name}`}
                            alt={trader.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {trader.status === "online" && (
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#050814] rounded-full"></div>
                        )}
                      </div>
                      <h4 className="font-bold text-white font-display text-base tracking-wide group-hover:text-violet-300 transition-colors truncate w-full px-2" title={trader.name}>
                        {trader.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 font-medium bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-slate-800">
                        {trader.title}
                      </p>
                    </div>
                  </div>

                  {/* Profit Metric & Details */}
                  <div className="pt-4 border-t border-slate-900/60 mt-auto space-y-3">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-0.5">Profit</div>
                      <div className="text-xl font-display font-black text-emerald-400">
                        +{trader.profit.toFixed(2)}%
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 bg-slate-900/40 p-2 rounded-lg border border-slate-900/50 text-center font-medium">
                      <div>
                        <span className="block text-slate-500 text-[9px] uppercase tracking-wider">Win Rate</span>
                        <span className="text-slate-300">{trader.winRate}%</span>
                      </div>
                      <div>
                        <span className="block text-slate-500 text-[9px] uppercase tracking-wider">Drawdown</span>
                        <span className={`text-slate-300 ${trader.drawdown > 15 ? "text-rose-400" : ""}`}>
                          {trader.drawdown.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16 border-t border-slate-900 pt-16">
            
            <div className="flex gap-4 p-5 rounded-2xl bg-slate-900/30 border border-slate-900/60 backdrop-blur-sm items-start">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white font-display">2500+</h4>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Active Traders</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Real-time performance tracking and live metrics.</p>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-2xl bg-slate-900/30 border border-slate-900/60 backdrop-blur-sm items-start">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white font-display">$50,000+</h4>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Monthly Rewards</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Earn prizes based on profit, drawdown & consistency.</p>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-2xl bg-slate-900/30 border border-slate-900/60 backdrop-blur-sm items-start">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white font-display">6 Months</h4>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Challenge Duration</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Structured seasons to evaluate consistency & skill.</p>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-2xl bg-slate-900/30 border border-slate-900/60 backdrop-blur-sm items-start">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white font-display">Multiple</h4>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Leaderboards</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Rankings computed Daily, Weekly, Monthly & All Time.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 border-y border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold uppercase tracking-wider text-white">
              How It Works
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
              Follow these simple steps to start trading, climb ranks, and qualify for payouts
            </p>
          </div>

          {/* Steps Timeline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative">
            
            {[
              {
                step: "01",
                icon: <UserPlus className="w-5 h-5" />,
                color: "text-violet-400 bg-violet-500/10 border-violet-500/20",
                title: "Register",
                desc: "Sign up and join the next active challenge season.",
              },
              {
                step: "02",
                icon: <DollarSign className="w-5 h-5" />,
                color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                title: "Fund Account",
                desc: "Deposit minimum capital (e.g., $100) to activate your trades.",
              },
              {
                step: "03",
                icon: <Link2 className="w-5 h-5" />,
                color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
                title: "Link Account",
                desc: "Securely link your MT4/MT5 trading account with our portal.",
              },
              {
                step: "04",
                icon: <Play className="w-5 h-5" />,
                color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                title: "Start Trading",
                desc: "Execute trades according to challenge parameters and risk rules.",
              },
              {
                step: "05",
                icon: <TrendingUp className="w-5 h-5" />,
                color: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20",
                title: "Climb Leaderboard",
                desc: "Generate high profit percentages while maintaining low drawdown.",
              },
              {
                step: "06",
                icon: <Award className="w-5 h-5" />,
                color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
                title: "Win Rewards",
                desc: "Qualify for monthly cash rewards, premium badges, and prestige.",
              },
            ].map((stepObj, index) => (
              <div key={index} className="glass-panel p-6 rounded-2xl border border-slate-900 relative flex flex-col justify-between group hover:border-slate-800 transition-colors">
                
                {/* Step Top Bar */}
                <div className="flex justify-between items-center mb-4">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${stepObj.color}`}>
                    {stepObj.icon}
                  </div>
                  <span className="font-display font-black text-slate-700 text-xl group-hover:text-violet-500/30 transition-colors">
                    {stepObj.step}
                  </span>
                </div>

                <div className="space-y-2 mt-4">
                  <h4 className="font-bold font-display text-white text-base">
                    {stepObj.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {stepObj.desc}
                  </p>
                </div>

                {/* Connecting Arrow for large screens */}
                {index < 5 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-20 text-slate-700">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* Challenge Categories Section */}
      <section className="py-20 relative bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold uppercase tracking-wider text-white">
              Challenge Categories
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
              Choose the program level matches your experience and reward ambitions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Beginner Category */}
            <div className="glass-panel p-8 rounded-3xl border border-slate-900 relative overflow-hidden flex flex-col justify-between hover:border-slate-800 transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none"></div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-extrabold uppercase tracking-wider font-display text-blue-400">
                    Beginner Trader
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">Built for Emerging & Growing Traders</p>
                </div>
                
                <div className="h-0.5 bg-slate-900"></div>

                <ul className="space-y-3">
                  {[
                    "Lower entry barriers & micro lots",
                    "Learning-focused environment & resources",
                    "Weekly leaderboard performance audits",
                    "Beginner-friendly competition rules",
                  ].map((perk, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold">✓</span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-900/60">
                <a
                  href="https://alpari.com/en/?Referral=72725"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-center block hover:bg-slate-800 transition-colors"
                >
                  Join Beginner Challenge
                </a>
              </div>
            </div>

            {/* Pro Category */}
            <div className="glass-panel p-8 rounded-3xl border border-violet-500/20 bg-gradient-to-br from-slate-900/40 to-slate-950/60 relative overflow-hidden flex flex-col justify-between shadow-[0_10px_40px_-15px_rgba(124,58,237,0.15)] hover:border-violet-500/40 transition-colors">
              
              {/* Hot Ribbon */}
              <div className="absolute top-0 right-0 bg-violet-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg shadow-sm">
                Recommended
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-extrabold uppercase tracking-wider font-display text-violet-400">
                    Pro Trader
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">Built for Elite Performance & Higher Stakes</p>
                </div>
                
                <div className="h-0.5 bg-slate-900"></div>

                <ul className="space-y-3">
                  {[
                    "Professional scale lot sizes & rules",
                    "Higher competition levels & raw analytics",
                    "Bigger payout pools & verified funding",
                    "Premium customized profile badges",
                  ].map((perk, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold">✓</span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-900/60">
                <a
                  href="https://alpari.com/en/?Referral=72725"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-center block hover:from-violet-500 hover:to-indigo-500 transition-colors shadow-lg shadow-violet-600/20"
                >
                  Join Pro Challenge
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

