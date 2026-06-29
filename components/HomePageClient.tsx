"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Trophy,
  Star,
  Users,
  Gift,
  Calendar,
  UserPlus,
  DollarSign,
  Link2,
  Play,
  TrendingUp,
  Award,
  ChevronRight,
  Scale,
  Shield,
  Target,
  BarChart3,
  Clock,
  Activity,
  AlertTriangle,
  TrendingDown,
  X,
  ArrowLeft,
  ExternalLink,
  CheckCircle2
} from "lucide-react";
import { Trader, BADGE_DEFINITIONS, determineTraderBadges } from "@/lib/leaderboardApi";

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

// Hardcoded fallback data in case the API is empty or fails
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

// Challenge Rules Data
const challengeRules = [
  {
    num: 1,
    icon: <DollarSign className="w-5 h-5" />,
    color: "text-violet-400 border-violet-500/30 bg-violet-500/10",
    title: "Minimum Deposit",
    value: "$100",
    desc: "Minimum deposit required to start the challenge.",
  },
  {
    num: 2,
    icon: <Scale className="w-5 h-5" />,
    color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    title: "Risk Reward Ratio",
    value: "1:1 Minimum RR",
    desc: "Maintain at least 1:1 risk to reward ratio.",
  },
  {
    num: 3,
    icon: <Shield className="w-5 h-5" />,
    color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    title: "TP & SL Mandatory",
    value: "Required",
    desc: "Take Profit and Stop Loss must be maintained for every trade.",
  },
  {
    num: 4,
    icon: <Target className="w-5 h-5" />,
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    title: "Starting Balance",
    value: "$100",
    desc: "Every participant will start with a $100 balance.",
  },
  {
    num: 5,
    icon: <Trophy className="w-5 h-5" />,
    color: "text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10",
    title: "Winner",
    value: "Highest % Return",
    desc: "Trader with the highest percentage return at the end wins.",
  },
  {
    num: 6,
    icon: <TrendingDown className="w-5 h-5" />,
    color: "text-rose-400 border-rose-500/30 bg-rose-500/10",
    title: "Daily Drawdown",
    value: "25%",
    desc: "Maximum daily drawdown allowed is 25%.",
  },
  {
    num: 7,
    icon: <BarChart3 className="w-5 h-5" />,
    color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    title: "Maximum Drawdown",
    value: "100%",
    desc: "Account washout at 100% drawdown.",
  },
  {
    num: 8,
    icon: <Clock className="w-5 h-5" />,
    color: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    title: "Challenge Duration",
    value: "Fixed Period",
    desc: "Challenge runs for a fixed duration of 6 months",
  },
  {
    num: 9,
    icon: <Activity className="w-5 h-5" />,
    color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
    title: "Minimum Trading Activity",
    value: "10 Trades",
    desc: "At least 10 trades must be placed in a month.",
  },
];

// High-fidelity spring animations for an organic and premium feel
const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 90,
      damping: 14,
    },
  },
};

const sentenceVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      damping: 12,
      stiffness: 100,
    },
  },
};

interface HomePageClientProps {
  initialTraders: Trader[];
}

