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
  ChevronDown,
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
  CheckCircle2,
  Medal,
  Share2,
  Copy,
  Check
} from "lucide-react";
import { Trader } from "@/lib/leaderboardApi";
import {
  TopRankBadge,
  WeeklyTopBadge,
  ConsistentTraderBadge,
  MostActiveTraderBadge,
  TraderOfWeekBadge,
  BestRiskManagerBadge
} from "@/components/BadgeIcons";

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
    icon: <Target className="w-5 h-5" />,
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    title: "Starting Balance",
    value: "$100",
    desc: "Every participant will start with a $100 balance.",
  },
  {
    num: 3,
    icon: <Trophy className="w-5 h-5" />,
    color: "text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10",
    title: "Winner",
    value: "Highest % Return",
    desc: "Trader with the highest percentage return at the end wins.",
  },
  {
    num: 4,
    icon: <Clock className="w-5 h-5" />,
    color: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    title: "Challenge Duration",
    value: "Fixed Period",
    desc: "Challenge runs for a fixed duration of 6 months.",
  },
  {
    num: 5,
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
  // Selected badge state removed

  // Registration wizard states
  const [clientId, setClientId] = React.useState("");
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [verifiedClient, setVerifiedClient] = React.useState<any>(null);
  const [referralChecked, setReferralChecked] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [showPlaylistModal, setShowPlaylistModal] = React.useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = React.useState(false);
  const [selectedVideoId, setSelectedVideoId] = React.useState("lmtgjAD18nE");
  const [iframeLoads, setIframeLoads] = React.useState(0);

  const handleIframeLoad = () => {
    setIframeLoads((prev) => {
      const nextCount = prev + 1;
      // Google Form reloads to success page on submission
      if (nextCount > 1) {
        setCurrentStep(3);
      }
      return nextCount;
    });
  };

  const [selectedTrader, setSelectedTrader] = React.useState<Trader | null>(null);
  const [selectedBadge, setSelectedBadge] = React.useState<{
    name: string;
    desc: string;
    condition: string;
    color: string;
    icon: React.ReactNode;
  } | null>(null);

  const [badgeRules, setBadgeRules] = React.useState<any[]>([]);
  const [openAccordion, setOpenAccordion] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("/api/badge-rules")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBadgeRules(data);
        }
      })
      .catch((err) => console.error("Error fetching badge rules:", err));
  }, []);

  const handleBadgeClick = (badgeName: string) => {
    let cleanBadgeName = badgeName;
    if (badgeName === "Weekly Top") {
      cleanBadgeName = "Trader of the Week";
    }

    const badge = BADGE_DETAILS[cleanBadgeName];
    if (!badge) return;

    const matchedRule = badgeRules.find((r) => r._id === cleanBadgeName);
    
    const formatConditions = (rule: any) => {
      if (rule.conditions && Array.isArray(rule.conditions) && rule.conditions.length > 0) {
        return rule.conditions.map((cond: any) => {
          const opSign = cond.operator === "gte" ? "≥" : cond.operator === "lte" ? "≤" : cond.operator === "gt" ? ">" : cond.operator === "lt" ? "<" : "=";
          
          let metricDisplay = cond.metric;
          if (cond.metric === "profit") metricDisplay = "Profit Return";
          else if (cond.metric === "volume") metricDisplay = "Volume (Lots)";
          else if (cond.metric === "settledRebates") metricDisplay = "Settled Rebates";
          else if (cond.metric === "totalBalance") metricDisplay = "Account Balance";
          else if (cond.metric === "totalEquity") metricDisplay = "Account Equity";
          
          return `${metricDisplay} ${opSign} ${cond.value}`;
        }).join(" AND ");
      }
      
      const opSign = rule.operator === "gte" ? "≥" : rule.operator === "lte" ? "≤" : rule.operator === "gt" ? ">" : rule.operator === "lt" ? "<" : "=";
      
      let metricDisplay = rule.metric;
      if (rule.metric === "profit") metricDisplay = "Profit Return";
      else if (rule.metric === "volume") metricDisplay = "Volume (Lots)";
      else if (rule.metric === "settledRebates") metricDisplay = "Settled Rebates";
      else if (rule.metric === "totalBalance") metricDisplay = "Account Balance";
      else if (rule.metric === "totalEquity") metricDisplay = "Account Equity";
      
      return `${metricDisplay} ${opSign} ${rule.value}`;
    };

    setSelectedBadge({
      name: cleanBadgeName,
      desc: matchedRule?.description || badge.desc,
      condition: matchedRule
        ? `Requires: ${formatConditions(matchedRule)} (${matchedRule.points} Points) - Next evaluation: ${matchedRule.nextEvaluationTime ? new Date(matchedRule.nextEvaluationTime).toLocaleString() : 'N/A'}`
        : badge.condition,
      color: badge.color,
      icon: badge.icon
    });
  };

  const [sharingTrader, setSharingTrader] = React.useState<Trader | null>(null);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [shareError, setShareError] = React.useState<string | null>(null);
  const [copiedLink, setCopiedLink] = React.useState(false);

  // Generate scorecard image on the fly when modal opens
  React.useEffect(() => {
    if (!sharingTrader) {
      setPreviewImage(null);
      return;
    }
    
    setIsGenerating(true);
    setShareError(null);

    const logoImg = new Image();
    logoImg.src = "/logo.svg";

    const drawCanvas = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setIsGenerating(false);
        return;
      }

      // Draw premium gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 800, 1000);
      bgGradient.addColorStop(0, "#020617"); // slate-950
      bgGradient.addColorStop(0.5, "#0b1528");
      bgGradient.addColorStop(1, "#030712");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, 800, 1000);

      // Radial background glow circles
      const glow1 = ctx.createRadialGradient(400, 500, 50, 400, 500, 450);
      glow1.addColorStop(0, "rgba(99, 102, 241, 0.18)"); // indigo-500
      glow1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow1;
      ctx.beginPath();
      ctx.arc(400, 500, 450, 0, Math.PI * 2);
      ctx.fill();

      const glow2 = ctx.createRadialGradient(200, 200, 50, 200, 200, 300);
      glow2.addColorStop(0, "rgba(139, 92, 246, 0.15)"); // violet-500
      glow2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow2;
      ctx.beginPath();
      ctx.arc(200, 200, 300, 0, Math.PI * 2);
      ctx.fill();

      // Subtle decorative grid lines
      ctx.strokeStyle = "rgba(148, 163, 184, 0.04)";
      ctx.lineWidth = 1;
      for (let x_pos = 0; x_pos < 800; x_pos += 80) {
        ctx.beginPath();
        ctx.moveTo(x_pos, 0);
        ctx.lineTo(x_pos, 1000);
        ctx.stroke();
      }
      for (let y_pos = 0; y_pos < 1000; y_pos += 80) {
        ctx.beginPath();
        ctx.moveTo(0, y_pos);
        ctx.lineTo(800, y_pos);
        ctx.stroke();
      }

      // Outer border frame
      ctx.strokeStyle = "rgba(56, 189, 248, 0.2)"; // brand-400
      ctx.lineWidth = 3;
      ctx.strokeRect(30, 30, 740, 940);

      // Thin inner border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 40, 720, 920);

      // Draw Trade Talks Logo
      try {
        ctx.drawImage(logoImg, 290, 75, 220, 55);
      } catch (e) {
        console.error("Error drawing logo SVG:", e);
      }

      // Header Branding Title
      ctx.font = "bold 15px 'Space Grotesk', 'Inter', sans-serif";
      ctx.fillStyle = "#38bdf8"; // brand-400
      ctx.textAlign = "center";
      ctx.fillText("CHALLENGE STANDINGS", 400, 165);

      // Main Glassmorphic Container Box
      ctx.fillStyle = "rgba(15, 23, 42, 0.7)"; // slate-900/70
      const r_val = 24;
      const cardX = 80, cardY = 200, cardW = 640, cardH = 580;
      
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
      ctx.font = "bold 38px 'Space Grotesk', 'Inter', sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(sharingTrader.name, 400, 275);

      // Rank Badge Pill
      const rankText = `RANK #${sharingTrader.rank}`;
      ctx.font = "bold 20px 'Space Grotesk', 'Inter', sans-serif";
      const w_text = ctx.measureText(rankText).width;
      const bW = w_text + 36;
      const bH = 40;
      const bX = 400 - bW / 2;
      const bY = 310;
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
      ctx.lineTo(bX + r_val, bY + bH);
      ctx.quadraticCurveTo(bX, bY + bH, bX, bY + bH - bR);
      ctx.lineTo(bX, bY + bR);
      ctx.quadraticCurveTo(bX, bY, bX + bR, bY);
      ctx.closePath();
      ctx.fillStyle = rankGradient;
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.fillText(rankText, 400, bY + 27);

      // Profit return percent
      const profitVal = sharingTrader.profit ?? 0;
      const isPositive = profitVal >= 0;
      const profitText = `${isPositive ? "+" : ""}${profitVal.toFixed(2)}%`;
      ctx.font = "bold 80px 'Space Grotesk', 'Inter', sans-serif";
      ctx.fillStyle = isPositive ? "#10b981" : "#f43f5e"; // emerald-500 or rose-500
      ctx.fillText(profitText, 400, 455);

      ctx.font = "bold 14px 'Inter', sans-serif";
      ctx.fillStyle = "#64748b"; // slate-500
      ctx.fillText("PROFIT ROI RETURN", 400, 485);

      // Separator inside card
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(140, 530);
      ctx.lineTo(660, 530);
      ctx.stroke();

      // Volume & Starting balance metrics
      ctx.font = "bold 18px 'Space Grotesk', 'Inter', sans-serif";
      ctx.fillStyle = "#cbd5e1";
      ctx.textAlign = "left";
      ctx.fillText(`VOLUME: ${(sharingTrader.volume ?? 0).toFixed(2)} Lots`, 160, 580);

      ctx.textAlign = "right";
      ctx.fillText(`START CAPITAL: $${(sharingTrader.mtNetDeposits ?? 100).toFixed(2)}`, 640, 580);

      // Badges & Points Count
      ctx.font = "medium 14px 'Inter', sans-serif";
      ctx.fillStyle = "#64748b";
      ctx.textAlign = "center";
      const badgesCount = sharingTrader.earnedBadges?.length ?? 0;
      ctx.fillText(`BADGES EARNED: ${badgesCount}  |  TOTAL POINTS: ${sharingTrader.totalPoints ?? 0} PTS`, 400, 650);

      // Card Bottom Footer
      ctx.font = "medium 14px 'Inter', sans-serif";
      ctx.fillStyle = "#475569"; // slate-600
      ctx.fillText("WWW.TRADETALKS.IN  |  COMPETE & WIN REAL PRIZES", 400, 870);

      try {
        const url = canvas.toDataURL("image/png");
        setPreviewImage(url);
      } catch (err) {
        console.error("Canvas toDataURL error:", err);
        setShareError("Could not generate image on this device.");
      } finally {
        setIsGenerating(false);
      }
    };

    if (logoImg.complete) {
      drawCanvas();
    } else {
      logoImg.onload = drawCanvas;
      logoImg.onerror = () => {
        console.error("Failed to load Trade Talks logo, drawing without it.");
        drawCanvas();
      };
    }
  }, [sharingTrader]);

  const handleShare = (e: React.MouseEvent, trader: any) => {
    e.stopPropagation(); // prevent opening details modal
    setSharingTrader(trader);
  };

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
        setVerifiedClient(data.client);
        setIframeLoads(0); // Reset for Step 2
        setCurrentStep(2);
      } else {
        setErrorMsg(data.error || "Verification failed. Check your Client ID.");
      }
    } catch (err) {
      setErrorMsg("Connection to verification server failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Use server-loaded data or empty if none
  const topTraders = React.useMemo(() => {
    const list = initialTraders && initialTraders.length > 0 ? initialTraders : [];
    return list
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
        return {
          ...trader,
          rank: index + 1,
          title: calculatedTitle,
        };
      })
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 10)
      .map((t, idx) => ({ ...t, rank: idx + 1 }));
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
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Monthly Rewards</div>
                    <div className="text-lg font-bold font-display text-white">Rs 10,000+</div>
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
              className="lg:col-span-4 bg-slate-950/70 border border-slate-900 rounded-3xl p-8 flex flex-col justify-between items-center text-center relative group hover:border-slate-800 hover:shadow-[0_0_50px_rgba(226,165,18,0.08)] transition-all duration-500 overflow-hidden"
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
                  <Trophy className="w-24 h-24 text-amber-400 relative z-10 drop-shadow-[0_10px_30px_rgba(226,165,18,0.3)] animate-pulse" />
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

                {/* Desktop Badges Grid (Visible on md and above) */}
                <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: <TopRankBadge className="w-10 h-10" />,
                      title: "Top Rank Monthly",
                      subtitle: "BEST BADGE",
                      desc: "Awarded to the top ranked trader each month.",
                    },
                    {
                      icon: <ConsistentTraderBadge className="w-10 h-10" />,
                      title: "Consistent Trader",
                      desc: "Awarded for consistent performance throughout the challenge.",
                    },
                    {
                      icon: <MostActiveTraderBadge className="w-10 h-10" />,
                      title: "Most Active Trader",
                      desc: "Awarded for highest active volume (settled + unsettled).",
                    },
                    {
                      icon: <TraderOfWeekBadge className="w-10 h-10" />,
                      title: "Trader of the Week",
                      desc: "Recognizing outstanding trading performance of the week.",
                    },
                    {
                      icon: <BestRiskManagerBadge className="w-10 h-10" />,
                      title: "Best Risk Manager",
                      desc: "Awarded for excellent risk management and discipline.",
                    },
                  ].map((badge, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleBadgeClick(badge.title)}
                      className="w-full text-left glass-panel rounded-2xl p-5 border border-slate-900 flex flex-col justify-between items-start gap-4 hover:border-violet-500/50 hover:bg-slate-900/40 hover:shadow-lg transition-all duration-300 relative group overflow-hidden cursor-pointer"
                    >
                      <div className="flex justify-between items-start w-full">
                        <div className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                          {badge.icon}
                        </div>
                        {badge.subtitle && (
                          <span className="text-[8px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-black tracking-widest uppercase">
                            {badge.subtitle}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 w-full text-left">
                        <h4 className="font-bold text-white text-sm group-hover:text-violet-400 transition-colors">{badge.title}</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{badge.desc}</p>
                        <span className="text-[9px] text-brand-450 font-bold mt-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          View Rules →
                        </span>
                      </div>
                    </button>
                  ))}

                  {/* Next Evaluation Schedules Card */}
                  <div className="glass-panel rounded-2xl p-5 border border-violet-500/20 bg-violet-500/5 flex flex-col justify-between items-start gap-4 hover:border-violet-500/45 transition-all duration-300 relative group overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute -top-12 -left-12 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/20 transition-all duration-500"></div>

                    <div className="flex justify-between items-start w-full relative z-10">
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
                        <Clock className="w-5 h-5 animate-pulse" />
                      </div>
                      <span className="text-[8px] bg-violet-500/15 border border-violet-500/30 text-violet-400 px-2 py-0.5 rounded font-black tracking-widest uppercase">
                        Schedule
                      </span>
                    </div>

                    <div className="space-y-3 w-full text-left relative z-10">
                      <h4 className="font-bold text-white text-sm">Next Evaluations</h4>
                      
                      <div className="space-y-2">
                        {/* Weekly Evaluation */}
                        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-2.5 flex flex-col gap-1">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-slate-350">WEEKLY BADGE</span>
                            <span className="text-[9px] text-violet-400 font-mono font-bold">
                              {(() => {
                                const rule = badgeRules.find(r => r._id === "Trader of the Week");
                                if (!rule || !rule.nextEvaluationTime) return "N/A";
                                return new Date(rule.nextEvaluationTime).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                });
                              })()}
                            </span>
                          </div>
                          <div className="text-[9px] text-slate-500 leading-tight">
                            {(() => {
                              const rule = badgeRules.find(r => r._id === "Trader of the Week");
                              if (!rule || !rule.nextEvaluationTime) return "";
                              const diff = new Date(rule.nextEvaluationTime).getTime() - Date.now();
                              if (diff <= 0) return "Evaluation in progress";
                              const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                              const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                              return `${days}d ${hours}h remaining`;
                            })()}
                          </div>
                        </div>

                        {/* Monthly Evaluation */}
                        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-2.5 flex flex-col gap-1">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-slate-355">MONTHLY BADGE</span>
                            <span className="text-[9px] text-violet-400 font-mono font-bold">
                              {(() => {
                                const rule = badgeRules.find(r => r._id === "Top Rank Monthly");
                                if (!rule || !rule.nextEvaluationTime) return "N/A";
                                return new Date(rule.nextEvaluationTime).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                });
                              })()}
                            </span>
                          </div>
                          <div className="text-[9px] text-slate-500 leading-tight">
                            {(() => {
                              const rule = badgeRules.find(r => r._id === "Top Rank Monthly");
                              if (!rule || !rule.nextEvaluationTime) return "";
                              const diff = new Date(rule.nextEvaluationTime).getTime() - Date.now();
                              if (diff <= 0) return "Evaluation in progress";
                              const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                              const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                              return `${days}d ${hours}h remaining`;
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Mobile Accordion List (Visible on mobile only) */}
                <div className="block md:hidden space-y-3">
                  {[
                    {
                      icon: <TopRankBadge className="w-10 h-10" />,
                      title: "Top Rank Monthly",
                      subtitle: "BEST BADGE",
                      desc: "Awarded to the top ranked trader each month.",
                    },
                    {
                      icon: <ConsistentTraderBadge className="w-10 h-10" />,
                      title: "Consistent Trader",
                      desc: "Awarded for consistent performance throughout the challenge.",
                    },
                    {
                      icon: <MostActiveTraderBadge className="w-10 h-10" />,
                      title: "Most Active Trader",
                      desc: "Awarded for highest active volume (settled + unsettled).",
                    },
                    {
                      icon: <TraderOfWeekBadge className="w-10 h-10" />,
                      title: "Trader of the Week",
                      desc: "Recognizing outstanding trading performance of the week.",
                    },
                    {
                      icon: <BestRiskManagerBadge className="w-10 h-10" />,
                      title: "Best Risk Manager",
                      desc: "Awarded for excellent risk management and discipline.",
                    },
                  ].map((badge, idx) => {
                    const isOpen = openAccordion === badge.title;
                    const matchedRule = badgeRules.find((r) => r._id === badge.title);
                    
                    const formatConditions = (rule: any) => {
                      if (rule.conditions && Array.isArray(rule.conditions) && rule.conditions.length > 0) {
                        return rule.conditions.map((cond: any) => {
                          const opSign = cond.operator === "gte" ? "≥" : cond.operator === "lte" ? "≤" : cond.operator === "gt" ? ">" : cond.operator === "lt" ? "<" : "=";
                          let metricDisplay = cond.metric;
                          if (cond.metric === "profit") metricDisplay = "Profit Return";
                          else if (cond.metric === "volume") metricDisplay = "Volume (Lots)";
                          else if (cond.metric === "settledRebates") metricDisplay = "Settled Rebates";
                          else if (cond.metric === "totalBalance") metricDisplay = "Account Balance";
                          else if (cond.metric === "totalEquity") metricDisplay = "Account Equity";
                          return `${metricDisplay} ${opSign} ${cond.value}`;
                        }).join(" AND ");
                      }
                      
                      const opSign = rule.operator === "gte" ? "≥" : rule.operator === "lte" ? "≤" : rule.operator === "gt" ? ">" : rule.operator === "lt" ? "<" : "=";
                      let metricDisplay = rule.metric;
                      if (rule.metric === "profit") metricDisplay = "Profit Return";
                      else if (rule.metric === "volume") metricDisplay = "Volume (Lots)";
                      else if (rule.metric === "settledRebates") metricDisplay = "Settled Rebates";
                      else if (rule.metric === "totalBalance") metricDisplay = "Account Balance";
                      else if (rule.metric === "totalEquity") metricDisplay = "Account Equity";
                      
                      return `${metricDisplay} ${opSign} ${rule.value}`;
                    };

                    const conditionText = matchedRule
                      ? `Requires: ${formatConditions(matchedRule)} (${matchedRule.points} Points)`
                      : (BADGE_DETAILS[badge.title]?.condition || "");

                    return (
                      <div 
                        key={idx}
                        className="rounded-2xl border border-slate-800 bg-[#101423] overflow-hidden transition-all duration-300"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenAccordion(isOpen ? null : badge.title)}
                          className="w-full flex items-center justify-between p-4 text-left cursor-pointer hover:bg-slate-900/40 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="shrink-0 w-12 h-12 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center">
                              {badge.icon}
                            </div>
                            <div>
                              <span className="font-bold text-white text-sm block">{badge.title}</span>
                              {badge.subtitle && (
                                <span className="text-[8px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-black tracking-widest uppercase mt-0.5 inline-block">
                                  {badge.subtitle}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className={`p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-violet-400" : ""}`}>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </button>
                        
                        {/* Accordion Content */}
                        {isOpen && (
                          <div className="px-4 pb-4 pt-1 border-t border-slate-900/40 bg-slate-950/20 space-y-3 animate-in fade-in duration-200">
                            <p className="text-xs text-slate-400 leading-relaxed">
                              {matchedRule?.description || badge.desc}
                            </p>
                            <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-900 text-left space-y-1.5">
                              <div className="text-[9px] text-slate-500 uppercase tracking-wider font-black">
                                Award Criteria & Conditions
                              </div>
                              <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                                {conditionText}
                              </p>
                              {matchedRule?.nextEvaluationTime && (
                                <div className="text-[10px] text-violet-400 font-mono mt-1 pt-1.5 border-t border-slate-900/60">
                                  Next evaluation: {new Date(matchedRule.nextEvaluationTime).toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Next Evaluation Schedules inside Mobile Accordion */}
                  <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4 space-y-3 text-left">
                    <div className="flex items-center gap-2 text-violet-400">
                      <Clock className="w-4 h-4 animate-pulse" />
                      <span className="font-bold text-xs uppercase tracking-wider">Next Evaluation Schedules</span>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-[#101423] border border-slate-800 rounded-xl p-2.5 flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-350">WEEKLY BADGE</span>
                        <span className="text-violet-400 font-mono font-bold">
                          {(() => {
                            const rule = badgeRules.find(r => r._id === "Trader of the Week");
                            if (!rule || !rule.nextEvaluationTime) return "N/A";
                            return new Date(rule.nextEvaluationTime).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            });
                          })()}
                        </span>
                      </div>
                      <div className="bg-[#101423] border border-slate-800 rounded-xl p-2.5 flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-355">MONTHLY BADGE</span>
                        <span className="text-violet-400 font-mono font-bold">
                          {(() => {
                            const rule = badgeRules.find(r => r._id === "Top Rank Monthly");
                            if (!rule || !rule.nextEvaluationTime) return "N/A";
                            return new Date(rule.nextEvaluationTime).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            });
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Evaluation Schedules Info Bar */}
                <div className="hidden md:flex mt-8 pt-6 border-t border-slate-900/60 flex-col md:flex-row justify-between items-center gap-4 text-xs">
                  <div className="flex items-center gap-2 text-slate-400 text-left">
                    <Clock className="w-4 h-4 text-violet-400 shrink-0" />
                    <span>Traders earn badges based on automated rule evaluations. Track your metrics to qualify.</span>
                  </div>
                  <div className="flex gap-4 flex-wrap">
                    <div className="bg-slate-900/40 border border-slate-800/80 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse" />
                      <span className="text-slate-400 font-medium">Next Weekly:</span>
                      <strong className="text-white font-mono">
                        {(() => {
                          const rule = badgeRules.find(r => r._id === "Trader of the Week");
                          if (!rule || !rule.nextEvaluationTime) return "N/A";
                          return new Date(rule.nextEvaluationTime).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit"
                          });
                        })()}
                      </strong>
                    </div>
                    <div className="bg-slate-900/40 border border-slate-800/80 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                      <span className="text-slate-400 font-medium">Next Monthly:</span>
                      <strong className="text-white font-mono">
                        {(() => {
                          const rule = badgeRules.find(r => r._id === "Top Rank Monthly");
                          if (!rule || !rule.nextEvaluationTime) return "N/A";
                          return new Date(rule.nextEvaluationTime).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric"
                          });
                        })()}
                      </strong>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
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

          {/* Table */}
          {topTraders.length === 0 ? (
            <div className="py-16 text-center text-slate-500 font-medium bg-slate-900/10 border border-slate-900/40 rounded-3xl backdrop-blur-sm">
              <Trophy className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-base text-slate-400">No active traders ranked this month yet.</p>
              <p className="text-xs text-slate-600 mt-1">Be the first to join the challenge and claim the top rank!</p>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800/85">
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
                    {topTraders.map((trader) => (
                      <tr
                        key={trader.id}
                        className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
                        onClick={() => setSelectedTrader(trader)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800/50 border border-slate-700 font-display font-bold text-sm">
                            {trader.rank === 1 ? (
                              <Trophy className="w-4 h-4 text-amber-400" />
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
                                      e.stopPropagation(); // prevent opening details modal
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
                <h4 className="text-lg font-bold text-white font-display">Rs.10,000</h4>
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
              Follow our simple five-step process to verify your account, fill details, view rules, and get educated.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-3 md:gap-5 mb-16 flex-wrap">
            {[
              { num: 1, label: "Verify Account", sub: "Enter Client ID" },
              { num: 2, label: "Submit Form", sub: "Google Form Details" },
              { num: 3, label: "Complete Verification", sub: "Verification Success" },
              { num: 4, label: "Challenge Rules", sub: "Rules & Conditions" },
              { num: 5, label: "Forex Bootcamp", sub: "Educational Videos" },
            ].map((step, i) => {
              const isActive = currentStep === step.num;
              const isCompleted = currentStep > step.num;
              return (
                <div key={step.num} className="flex items-center gap-3 md:gap-5">
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
                    <div className={`text-xs md:text-sm font-semibold transition-colors ${
                      isActive ? "text-violet-400 font-bold" : isCompleted ? "text-emerald-400" : "text-slate-500"
                    }`}>{step.label}</div>
                    <div className="text-[10px] text-slate-500 hidden sm:block">{step.sub}</div>
                  </div>
                  {i < 4 && (
                    <div className={`w-6 md:w-10 h-px mb-6 transition-colors duration-300 ${
                      currentStep > step.num ? "bg-emerald-500" : "bg-slate-800"
                    } hidden md:block`}></div>
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

                      {/* Referral Verification Checkbox */}
                      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-3">
                        <label className="flex items-start gap-3 cursor-pointer group text-xs text-slate-355">
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
                      {errorMsg && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-4 py-3 rounded-xl leading-relaxed">
                          {errorMsg}
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
                  onLoad={handleIframeLoad}
                >
                  Loading…
                </iframe>
              </div>

              <div className="flex justify-between items-center w-full mt-8 pt-6 border-t border-slate-900 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIframeLoads(0);
                    setCurrentStep(1);
                  }}
                  className="px-6 py-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition-colors border border-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium bg-slate-900/60 border border-slate-850 px-4 py-2.5 rounded-xl">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse" />
                  Waiting for form submission...
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Complete Verification Page */}
          {currentStep === 3 && (
            <div className="glass-panel rounded-3xl p-8 md:p-10 mb-10 border border-slate-800 text-center space-y-6 bg-slate-950/40">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl md:text-2xl font-display font-extrabold uppercase tracking-wide text-white">
                  Welcome, {verifiedClient?.name || "Trader"}!
                </h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                  Your Alpari account balance of <strong className="text-emerald-400 font-mono text-base">${verifiedClient?.balance ?? "100"}</strong> has been successfully verified.
                </p>
                <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">
                  You have successfully unlocked access to the trading challenge and our Forex educational series.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 border-t border-slate-900/60 w-full max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    setIframeLoads(0);
                    setCurrentStep(2);
                  }}
                  className="px-6 py-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition-colors border border-slate-800 flex items-center justify-center gap-2 cursor-pointer text-slate-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Form
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Continue to Challenge Rules
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Rules & Rewards Dashboard */}
          {currentStep === 4 && (
            <div className="space-y-12 mb-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Rules Section */}
              <section className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-white">
                    Challenge Rules
                  </h3>
                  <p className="text-slate-400 text-sm mt-2">
                    Please read and understand the rules before you start.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {challengeRules.map((rule) => (
                    <div
                      key={rule.num}
                      className="glass-panel rounded-2xl p-5 border border-slate-800 relative group hover:border-slate-700 transition-colors"
                    >
                      <div className="absolute top-4 left-4 w-6 h-6 rounded-md bg-violet-600/20 border border-violet-500/30 text-violet-400 flex items-center justify-center text-[10px] font-black font-display">
                        {rule.num}
                      </div>

                      <div className="flex flex-col items-center text-center pt-6 space-y-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${rule.color}`}>
                          {rule.icon}
                        </div>
                        <h4 className="font-semibold text-white text-sm">{rule.title}</h4>
                        <div className="font-display font-bold text-brand-400 text-lg">{rule.value}</div>
                        <p className="text-xs text-slate-400 leading-relaxed">{rule.desc}</p>
                      </div>
                    </div>
                  ))}

                  {/* Important Note Card */}
                  <div className="glass-panel rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5 relative">
                    <div className="flex flex-col items-center text-center pt-2 space-y-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center border text-amber-400 bg-amber-500/10 border-amber-500/30">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <h4 className="font-semibold text-amber-400 text-sm">Important Note</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Violation of any rule may lead to disqualification. We promote fair trading and a level playing field for all participants.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Rewards & Prizes Section */}
              <section className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-white">
                    Rewards & Prizes
                  </h3>
                  <p className="text-slate-400 text-sm mt-2">
                    Compete, earn badges, and win exciting rewards.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  {/* Final Winner Highlight */}
                  <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-amber-500/20 bg-gradient-to-br from-slate-900/60 to-slate-950/60 text-center flex flex-col justify-between items-center space-y-4">
                    <div className="w-full flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mb-4">
                        <Trophy className="w-10 h-10 text-amber-400" />
                      </div>
                      <h4 className="text-xl font-display font-bold text-white uppercase">FINAL WINNER</h4>
                      <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed mt-2">
                        The trader with the most Top Rank Monthly badges will be crowned the Ultimate FX Champion!
                      </p>
                    </div>
                    <div className="w-full border-t border-slate-800/60 pt-4 mt-2">
                      <div className="text-[10px] text-amber-500 uppercase tracking-widest font-black mb-3">
                        Exclusive Rewards
                      </div>
                      <div className="flex justify-center gap-4 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1"><Award className="w-4.5 h-4.5 text-amber-400" /> Physical Badge</span>
                        <span className="flex items-center gap-1"><Gift className="w-4.5 h-4.5 text-amber-400" /> Premium Gifts</span>
                      </div>
                    </div>
                  </div>

                  {/* Achievements & Badges Grid */}
                  <div className="lg:col-span-8 bg-slate-950/40 border border-slate-900 rounded-3xl p-6 flex flex-col justify-between">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        {
                          icon: <TopRankBadge className="w-9 h-9" />,
                          title: "Top Rank Monthly",
                          subtitle: "BEST BADGE",
                          desc: "Awarded to the top ranked trader each month.",
                        },
                        {
                          icon: <WeeklyTopBadge className="w-9 h-9" />,
                          title: "Weekly Top",
                          desc: "Awarded to the top performer of the week.",
                        },
                        {
                          icon: <ConsistentTraderBadge className="w-9 h-9" />,
                          title: "Consistent Trader",
                          desc: "Awarded for consistent performance throughout the challenge.",
                        },
                        {
                          icon: <MostActiveTraderBadge className="w-9 h-9" />,
                          title: "Most Active Trader",
                          desc: "Awarded for highest active volume (settled + unsettled).",
                        },
                        {
                          icon: <TraderOfWeekBadge className="w-9 h-9" />,
                          title: "Trader of the Week",
                          desc: "Recognizing outstanding trading performance of the week.",
                        },
                        {
                          icon: <BestRiskManagerBadge className="w-9 h-9" />,
                          title: "Best Risk Manager",
                          desc: "Awarded for excellent risk management and discipline.",
                        },
                      ].map((badge, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleBadgeClick(badge.title)}
                          className="w-full text-left glass-panel rounded-xl p-4 border border-slate-900 flex gap-3 items-start hover:border-violet-500/50 hover:bg-slate-900/40 transition-all duration-200 cursor-pointer group"
                        >
                          <div className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                            {badge.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white text-xs text-left group-hover:text-violet-400 transition-colors">{badge.title}</h4>
                            {badge.subtitle && (
                              <span className="text-[7px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider inline-block mt-0.5 mb-1">
                                {badge.subtitle}
                              </span>
                            )}
                            <p className="text-[10px] text-slate-450 text-left leading-relaxed mt-0.5">{badge.desc}</p>
                            <span className="text-[9px] text-brand-450 font-bold mt-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              View Rules →
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex justify-between items-center w-full mt-8 pt-6 border-t border-slate-900 gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition-colors border border-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-600/10 flex items-center gap-2 cursor-pointer"
                >
                  Continue to Forex Bootcamp
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Forex Bootcamp Video Playlist Player */}
          {currentStep === 5 && (
            <div className="glass-panel rounded-3xl p-6 md:p-8 mb-10 border border-slate-800 bg-slate-950/40 relative overflow-hidden flex flex-col items-center">
              <div className="text-center mb-6 space-y-2">
                <h3 className="text-xl font-display font-black text-white uppercase tracking-wider">
                  Step 5: Educational Forex Playlist
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Watch our curated educational Bootcamp. Select any video from the list below to learn trading basics.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full mt-2">
                {/* Embedded Player */}
                <div className="lg:col-span-7 flex flex-col gap-3">
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl">
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&rel=0`}
                      className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Forex Bootcamp Video Player"
                    ></iframe>
                  </div>
                  <div className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl w-full">
                    <h4 className="text-sm font-semibold text-white font-display text-left">
                      Now Playing: {
                        [
                          { id: "lmtgjAD18nE", title: "Forex-ൽ ഏതു സമയത്ത് Trade ചെയ്യണം ?" },
                          { id: "yTJWlNjsW_M", title: "Forex Trading Basics: Pip എന്താണ്? & Pip Calculation" },
                          { id: "XhpFBVHNULI", title: "Choosing a Forex Broker ." },
                          { id: "JQcjFIVgKAE", title: "മൊബൈൽ ഉപയോഗിച്ച് Forex Trading ചെയ്യാം 📈💰┃simple ആണ്" },
                          { id: "eEgQmAxBozQ", title: "Forex ഇന്ത്യയിൽ Legal ആണോ? Legal ആയി എങ്ങനെ Trade ചെയ്യാം?" },
                          { id: "v4UpfDusRf8", title: "Forex Market Basics , Currency Pairs & Pips Explained in Malayalam" },
                          { id: "5rmY0LRszk8", title: "Forex Market Part 2 — Account opening Explained in Malayalam" },
                          { id: "vi1Z1_ic1Gc", title: "Forex Market Part 1 — Introduction Explained in Malayalam" }
                        ].find(v => v.id === selectedVideoId)?.title
                      }
                    </h4>
                  </div>
                </div>

                {/* Selection Column */}
                <div className="lg:col-span-5 flex flex-col h-[320px] lg:h-[400px] w-full">
                  <div className="text-xs font-bold text-slate-450 mb-2 uppercase tracking-wider px-1 text-left">
                    Playlist Videos ({
                      [
                        { id: "lmtgjAD18nE", title: "Forex-ൽ ഏതു സമയത്ത് Trade ചെയ്യണം ?" },
                        { id: "yTJWlNjsW_M", title: "Forex Trading Basics: Pip എന്താണ്? & Pip Calculation" },
                        { id: "XhpFBVHNULI", title: "Choosing a Forex Broker ." },
                        { id: "JQcjFIVgKAE", title: "മൊബൈൽ ഉപയോഗിച്ച് Forex Trading ചെയ്യാം 📈💰┃simple ആണ്" },
                        { id: "eEgQmAxBozQ", title: "Forex ഇന്ത്യയിൽ Legal ആണോ? Legal ആയി എങ്ങനെ Trade ചെയ്യാം?" },
                        { id: "v4UpfDusRf8", title: "Forex Market Basics , Currency Pairs & Pips Explained in Malayalam" },
                        { id: "5rmY0LRszk8", title: "Forex Market Part 2 — Account opening Explained in Malayalam" },
                        { id: "vi1Z1_ic1Gc", title: "Forex Market Part 1 — Introduction Explained in Malayalam" }
                      ].length
                    })
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {[
                      { id: "lmtgjAD18nE", title: "Forex-ൽ ഏതു സമയത്ത് Trade ചെയ്യണം ?" },
                      { id: "yTJWlNjsW_M", title: "Forex Trading Basics: Pip എന്താണ്? & Pip Calculation" },
                      { id: "XhpFBVHNULI", title: "Choosing a Forex Broker ." },
                      { id: "JQcjFIVgKAE", title: "മൊബൈൽ ഉപയോഗിച്ച് Forex Trading ചെയ്യാം 📈💰┃simple ആണ്" },
                      { id: "eEgQmAxBozQ", title: "Forex ഇന്ത്യയിൽ Legal ആണോ? Legal ആയി എങ്ങനെ Trade ചെയ്യാം?" },
                      { id: "v4UpfDusRf8", title: "Forex Market Basics , Currency Pairs & Pips Explained in Malayalam" },
                      { id: "5rmY0LRszk8", title: "Forex Market Part 2 — Account opening Explained in Malayalam" },
                      { id: "vi1Z1_ic1Gc", title: "Forex Market Part 1 — Introduction Explained in Malayalam" }
                    ].map((video, index) => {
                      const isActive = video.id === selectedVideoId;
                      return (
                        <button
                          key={video.id}
                          onClick={() => setSelectedVideoId(video.id)}
                          className={`w-full flex gap-3 p-2.5 rounded-xl border text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
                            isActive
                              ? "bg-violet-600/10 border-violet-500/50 shadow-md shadow-violet-500/5"
                              : "bg-slate-900/30 border-slate-850 hover:border-slate-800 hover:bg-slate-900/50"
                          }`}
                        >
                          {/* Thumbnail */}
                          <div className="relative w-20 aspect-video rounded-lg overflow-hidden border border-slate-800 shrink-0 bg-slate-950">
                            <img
                              src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20">
                              <Play className={`w-4 h-4 ${isActive ? "text-violet-400 fill-current" : "text-white"}`} />
                            </div>
                          </div>

                          {/* Title */}
                          <div className="flex flex-col justify-center min-w-0">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Video {index + 1}</span>
                            <p className="text-xs font-semibold text-slate-200 leading-snug mt-0.5 line-clamp-2" title={video.title}>
                              {video.title}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center w-full mt-8 pt-6 border-t border-slate-900 gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition-colors border border-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <Link
                  href="/leaderboard"
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2"
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

      {/* Rewards & Prizes Section moved above */}

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
                desc: "Generate high profit percentages to climb the rankings.",
              },
              {
                step: "06",
                icon: <Award className="w-5 h-5" />,
                color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
                title: "Win Rewards",
                desc: "Qualify for monthly cash rewards and prestige.",
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
                    href="https://www.youtube.com/playlist?list=PLVJieetYrKAw"
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
                  href="https://www.youtube.com/playlist?list=PLVJieetYrKAw"
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

      {/* Welcome & Balance Verification Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
            onClick={() => setShowWelcomeModal(false)}
          />

          {/* Modal Container */}
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowWelcomeModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-850 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors z-20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Body */}
            <div className="p-6 md:p-8 space-y-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-extrabold text-white uppercase tracking-wide">
                  Welcome, {verifiedClient?.name || "Trader"}!
                </h3>
                <p className="text-sm text-slate-300">
                  Your Alpari account balance of <strong className="text-emerald-400 font-mono">${verifiedClient?.balance ?? "100"}</strong> has been successfully verified.
                </p>
                <p className="text-xs text-slate-450 leading-relaxed pt-1">
                  You have successfully unlocked access to the trading challenge and our Forex educational series.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowWelcomeModal(false)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-violet-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  Perfect, Let&apos;s Start!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trader Profile Modal */}
      {selectedTrader && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setSelectedTrader(null)}
          ></div>
          <div className="relative w-full max-w-md glass-panel rounded-3xl overflow-hidden shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <button
              onClick={() => setSelectedTrader(null)}
              className="absolute top-6 right-6 z-50 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white/70 hover:text-white transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="overflow-y-auto flex-1 w-full rounded-b-3xl">
              <div className="h-32 bg-gradient-to-br from-violet-900 to-slate-900">
              </div>

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
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-accent-400 to-accent-650 flex items-center justify-center text-white font-display font-bold text-xl shadow-lg shadow-accent-500/30">
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
                  <p className="text-violet-400 text-sm mb-3">
                    {selectedTrader.title ?? "Trader"}
                  </p>

                  {selectedTrader.earnedBadges && selectedTrader.earnedBadges.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {selectedTrader.earnedBadges.map((badgeName, idx) => {
                        const badge = BADGE_DETAILS[badgeName];
                        if (!badge) return null;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBadgeClick(badgeName);
                            }}
                            title={`Click to view rules for ${badgeName}`}
                            className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-850 hover:border-violet-500/50 transition-all cursor-pointer group"
                          >
                            <span className="w-4 h-4 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">{badge.icon}</span>
                            <span className="font-medium group-hover:text-white transition-colors">{badgeName}</span>
                          </button>
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
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setSelectedBadge(null)}
          />

          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-850 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
              <div className="relative aspect-[4/5] w-full max-w-[340px] mx-auto rounded-2xl border border-slate-800/85 bg-slate-950/60 overflow-hidden flex items-center justify-center">
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
              <div className="flex flex-col gap-3">
                {/* Copy Link Button */}
                <button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/leaderboard`;
                    navigator.clipboard.writeText(shareUrl);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2050);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-850 hover:bg-slate-850/80 text-white font-semibold text-xs transition-colors border border-slate-800 cursor-pointer"
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