export default function HomePageClient({ initialTraders }: HomePageClientProps) {
  const [selectedBadge, setSelectedBadge] = React.useState<any | null>(null);

  // Registration wizard states
  const [clientId, setClientId] = React.useState("");
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [verifiedClient, setVerifiedClient] = React.useState<any>(null);
  const [referralChecked, setReferralChecked] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [showPlaylistModal, setShowPlaylistModal] = React.useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId.trim()) {
      setErrorMsg("Please enter your Client ID.");
      setSuccessMsg(null);
      return;
    }
    if (!referralChecked) {
      setErrorMsg("You must check the box confirming you registered with referral ID 72725.");
      setSuccessMsg(null);
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/verify-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Welcome, ${data.client.name}! Your account balance of $${data.client.balance} has been successfully verified.`);
        setVerifiedClient(data.client);
        setShowPlaylistModal(true);
      } else {
        setErrorMsg(data.error || "Verification failed. Check your Client ID.");
      }
    } catch (err) {
      setErrorMsg("Connection to verification server failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Use server-loaded data or fallback if empty
  const topTraders = React.useMemo(() => {
    const list = initialTraders && initialTraders.length > 0 ? initialTraders : fallbackTraders;
    return list
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 5)
      .map((trader, index) => {
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
        const earnedBadges = trader.earnedBadges || determineTraderBadges({
          rank: index + 1,
          profit: trader.profit,
          drawdown: trader.drawdown,
          winRate: trader.winRate,
          volume: trader.volume,
          totalBalance: trader.totalBalance,
          tradesCount: trader.tradesCount,
        });
        return {
          ...trader,
          rank: index + 1,
          title: calculatedTitle,
          earnedBadges,
        };
      });
  }, [initialTraders]);

  return (
    <div className="flex flex-col w-full bg-[#050814] text-slate-100 overflow-x-hidden min-h-screen">

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:py-32 overflow-hidden border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-7 text-left space-y-6"
            >
              <motion.h1
                variants={sentenceVariants}
                initial="hidden"
                animate="visible"
                className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight leading-[1.1] text-white"
              >
                <span className="inline-block">
                  {"FOREX".split("").map((char, index) => (
                    <motion.span
                      key={`char-forex-${index}`}
                      variants={letterVariants}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
                {" "}
                <span className="inline-block">
                  {"TRADING".split("").map((char, index) => (
                    <motion.span
                      key={`char-trading-${index}`}
                      variants={letterVariants}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300 inline-block">
                  {"CHALLENGE".split("").map((char, index) => (
                    <motion.span
                      key={`char-challenge-${index}`}
                      variants={letterVariants}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              </motion.h1>

              <h3 className="text-xl md:text-2xl font-semibold text-slate-300 font-display">
                Compete. Rank. Earn Rewards.
              </h3>

              <p className="text-base md:text-lg text-slate-400 max-w-xl leading-relaxed">
                Join traders worldwide, climb the leaderboard, earn badges, win cash rewards, and prove your trading skills on our verified metrics portal.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-base shadow-[0_0_30px_-5px_rgba(124,58,237,0.5)] transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                >
                  Join the Challenge
                </Link>
                <Link
                  href="/leaderboard"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-white font-semibold text-base backdrop-blur-sm transition-all flex items-center justify-center gap-2 hover:border-slate-700"
                >
                  View Leaderboard
                  <ArrowRight className="w-4 h-4 text-violet-400" />
                </Link>
              </div>
            </motion.div>

            {/* Hero Image / Trophy Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 70, damping: 15, delay: 0.15 }}
              className="lg:col-span-5 relative flex justify-center items-center"
            >
              <div className="absolute w-[350px] h-[350px] bg-violet-600/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
              <div className="absolute w-[250px] h-[250px] bg-amber-500/5 rounded-full blur-3xl -z-10"></div>

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
            </motion.div>

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
              <motion.h2
                variants={sentenceVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                className="text-2xl md:text-3xl font-display font-extrabold uppercase tracking-wider text-white"
              >
                <span className="inline-block">
                  {"TOP".split("").map((char, index) => (
                    <motion.span
                      key={`char-top-${index}`}
                      variants={letterVariants}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
                {" "}
                <span className="inline-block">
                  {"TRADERS".split("").map((char, index) => (
                    <motion.span
                      key={`char-traders-${index}`}
                      variants={letterVariants}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
                {" "}
                <span className="inline-block">
                  {"THIS".split("").map((char, index) => (
                    <motion.span
                      key={`char-this-${index}`}
                      variants={letterVariants}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
                {" "}
                <span className="inline-block">
                  {"MONTH".split("").map((char, index) => (
                    <motion.span
                      key={`char-month-${index}`}
                      variants={letterVariants}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              </motion.h2>
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
            {topTraders.map((trader, idx) => (
              <motion.div
                key={trader.id}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                className={`glass-panel p-6 rounded-2xl relative overflow-hidden group transition-all duration-300 flex flex-col justify-between border backdrop-blur-md ${trader.rank === 1 ? "border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:border-amber-400/80 hover:shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:bg-amber-950/5" :
                    trader.rank === 2 ? "border-slate-400/30 shadow-[0_0_15px_rgba(148,163,184,0.15)] hover:border-slate-300/80 hover:shadow-[0_0_25px_rgba(148,163,184,0.35)] hover:bg-slate-900/10" :
                      trader.rank === 3 ? "border-amber-700/30 shadow-[0_0_15px_rgba(180,83,9,0.15)] hover:border-amber-600/80 hover:shadow-[0_0_25px_rgba(180,83,9,0.35)] hover:bg-amber-950/5" :
                        "border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)] hover:border-violet-400/70 hover:shadow-[0_0_25px_rgba(139,92,246,0.3)] hover:bg-violet-950/5"
                  }`}
              >
                {/* Card Subtle Top Color Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${trader.rank === 1 ? "from-amber-400 to-yellow-500" :
                    trader.rank === 2 ? "from-slate-300 to-slate-400" :
                      trader.rank === 3 ? "from-amber-700 to-amber-800" :
                        "from-slate-800 to-slate-700"
                  }`}></div>

                <div>
                  {/* Top Row: Rank & Badges */}
                  <div className="flex justify-between items-center mb-6">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-black text-sm border ${trader.rank === 1 ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
                        trader.rank === 2 ? "bg-slate-300/10 border-slate-300/30 text-slate-300" :
                          trader.rank === 3 ? "bg-amber-700/10 border-amber-700/30 text-amber-600" :
                            "bg-slate-800/50 border-slate-700/50 text-slate-400"
                      }`}>
                      {trader.rank === 1 ? "1st" : trader.rank === 2 ? "2nd" : trader.rank === 3 ? "3rd" : trader.rank}
                    </div>

                    {(() => {
                      const earnedBadges = trader.earnedBadges || determineTraderBadges({
                        rank: trader.rank,
                        profit: trader.profit,
                        drawdown: trader.drawdown,
                        winRate: trader.winRate,
                        volume: trader.volume,
                        totalBalance: trader.totalBalance,
                        tradesCount: trader.tradesCount,
                      }, "monthly");
                      if (earnedBadges.length === 0) return null;
                      const badgeId = earnedBadges[0];
                      const badgeInfo = BADGE_DEFINITIONS[badgeId];
                      if (!badgeInfo) return null;
                      return (
                        <button
                          onClick={() => setSelectedBadge(badgeInfo)}
                          title={`${badgeInfo.title} - Click to see requirements`}
                          className="transition-all duration-300 hover:scale-115 active:scale-90 cursor-pointer filter hover:brightness-110 shrink-0"
                        >
                          {renderCustomBadge(badgeId, "w-8 h-8")}
                        </button>
                      );
                    })()}
                  </div>

                  {/* Trader Core Info */}
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="relative mb-3">
                      <div className="w-16 h-16 rounded-full bg-slate-800 overflow-hidden border-2 border-slate-700/80 group-hover:border-violet-500/50 transition-colors">
                        <img
                          src={trader.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trader.name)}`}
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
                      +{(trader.profit ?? 0).toFixed(2)}%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 bg-slate-900/40 p-2 rounded-lg border border-slate-900/50 text-center font-medium">
                    <div>
                      <span className="block text-slate-500 text-[9px] uppercase tracking-wider">Win Rate</span>
                      <span className="text-slate-300">{trader.winRate ?? 0}%</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 text-[9px] uppercase tracking-wider">Drawdown</span>
                      <span className={`text-slate-300 ${(trader.drawdown ?? 0) > 15 ? "text-rose-400" : ""}`}>
                        {(trader.drawdown ?? 0).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16 border-t border-slate-900 pt-16">

            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="flex gap-4 p-5 rounded-2xl bg-slate-900/30 border border-slate-900/60 backdrop-blur-sm items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white font-display">2500+</h4>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Active Traders</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Real-time performance tracking and live metrics.</p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="flex gap-4 p-5 rounded-2xl bg-slate-900/30 border border-slate-900/60 backdrop-blur-sm items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white font-display">$50,000+</h4>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Monthly Rewards</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Earn prizes based on profit, drawdown & consistency.</p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="flex gap-4 p-5 rounded-2xl bg-slate-900/30 border border-slate-900/60 backdrop-blur-sm items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white font-display">6 Months</h4>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Challenge Duration</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Structured seasons to evaluate consistency & skill.</p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="flex gap-4 p-5 rounded-2xl bg-slate-900/30 border border-slate-900/60 backdrop-blur-sm items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white font-display">Multiple</h4>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Leaderboards</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Rankings computed Daily, Weekly, Monthly & All Time.</p>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* ── Registration Wizard Section ── */}
      <section className="py-20 border-b border-slate-900 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold mb-3 uppercase tracking-tight text-white">
              Join the Challenge
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm">
              Follow our simple three-step process to verify your account, fill details, and start tracking your success.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 mb-16">
            {[
              { num: 1, label: "Verify Account", sub: "Enter Client ID" },
              { num: 2, label: "Fill Form", sub: "Google Form registration" },
              { num: 3, label: "Rules & Rewards", sub: "Review requirements" },
            ].map((step, i) => {
              const isActive = currentStep === step.num;
              const isCompleted = currentStep > step.num;
              return (
                <div key={step.num} className="flex items-center gap-4">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm mb-2 transition-all duration-300 ${
                      isActive 
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30 ring-2 ring-violet-500/20" 
                        : isCompleted 
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                        : "bg-slate-900 border border-slate-800 text-slate-500"
                    }`}>
                      {isCompleted ? "✓" : step.num}
                    </div>
                    <div className={`text-xs sm:text-sm font-semibold transition-colors ${
                      isActive ? "text-violet-400 font-bold" : isCompleted ? "text-emerald-400" : "text-slate-500"
                    }`}>{step.label}</div>
                    <div className="text-[10px] text-slate-500 hidden sm:block">{step.sub}</div>
                  </div>
                  {i < 2 && (
                    <div className={`w-12 sm:w-20 h-px mb-6 transition-colors duration-300 ${
                      currentStep > step.num ? "bg-emerald-500" : "bg-slate-800"
                    }`}></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* STEP 1: Verification */}
          {currentStep === 1 && (
            <div className="glass-panel rounded-3xl p-8 md:p-10 mb-10 border border-slate-800 bg-slate-950/40 relative">
              <h3 className="text-lg font-display font-bold mb-6 text-center text-white">
                Step 1: Verify Your Alpari Account
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Verification card */}
                <div className="bg-slate-950/40 rounded-2xl p-6 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.05)] space-y-5 text-left flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-blue-400 tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Challenge Access Gate
                      </div>
                      <div className="bg-slate-800/80 border border-slate-700/80 px-2 py-0.5 rounded text-[8px] font-black text-slate-400 tracking-wider uppercase">
                        Server-Only
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-display font-bold text-white uppercase">Verify Your Client ID</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mt-2">
                        Enter your Alpari client ID. Once verified, the challenge portal unlocks and your balance is recorded.
                      </p>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer group text-xs text-slate-350">
                        <input
                          type="checkbox"
                          checked={referralChecked}
                          onChange={(e) => {
                            setReferralChecked(e.target.checked);
                            setErrorMsg(null);
                          }}
                          className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-950 text-violet-600 focus:ring-violet-600/50 cursor-pointer"
                        />
                        <span className="leading-snug select-none text-slate-300">
                          I confirm that I have registered my Alpari account using referral ID <strong className="text-amber-400">72725</strong> to join in the challenge.
                        </span>
                      </label>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Client ID
                        </label>
                        <input
                          type="text"
                          value={clientId}
                          onChange={(e) => {
                            setClientId(e.target.value);
                            setErrorMsg(null);
                            setSuccessMsg(null);
                          }}
                          placeholder="Enter your Client ID (e.g. f0a5788d3e6)"
                          className="w-full bg-slate-950/60 border border-slate-850 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                        />
                      </div>
                      {errorMsg && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-4 py-3 rounded-xl leading-relaxed">
                          {errorMsg}
                        </div>
                      )}
                      {successMsg && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 text-xs px-4 py-3 rounded-xl leading-relaxed font-semibold">
                          {successMsg}
                        </div>
                      )}
                      <button
                        type="submit"
                        disabled={isVerifying || !referralChecked}
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-950/20 disabled:text-slate-600 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/10 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isVerifying ? "Verifying..." : "Verify Challenge Access"}
                      </button>
                    </form>
                  </div>

                  {verifiedClient && (
                    <div className="pt-4 mt-4 border-t border-slate-900 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-violet-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Continue to Google Form
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Account opening card */}
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 space-y-5 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-white text-center mb-3">
                      No, I don&apos;t have an Alpari Account
                    </h4>
                    <p className="text-xs text-slate-400 text-center mb-6">
                      Open your account with Alpari under our referral link to participate.
                    </p>
                    <ul className="space-y-3 mb-6">
                      {[
                        "Must use referral code 72725",
                        "Trusted global broker",
                        "Competitive spreads",
                        "Secure & reliable deposits",
                      ].map((perk, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">✓</span>
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href="https://alpari.com/en/?Referral=72725"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-sm text-center flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"
                  >
                    Open Alpari Account
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Embedded Google Form */}
          {currentStep === 2 && (
            <div className="glass-panel rounded-3xl p-6 md:p-8 mb-10 border border-slate-800 bg-slate-950/40 relative overflow-hidden flex flex-col items-center">
              <div className="text-center mb-6 space-y-2">
                <h3 className="text-xl font-display font-black text-white uppercase tracking-wider">
                  Step 2: Fill the Google Form
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Please complete the form below using the client ID you verified in Step 1.
                </p>
              </div>
              
              <div className="w-full relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/50 h-[750px] min-h-[600px]">
                <iframe
                  src="https://docs.google.com/forms/d/e/1FAIpQLSe5FB5CkkrPeVE0CTNhFWTRQ1MOnDWLvSBsn8lgKUMghzbCfA/viewform?embedded=true"
                  className="absolute inset-0 w-full h-full border-0"
                  title="Registration Form"
                >
                  Loading…
                </iframe>
              </div>

              <div className="flex justify-between items-center w-full mt-8 pt-6 border-t border-slate-900 gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition-colors border border-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-600/10 flex items-center gap-2 cursor-pointer"
                >
                  Continue to Rules & Rewards
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Complete */}
          {currentStep === 3 && (
            <div className="glass-panel rounded-3xl p-8 md:p-10 border border-slate-800 text-center space-y-4 bg-slate-950/40">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl md:text-2xl font-display font-bold text-white">Registration Completed!</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                You are all set! Ensure you trade using your verified Alpari Client ID. Review the rules and rewards below to make sure you stay qualified!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition-colors border border-slate-800 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Form
                </button>
                <Link
                  href="/leaderboard"
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-600/10 flex items-center justify-center gap-2"
                >
                  Go to Leaderboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Challenge Rules Section */}
      <section className="py-24 bg-slate-950/40 relative border-b border-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center mb-16 space-y-3">
            <motion.h2
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-display font-extrabold uppercase tracking-wider text-white"
            >
              Challenge Rules
            </motion.h2>
            <motion.p
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-slate-400 max-w-xl mx-auto text-sm md:text-base font-medium"
            >
              Please read and understand the rules before you start.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {challengeRules.map((rule) => (
              <motion.div
                key={rule.num}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                className="glass-panel rounded-3xl p-6 border border-slate-800/80 relative group hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Rule Number Badge */}
                <div className="absolute top-4 left-4 w-6 h-6 rounded-md bg-violet-600/20 border border-violet-500/30 text-violet-400 flex items-center justify-center text-[10px] font-black font-display">
                  {rule.num}
                </div>

                <div className="flex flex-col items-center text-center pt-6 space-y-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${rule.color}`}>
                    {rule.icon}
                  </div>
                  <h4 className="font-bold text-white text-base">{rule.title}</h4>
                  <div className="font-display font-black text-brand-400 text-xl">{rule.value}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{rule.desc}</p>
                </div>
              </motion.div>
            ))}

            {/* Important Note Card */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="glass-panel rounded-3xl p-6 border border-amber-500/20 bg-amber-500/5 relative flex flex-col justify-center items-center"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center border text-amber-400 bg-amber-500/10 border-amber-500/30">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-amber-400 text-base">Important Note</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Violation of any rule may lead to disqualification. We promote fair trading and a level playing field for all participants.
                </p>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Rewards & Prizes Section */}
      <section className="py-24 bg-gradient-to-b from-[#050814] to-[#03050c] relative border-b border-slate-900/60 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center mb-16 space-y-3">
            <motion.h2
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-display font-extrabold uppercase tracking-wider text-white"
            >
              Rewards & Prizes
            </motion.h2>
            <motion.p
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-slate-400 max-w-xl mx-auto text-sm md:text-base font-medium"
            >
              Compete, earn badges, and win exciting rewards.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

            {/* Left Card: Final Winner */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              onClick={() => setSelectedBadge(BADGE_DEFINITIONS.final_winner)}
              className="lg:col-span-4 bg-slate-950/70 border border-slate-900 rounded-3xl p-8 flex flex-col justify-between items-center text-center relative group hover:border-slate-800 hover:shadow-[0_0_50px_rgba(226,165,18,0.08)] transition-all duration-500 overflow-hidden cursor-pointer"
            >
              {/* Shiny Gold Background Glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-700"></div>

              <div className="w-full flex flex-col items-center">
                {/* Trophy Container with Framer Motion Animation */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="w-48 h-48 flex items-center justify-center relative mb-6"
                >
                  <div className="absolute inset-0 bg-radial-glow from-amber-500/10 to-transparent blur-2xl rounded-full scale-125 animate-pulse"></div>
                  <img
                    src="/trading_trophy.png"
                    alt="Final Winner Trophy"
                    className="w-full h-full object-contain relative z-10 drop-shadow-[0_10px_30px_rgba(226,165,18,0.3)]"
                  />
                </motion.div>

                <h3 className="text-2xl font-display font-extrabold uppercase tracking-wider text-amber-400 mb-2">
                  Final Winner
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
                  The trader with the most Top Rank Monthly badges will be crowned the Ultimate FX Champion!
                </p>
              </div>

              {/* Exclusive Rewards Section */}
              <div className="w-full border-t border-slate-900/80 pt-6 mt-4">
                <div className="text-[10px] text-amber-500 uppercase tracking-widest font-black mb-4">
                  Exclusive Rewards
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/40 border border-slate-900/60 text-center">
                    <Award className="w-5 h-5 text-amber-400 mb-2" />
                    <span className="text-xs font-bold text-slate-200">Physical Badge</span>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/40 border border-slate-900/60 text-center">
                    <Gift className="w-5 h-5 text-amber-400 mb-2" />
                    <span className="text-xs font-bold text-slate-200">Premium Gifts</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Panel: Achievements & Badges */}
            <div className="lg:col-span-8 flex flex-col justify-between gap-6">

              <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 sm:p-8 flex-1">
                <div className="text-xs text-slate-400 uppercase tracking-widest font-black mb-8 border-b border-slate-900 pb-4">
                  Achievements & Badges
                </div>

                {/* 3x2 Grid of Badges */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* Badge 1: Top Rank Monthly */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedBadge(BADGE_DEFINITIONS.top_rank_monthly)}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-900/80 flex flex-col items-start gap-4 hover:border-slate-800 transition-colors relative group overflow-hidden cursor-pointer"
                  >
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[8px] font-bold text-amber-400 tracking-wider uppercase">
                      Best Badge
                    </div>
                    {/* SVG Gold Medal Icon */}
                    <div className="w-12 h-12 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform group-hover:scale-110 transition-transform duration-350" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 38L18 56L32 50L46 56L40 38" fill="url(#gold-ribbon-grad)" />
                        <circle cx="32" cy="28" r="18" fill="url(#gold-grad)" filter="drop-shadow(0px 4px 8px rgba(226, 165, 18, 0.3))" />
                        <circle cx="32" cy="28" r="14" stroke="#FFE9A3" strokeWidth="1" />
                        <text x="32" y="33.5" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="15" fill="#6A4600" textAnchor="middle">1</text>
                        <defs>
                          <linearGradient id="gold-grad" x1="14" y1="10" x2="50" y2="46" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#FFE072" />
                            <stop offset="0.5" stopColor="#F2AF29" />
                            <stop offset="1" stopColor="#C78704" />
                          </linearGradient>
                          <linearGradient id="gold-ribbon-grad" x1="18" y1="38" x2="46" y2="56" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#D99706" />
                            <stop offset="1" stopColor="#8C5C00" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 mb-1">Top Rank Monthly</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Awarded to the top ranked trader each month.
                      </p>
                    </div>
                  </motion.div>

                  {/* Badge 2: Weekly Top */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedBadge(BADGE_DEFINITIONS.weekly_top)}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-900/80 flex flex-col items-start gap-4 hover:border-slate-800 transition-colors group cursor-pointer"
                  >
                    {/* SVG Purple Medal */}
                    <div className="w-12 h-12 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform group-hover:scale-110 transition-transform duration-350" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 38L18 56L32 50L46 56L40 38" fill="url(#purple-ribbon-grad)" />
                        <circle cx="32" cy="28" r="18" fill="url(#purple-grad)" filter="drop-shadow(0px 4px 8px rgba(168, 85, 247, 0.3))" />
                        <circle cx="32" cy="28" r="14" stroke="#F5EDFF" strokeWidth="1" />
                        <path d="M32 19L34.5 24.5L40.5 25.3L36 29.5L37.2 35.5L32 32.5L26.8 35.5L28 29.5L23.5 25.3L29.5 24.5L32 19Z" fill="#FBF8FF" />
                        <defs>
                          <linearGradient id="purple-grad" x1="14" y1="10" x2="50" y2="46" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#D8B4FE" />
                            <stop offset="0.5" stopColor="#A855F7" />
                            <stop offset="1" stopColor="#701A75" />
                          </linearGradient>
                          <linearGradient id="purple-ribbon-grad" x1="18" y1="38" x2="46" y2="56" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#9333EA" />
                            <stop offset="1" stopColor="#581C87" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 mb-1">Weekly Top</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Awarded to the top performer of the week.
                      </p>
                    </div>
                  </motion.div>

                  {/* Badge 3: Consistent Trader */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedBadge(BADGE_DEFINITIONS.consistent_trader)}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-900/80 flex flex-col items-start gap-4 hover:border-slate-800 transition-colors group cursor-pointer"
                  >
                    {/* SVG Green Shield */}
                    <div className="w-12 h-12 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform group-hover:scale-110 transition-transform duration-350" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M32 8C42 8 50 12 50 12V28C50 40 32 52 32 52C32 52 14 40 14 28V12C14 12 22 8 32 8Z" fill="url(#green-grad)" filter="drop-shadow(0px 4px 8px rgba(34, 197, 94, 0.3))" />
                        <path d="M32 12C39.5 12 46 15 46 15V28C46 38 32 48 32 48C32 48 18 38 18 28V15C18 15 24.5 12 32 12Z" stroke="#DCFCE7" strokeWidth="1" />
                        <path d="M32 20L34.5 25L40 25.8L36 29.8L37.2 35.3L32 32.5L26.8 35.3L28 29.8L24 25.8L29.5 25L32 20Z" fill="#F0FDF4" />
                        <defs>
                          <linearGradient id="green-grad" x1="14" y1="8" x2="50" y2="52" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#86EFAC" />
                            <stop offset="0.5" stopColor="#22C55E" />
                            <stop offset="1" stopColor="#14532D" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 mb-1">Consistent Trader</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Awarded for consistent performance throughout the challenge.
                      </p>
                    </div>
                  </motion.div>

                  {/* Badge 4: Low Drawdown Trader */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedBadge(BADGE_DEFINITIONS.low_drawdown)}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-900/80 flex flex-col items-start gap-4 hover:border-slate-800 transition-colors group cursor-pointer"
                  >
                    {/* SVG Blue Shield */}
                    <div className="w-12 h-12 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform group-hover:scale-110 transition-transform duration-350" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M32 8C42 8 50 12 50 12V28C50 40 32 52 32 52C32 52 14 40 14 28V12C14 12 22 8 32 8Z" fill="url(#blue-grad)" filter="drop-shadow(0px 4px 8px rgba(59, 130, 246, 0.3))" />
                        <path d="M32 12C39.5 12 46 15 46 15V28C46 38 32 48 32 48C32 48 18 38 18 28V15C18 15 24.5 12 32 12Z" stroke="#DBEAFE" strokeWidth="1" />
                        <path d="M32 20L34.5 25L40 25.8L36 29.8L37.2 35.3L32 32.5L26.8 35.3L28 29.8L24 25.8L29.5 25L32 20Z" fill="#EFF6FF" />
                        <defs>
                          <linearGradient id="blue-grad" x1="14" y1="8" x2="50" y2="52" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#93C5FD" />
                            <stop offset="0.5" stopColor="#3B82F6" />
                            <stop offset="1" stopColor="#1E3A8A" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 mb-1">Low Drawdown Trader</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Awarded for maintaining low drawdown.
                      </p>
                    </div>
                  </motion.div>

                  {/* Badge 5: Trader of the Week */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedBadge(BADGE_DEFINITIONS.trader_of_the_week)}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-900/80 flex flex-col items-start gap-4 hover:border-slate-800 transition-colors group cursor-pointer"
                  >
                    {/* SVG Bronze Medal */}
                    <div className="w-12 h-12 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform group-hover:scale-110 transition-transform duration-350" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 38L18 56L32 50L46 56L40 38" fill="url(#bronze-ribbon-grad)" />
                        <circle cx="32" cy="28" r="18" fill="url(#bronze-grad)" filter="drop-shadow(0px 4px 8px rgba(217, 119, 6, 0.25))" />
                        <circle cx="32" cy="28" r="14" stroke="#FEF3C7" strokeWidth="1" />
                        <path d="M32 19L34.5 24.5L40.5 25.3L36 29.5L37.2 35.5L32 32.5L26.8 35.5L28 29.5L23.5 25.3L29.5 24.5L32 19Z" fill="#FEF3C7" />
                        <defs>
                          <linearGradient id="bronze-grad" x1="14" y1="10" x2="50" y2="46" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#FCD34D" />
                            <stop offset="0.5" stopColor="#D97706" />
                            <stop offset="1" stopColor="#78350F" />
                          </linearGradient>
                          <linearGradient id="bronze-ribbon-grad" x1="18" y1="38" x2="46" y2="56" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#B45309" />
                            <stop offset="1" stopColor="#451A03" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 mb-1">Trader of the Week</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Recognizing outstanding trading performance of the week.
                      </p>
                    </div>
                  </motion.div>

                  {/* Badge 6: Best Risk Manager */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedBadge(BADGE_DEFINITIONS.best_risk_manager)}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-900/80 flex flex-col items-start gap-4 hover:border-slate-800 transition-colors group cursor-pointer"
                  >
                    {/* SVG Teal Shield */}
                    <div className="w-12 h-12 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform group-hover:scale-110 transition-transform duration-350" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M32 8C42 8 50 12 50 12V28C50 40 32 52 32 52C32 52 14 40 14 28V12C14 12 22 8 32 8Z" fill="url(#teal-grad)" filter="drop-shadow(0px 4px 8px rgba(20, 184, 166, 0.3))" />
                        <path d="M32 12C39.5 12 46 15 46 15V28C46 38 32 48 32 48C32 48 18 38 18 28V15C18 15 24.5 12 32 12Z" stroke="#CCFBF1" strokeWidth="1" />
                        <path d="M32 20L34.5 25L40 25.8L36 29.8L37.2 35.3L32 32.5L26.8 35.3L28 29.8L24 25.8L29.5 25L32 20Z" fill="#F0FDFA" />
                        <defs>
                          <linearGradient id="teal-grad" x1="14" y1="8" x2="50" y2="52" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#5EEAD4" />
                            <stop offset="0.5" stopColor="#14B8A6" />
                            <stop offset="1" stopColor="#115E59" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 mb-1">Best Risk Manager</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Awarded for excellent risk management and discipline.
                      </p>
                    </div>
                  </motion.div>

                </div>
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
              <motion.div
                key={index}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                className="glass-panel p-6 rounded-2xl border border-slate-900 relative flex flex-col justify-between group hover:border-slate-800 transition-colors"
              >

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
                    <ChevronRight className="w-5 h-5 text-slate-700" />
                  </div>
                )}

              </motion.div>
            ))}

          </div>

        </div>
      </section>



      {/* Badge Rules Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"
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

              <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800/50 text-left space-y-3">
                <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest block">
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

      {/* YouTube Playlist Modal */}
      {showPlaylistModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
            onClick={() => setShowPlaylistModal(false)}
          />

          {/* Modal Container */}
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowPlaylistModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-850 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors z-20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Body */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-display font-extrabold text-white uppercase tracking-wide">
                  Verification Successful!
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Your Client ID is verified. As a participant in the challenge, you have unlocked our curated Forex trading educational series.
                </p>
              </div>

              {/* YouTube Playlist Thumbnail Card */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 group shadow-lg">
                {/* Thumbnail Image */}
                <img
                  src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80"
                  alt="Forex Trading Playlist"
                  className="w-full h-56 object-cover filter brightness-75 group-hover:scale-105 transition-transform duration-700"
                />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors">
                  <a
                    href="https://www.youtube.com/playlist?list=PLm218z4JbA6E3B878d6S1DqSdf5b10oH_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-xl shadow-red-600/30 hover:scale-110 active:scale-95 transition-all duration-300"
                  >
                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                  </a>
                </div>

                {/* Playlist Label */}
                <div className="absolute bottom-4 left-4 bg-slate-950/80 border border-slate-800 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  TradeTalks Forex Bootcamp
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href="https://www.youtube.com/playlist?list=PLm218z4JbA6E3B878d6S1DqSdf5b10oH_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest text-center shadow-lg shadow-red-650/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Watch Playlist Now
                </a>
                <button
                  type="button"
                  onClick={() => setShowPlaylistModal(false)}
                  className="sm:px-6 py-3.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs uppercase tracking-widest transition-colors hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  Close & Proceed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
