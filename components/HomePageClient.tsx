"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
  BestRiskManagerBadge,
  renderBadgeIcon
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
    icon: <span className="text-sm font-extrabold font-mono">₹</span>,
    color: "text-violet-400 border-violet-500/30 bg-violet-500/10",
    title: "Minimum Deposit",
    value: "₹10,000",
    desc: "Minimum deposit equivalent to start the challenge.",
  },
  {
    num: 2,
    icon: <Target className="w-5 h-5" />,
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    title: "Starting Balance",
    value: "₹10,000",
    desc: "Every participant account starts scaled from a ₹10,000 base.",
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



const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = React.useState("");

  React.useEffect(() => {
    if (!targetDate) return;
    
    const updateTime = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("0d 0h 0m 0s");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return <span>{timeLeft || "0d 0h 0m 0s"}</span>;
};

const translateConditionToHuman = (rule: any) => {
  if (!rule) return "No criteria defined.";
  const conds = rule.conditions || [];
  
  const getSingleConditionString = (cond: any) => {
    let metricLabel = cond.metric;
    if (cond.metric === "profit") metricLabel = "Profit ROI";
    else if (cond.metric === "volume") metricLabel = "Volume";
    else if (cond.metric === "settledRebates") metricLabel = "Settled Rebates";
    else if (cond.metric === "unsettledRebates") metricLabel = "Unsettled Rebates";
    else if (cond.metric === "totalBalance") metricLabel = "Current Balance";
    else if (cond.metric === "points") metricLabel = "Total Points";
    else if (cond.metric === "avgPoints") metricLabel = "Average Points (6-Month)";
    else if (cond.metric === "avgVolume") metricLabel = "Average Volume (6-Month)";
    else if (cond.metric === "avgProfit") metricLabel = "Average Profit ROI (6-Month)";

    let opWord = "equal to";
    if (cond.operator === "gte") opWord = "at least";
    else if (cond.operator === "lte") opWord = "at most";
    else if (cond.operator === "gt") opWord = "greater than";
    else if (cond.operator === "lt") opWord = "less than";
    else if (cond.operator === "eq") opWord = "exactly";

    let valSuffix = "";
    if (cond.metric === "profit" || cond.metric === "avgProfit") valSuffix = "%";
    else if (cond.metric === "volume" || cond.metric === "avgVolume") valSuffix = " Lots";
    else if (cond.metric === "settledRebates" || cond.metric === "unsettledRebates" || cond.metric === "totalBalance") valSuffix = " USD";

    return `${metricLabel} must be ${opWord} ${cond.value}${valSuffix}`;
  };

  if (conds.length === 0) {
    if (rule.metric) {
      return getSingleConditionString(rule);
    }
    return "No criteria defined.";
  }
  return conds.map((cond: any) => getSingleConditionString(cond)).join(" AND ");
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

  // Custom registration form state
  const [regForm, setRegForm] = React.useState({
    fullName: "",
    place: "",
    email: "",
    phone: "",
    occupation: "",
    market: "",
    capital: "",
  });
  const [isSubmittingReg, setIsSubmittingReg] = React.useState(false);
  const [regError, setRegError] = React.useState<string | null>(null);

  const handleRegFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setRegForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setRegError(null);
  };

  const handleRegSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !regForm.fullName.trim() ||
      !regForm.place.trim() ||
      !regForm.email.trim() ||
      !regForm.phone.trim() ||
      !regForm.occupation.trim() ||
      !regForm.market.trim() ||
      !regForm.capital.trim()
    ) {
      setRegError("All fields are required.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regForm.email.trim())) {
      setRegError("Please enter a valid email address.");
      return;
    }

    // Phone validation: exactly 10 digits
    const cleanPhone = regForm.phone.replace(/[^0-9]/g, "");
    let finalPhone = cleanPhone;
    if (cleanPhone.length === 12 && cleanPhone.startsWith("91")) {
      finalPhone = cleanPhone.slice(2);
    }
    if (!/^[6-9]\d{9}$/.test(finalPhone)) {
      setRegError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmittingReg(true);
    setRegError(null);
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: verifiedClient?.id || "",
          clientName: verifiedClient?.name || regForm.fullName,
          ...regForm,
          phone: finalPhone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentStep(3);
      } else {
        setRegError(data.error || "Submission failed. Please try again.");
      }
    } catch {
      setRegError("Network error. Please try again.");
    } finally {
      setIsSubmittingReg(false);
    }
  };

  const [selectedTrader, setSelectedTrader] = React.useState<Trader | null>(null);
  const [selectedBadge, setSelectedBadge] = React.useState<{
    name: string;
    desc: string;
    condition: string;
    color: string;
    icon: React.ReactNode;
    displayRules?: string;
  } | null>(null);

  const [badgeRules, setBadgeRules] = React.useState<any[]>([]);
  const [openAccordion, setOpenAccordion] = React.useState<string | null>(null);
  const [expandedBadge, setExpandedBadge] = React.useState<string | null>(null);
  const [showFinalWinnerRules, setShowFinalWinnerRules] = React.useState(false);

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
    const matchedRule = badgeRules.find((r) => r._id === cleanBadgeName);

    setSelectedBadge({
      name: cleanBadgeName,
      desc: matchedRule?.description || (badge ? badge.desc : "No description available."),
      condition: matchedRule
        ? `Requires: ${translateConditionToHuman(matchedRule)} (${matchedRule.points} Points) - Next evaluation: ${matchedRule.nextEvaluationTime ? new Date(matchedRule.nextEvaluationTime).toLocaleString() : 'N/A'}`
        : (badge ? badge.condition : "No criteria defined."),
      color: badge ? badge.color : "hover:scale-110",
      icon: renderBadgeIcon(matchedRule?.icon || matchedRule?._id || cleanBadgeName, "w-10 h-10"),
      displayRules: matchedRule?.displayRules
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

    const logoImg = new window.Image();
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

            {/* Hero Text — CSS animated, zero JS overhead on mobile */}
            <div
              className="lg:col-span-7 text-left space-y-6"
              style={{ animation: "fadeUpHero 0.7s ease-out both" }}
            >
              <style>{`
                @keyframes fadeUpHero {
                  from { opacity: 0; transform: translateY(30px); }
                  to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeUpHeroDelayed {
                  from { opacity: 0; transform: translateY(20px); }
                  to   { opacity: 1; transform: translateY(0); }
                }
              `}</style>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight leading-[1.1] text-white">
                FOREX TRADING
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300">
                  CHALLENGE
                </span>
              </h1>

              <h3
                className="text-xl md:text-2xl font-semibold text-slate-300 font-display"
                style={{ animation: "fadeUpHeroDelayed 0.8s 0.15s ease-out both" }}
              >
                Compete. Rank. Earn Rewards.
              </h3>

              <p
                className="text-base md:text-lg text-slate-400 max-w-xl leading-relaxed"
                style={{ animation: "fadeUpHeroDelayed 0.8s 0.25s ease-out both" }}
              >
                Join traders worldwide, climb the leaderboard, earn badges, win cash rewards, and prove your trading skills on our verified metrics portal.
              </p>

              <div
                className="flex flex-col sm:flex-row items-center gap-3 pt-4"
                style={{ animation: "fadeUpHeroDelayed 0.8s 0.35s ease-out both" }}
              >
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-[0_0_30px_-5px_rgba(124,58,237,0.5)] transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                >
                  Join the Challenge
                </Link>
                <Link
                  href="/how-it-works"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 hover:border-slate-700"
                >
                  How it Works
                </Link>
                <Link
                  href="/leaderboard"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  View Leaderboard
                  <ArrowRight className="w-4 h-4 text-violet-400" />
                </Link>
              </div>
            </div>

            {/* Hero Image — Next.js Image serves WebP/AVIF, prevents layout shift */}
            <div
              className="lg:col-span-5 relative flex justify-center items-center"
              style={{ animation: "fadeUpHeroDelayed 0.9s 0.1s ease-out both" }}
            >
              <div className="relative group max-w-[380px] w-full aspect-square flex justify-center items-center">
                <Image
                  src="/trading_trophy.jpg"
                  alt="Forex Trading Challenge Trophy"
                  width={380}
                  height={380}
                  priority
                  className="object-contain drop-shadow-[0_15px_50px_rgba(124,58,237,0.25)] group-hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Reward Card */}
                {/* <div className="absolute -bottom-4 right-4 bg-slate-900/90 border border-violet-500/30 rounded-2xl p-4 shadow-2xl flex items-center gap-3 animate-bounce [animation-duration:4s]">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Trophy className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Monthly Rewards</div>
                    <div className="text-lg font-bold font-display text-white">Rs 10,000+</div>
                  </div>
                </div> */}

                {/* Floating Active Traders Card */}
                {/* <div className="absolute -top-4 -left-4 bg-slate-900/90 border border-blue-500/30 rounded-2xl p-4 shadow-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Active Now</div>
                    <div className="text-lg font-bold font-display text-white">2,500+</div>
                  </div>
                </div> */}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Countdown Timers Section */}
      <section className="py-8 bg-slate-950/80 border-b border-slate-900/60 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[150px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Weekly Timer */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative group hover:border-violet-500/30 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform duration-300">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Weekly Trader Challenge</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Trader of the Week evaluation cycle</p>
                </div>
              </div>
              <div className="flex flex-col items-start sm:items-end justify-center">
                <div className="text-lg font-black font-mono text-violet-400 tracking-wider">
                  {(() => {
                    const rule = badgeRules.find(r => r._id === "Trader of the Week");
                    return rule && rule.nextEvaluationTime ? (
                      <CountdownTimer targetDate={rule.nextEvaluationTime} />
                    ) : (
                      "0d 0h 0m 0s"
                    );
                  })()}
                </div>
                <div className="text-[9px] text-slate-500 mt-1 font-medium">
                  Next: {(() => {
                    const rule = badgeRules.find(r => r._id === "Trader of the Week");
                    if (!rule || !rule.nextEvaluationTime) return "N/A";
                    return new Date(rule.nextEvaluationTime).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    });
                  })()}
                </div>
              </div>
            </div>

            {/* Monthly Timer */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative group hover:border-blue-500/30 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform duration-300">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Monthly Standings</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Top Rank Monthly evaluation cycle</p>
                </div>
              </div>
              <div className="flex flex-col items-start sm:items-end justify-center">
                <div className="text-lg font-black font-mono text-blue-400 tracking-wider">
                  {(() => {
                    const rule = badgeRules.find(r => r._id === "Top Rank Monthly");
                    return rule && rule.nextEvaluationTime ? (
                      <CountdownTimer targetDate={rule.nextEvaluationTime} />
                    ) : (
                      "0d 0h 0m 0s"
                    );
                  })()}
                </div>
                <div className="text-[9px] text-slate-500 mt-1 font-medium">
                  Next: {(() => {
                    const rule = badgeRules.find(r => r._id === "Top Rank Monthly");
                    if (!rule || !rule.nextEvaluationTime) return "N/A";
                    return new Date(rule.nextEvaluationTime).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    });
                  })()}
                </div>
              </div>
            </div>

          </div>
        </div>
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

          {/* Row 1: Final Winner (Centered Card - Same Size) */}
          <div className="flex justify-center mb-12 w-full">
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="uiverse-card !w-full max-w-[240px] group transition-all duration-300 relative overflow-hidden"
              style={{ height: "260px" }}
            >
              <div className="uiverse-card-inner !justify-between pb-6">
                {/* Icon */}
                <div className="mt-6 transform transition-transform duration-300 group-hover:scale-110">
                  {(() => {
                    const rule = badgeRules.find(r => r._id === "Final Winner");
                    return renderBadgeIcon(rule?.icon || "trophy", "w-14 h-14 text-amber-400 relative z-10 drop-shadow-[0_10px_30px_rgba(226,165,18,0.3)]");
                  })()}
                </div>

                {/* Title & Prize */}
                <div className="text-center mt-3 w-full px-2">
                  <h4 className="font-extrabold text-white text-sm tracking-wide uppercase group-hover:text-violet-400 transition-colors">
                    {(() => {
                      const rule = badgeRules.find(r => r._id === "Final Winner");
                      return rule?._id || "Final Winner";
                    })()}
                  </h4>
                  {(() => {
                    const rule = badgeRules.find(r => r._id === "Final Winner");
                    if (rule?.cashPrize) {
                      return (
                        <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black inline-flex items-center gap-1 uppercase tracking-wider">
                          <span>🏆</span>
                          <span>{rule.cashPrize} Cash</span>
                        </div>
                      );
                    }
                    return (
                      <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-[10px] font-bold inline-flex items-center gap-1 uppercase tracking-wider">
                        <span>⭐</span>
                        <span>{rule?.points || 500} Pts</span>
                      </div>
                    );
                  })()}
                </div>

                {/* Description */}
                <p className="text-[10px] text-slate-400 text-center leading-normal px-4 mt-3 max-h-[40px] overflow-hidden text-ellipsis line-clamp-2">
                  {(() => {
                    const rule = badgeRules.find(r => r._id === "Final Winner");
                    return rule?.description || "The trader with the most Top Rank Monthly badges will be crowned the Ultimate FX Champion!";
                  })()}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Row 2: Achievements & Badges (5 badges in same row on desktop) */}
          <div className="w-full bg-slate-950/40 border border-slate-900 rounded-3xl p-6 sm:p-8">
            <div className="text-xs text-slate-400 uppercase tracking-widest font-black mb-8 border-b border-slate-900 pb-4 text-center sm:text-left">
              Achievements & Badges
            </div>

            {/* Badges Grid (Fully Responsive - 5 Columns on Desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
              {(() => {
                const normalBadges = badgeRules.length > 0 
                  ? badgeRules.filter((r) => r._id !== "Final Winner") 
                  : Object.keys(BADGE_DETAILS).filter(k => k !== "Final Winner").map(key => ({
                      _id: key,
                      points: BADGE_DETAILS[key].condition.includes("Points") ? 100 : 50,
                      description: BADGE_DETAILS[key].desc,
                      icon: key,
                      cashPrize: ""
                    }));
                return normalBadges.map((rule) => (
                  <div
                    key={rule._id}
                    className="uiverse-card !w-full group transition-all duration-300 relative overflow-hidden mx-auto sm:mx-0"
                    style={{ height: "260px" }}
                  >
                    <div className="uiverse-card-inner !justify-between pb-6">
                      {/* Icon */}
                      <div className="mt-6 transform transition-transform duration-300 group-hover:scale-110">
                        {renderBadgeIcon(rule.icon || rule._id, "w-14 h-14")}
                      </div>

                      {/* Title & Prize */}
                      <div className="text-center mt-3 w-full px-2">
                        <h4 className="font-extrabold text-white text-sm tracking-wide uppercase group-hover:text-violet-400 transition-colors">
                          {rule._id}
                        </h4>
                        {rule.cashPrize ? (
                          <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black inline-flex items-center gap-1 uppercase tracking-wider">
                            <span>🏆</span>
                            <span>{rule.cashPrize} Cash</span>
                          </div>
                        ) : (
                          <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-bold inline-flex items-center gap-1 uppercase tracking-wider">
                            <span>⭐</span>
                            <span>{rule.points} Pts</span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-[10px] text-slate-400 text-center leading-normal px-4 mt-3 max-h-[40px] overflow-hidden text-ellipsis line-clamp-2">
                        {rule.description || (BADGE_DETAILS[rule._id]?.desc || "")}
                      </p>
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Detailed Accordion for Awards & Criteria */}
            <div className="space-y-4 max-w-4xl mx-auto text-left border-t border-slate-900/60 pt-10">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-6 text-center">
                Detailed Award Criteria & Rules
              </h3>
              {(() => {
                const allRules = [];
                const finalWinnerRule = badgeRules.find(r => r._id === "Final Winner") || {
                  _id: "Final Winner",
                  points: 500,
                  description: "The trader with the most Top Rank Monthly badges will be crowned the Ultimate FX Champion!",
                  icon: "trophy",
                  cashPrize: ""
                };
                allRules.push(finalWinnerRule);

                const normalBadges = badgeRules.length > 0
                  ? badgeRules.filter((r) => r._id !== "Final Winner")
                  : Object.keys(BADGE_DETAILS).filter(k => k !== "Final Winner").map(key => ({
                      _id: key,
                      points: BADGE_DETAILS[key].condition.includes("Points") ? 100 : 50,
                      description: BADGE_DETAILS[key].desc,
                      icon: key,
                      cashPrize: ""
                    }));
                allRules.push(...normalBadges);

                return allRules.map((rule) => {
                  const isOpen = openAccordion === rule._id;
                  const isFinalWinner = rule._id === "Final Winner";
                  return (
                    <div
                      key={rule._id}
                      className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                        isOpen 
                          ? isFinalWinner 
                            ? "border-amber-500/30 bg-amber-500/[0.02]" 
                            : "border-violet-500/30 bg-violet-500/[0.02]" 
                          : "border-slate-900 bg-slate-950/60 hover:border-slate-800"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenAccordion(isOpen ? null : rule._id)}
                        className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-slate-900/20 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center ${
                            isFinalWinner 
                              ? "bg-amber-500/5 border-amber-500/20" 
                              : "bg-slate-900 border-slate-800"
                          }`}>
                            {renderBadgeIcon(rule.icon || rule._id, `w-7 h-7 ${isFinalWinner ? "text-amber-400" : ""}`)}
                          </div>
                          <div>
                            <span className="font-bold text-white text-sm block">{rule._id}</span>
                            {rule.cashPrize ? (
                              <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-black tracking-widest uppercase mt-1 inline-block">
                                🏆 {rule.cashPrize} Cash Prize
                              </span>
                            ) : (
                              <span className="text-[9px] bg-violet-500/10 border border-violet-500/20 text-violet-400 px-2 py-0.5 rounded font-bold tracking-widest uppercase mt-1 inline-block">
                                ⭐ {rule.points} Challenge Points
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={`p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 transition-transform duration-300 ${
                          isOpen 
                            ? isFinalWinner 
                              ? "rotate-180 text-amber-400 border-amber-500/30" 
                              : "rotate-180 text-violet-400 border-violet-500/30" 
                            : ""
                        }`}>
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-2 border-t border-slate-900 bg-slate-950/40 space-y-4 animate-in fade-in duration-200">
                          <div className="space-y-1">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">
                              Description
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                              {rule.description || (BADGE_DETAILS[rule._id]?.desc || "")}
                            </p>
                          </div>
                          <div className={`rounded-xl p-4 border text-left space-y-1.5 ${
                            isFinalWinner 
                              ? "bg-amber-500/[0.02] border-amber-500/10" 
                              : "bg-slate-900/45 border-slate-900"
                          }`}>
                            <div className={`text-[10px] uppercase tracking-wider font-extrabold ${
                              isFinalWinner ? "text-amber-400" : "text-violet-400"
                            }`}>
                              Requirements to Qualify
                            </div>
                            {rule.displayRules && typeof rule.displayRules === 'string' && rule.displayRules.trim() !== '' ? (
                              <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-200 font-semibold leading-relaxed">
                                {rule.displayRules.split('\n').map((b: string) => b.trim()).filter((b: string) => b !== '').map((bullet: string, idx: number) => (
                                  <li key={idx}>{bullet}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                                {translateConditionToHuman(rule) || rule.description}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
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
                              <div className="text-[10px] text-slate-500 font-medium flex items-center gap-2">
                                <span>{trader.country || "India"}</span>
                                {/* Volume Warning Tag */}
                                {(trader.volume ?? 0) < ((trader.mtNetDeposits ?? 0) / 100) * 0.6 ? (
                                  <span className="text-[9px] font-bold text-amber-500/90 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20" title={`Needs at least ${(((trader.mtNetDeposits ?? 0) / 100) * 0.6).toFixed(2)} Lots. Currently has ${(trader.volume ?? 0).toFixed(2)} Lots.`}>
                                    Under Volume
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-bold text-emerald-500/90 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                    Qualified
                                  </span>
                                )}
                              </div>
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
              { num: 2, label: "Submit Form", sub: "Registration Details" },
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

          {/* STEP 2: Custom Registration Form */}
          {currentStep === 2 && (
            <div className="glass-panel rounded-3xl p-6 md:p-8 mb-10 border border-slate-800 bg-slate-950/40 relative overflow-hidden animate-in fade-in duration-300">
              <div className="text-center mb-8 space-y-2">
                <h3 className="text-xl font-display font-black text-white uppercase tracking-wider">
                  Step 2: Complete Your Registration
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Fill in your details below. Your verified Client ID has been pre-linked.
                </p>
              </div>

              {/* Verified badge banner */}
              <div className="flex items-center gap-3 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl px-5 py-3 mb-6 w-full max-w-2xl mx-auto">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-left">
                  <span className="text-emerald-400 text-sm font-semibold block">Account Verified</span>
                  <span className="text-slate-400 text-xs">
                    {verifiedClient?.name} — Balance:{" "}
                    <strong className="text-white">${verifiedClient?.balance ?? "100"}</strong>
                  </span>
                </div>
              </div>

              <form onSubmit={handleRegSubmit} className="space-y-5 w-full max-w-2xl mx-auto text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={regForm.fullName}
                      onChange={handleRegFormChange}
                      required
                      placeholder="Your full name"
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Place <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="place"
                      value={regForm.place}
                      onChange={handleRegFormChange}
                      required
                      placeholder="City, State / Country"
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={regForm.email}
                      onChange={handleRegFormChange}
                      required
                      placeholder="your@email.com"
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Mobile Number (10 digits) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={regForm.phone}
                      onChange={handleRegFormChange}
                      required
                      placeholder="e.g. 9876543210"
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Occupation <span className="text-rose-400">*</span>
                    </label>
                    <select
                      name="occupation"
                      value={regForm.occupation}
                      onChange={handleRegFormChange}
                      required
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                    >
                      <option value="">Select occupation</option>
                      <option value="Student">Student</option>
                      <option value="Salaried Professional">Salaried Professional</option>
                      <option value="Self-Employed / Business Owner">Self-Employed / Business Owner</option>
                      <option value="Full-Time Trader">Full-Time Trader</option>
                      <option value="Unemployed / Looking for Work">Unemployed / Looking for Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Which Market You Trade <span className="text-rose-400">*</span>
                    </label>
                    <select
                      name="market"
                      value={regForm.market}
                      onChange={handleRegFormChange}
                      required
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                    >
                      <option value="">Select market</option>
                      <option value="Forex Market">Forex Market</option>
                      <option value="Indian Stock Market (NSE/BSE)">Indian Stock Market (NSE/BSE)</option>
                      <option value="Cryptocurrency">Cryptocurrency</option>
                      <option value="US Stock Market">US Stock Market</option>
                      <option value="Commodities & F&O">Commodities & F&O</option>
                      <option value="Multiple / Other">Multiple / Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Trading Capital <span className="text-rose-400">*</span>
                    </label>
                    <select
                      name="capital"
                      value={regForm.capital}
                      onChange={handleRegFormChange}
                      required
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                    >
                      <option value="">Select trading capital</option>
                      <option value="Below $100">Below $100</option>
                      <option value="$100 - $500">$100 - $500</option>
                      <option value="$500 - $2,000">$500 - $2,000</option>
                      <option value="$2,000 - $10,000">$2,000 - $10,000</option>
                      <option value="Above $10,000">Above $10,000</option>
                    </select>
                  </div>
                </div>

                {regError && (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-4 py-3 rounded-xl leading-relaxed">
                    {regError}
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-slate-900 gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-350 font-semibold text-sm transition-colors border border-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReg}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-600/20 flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmittingReg ? "Submitting..." : "Submit Registration"}
                    {!isSubmittingReg && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </form>
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
                    setCurrentStep(2);
                  }}
                  className="px-6 py-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition-colors border border-slate-800 flex items-center gap-2 cursor-pointer text-slate-300"
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

                {/* Row 1: Final Winner (Centered Card) */}
                <div className="flex justify-center mb-8 w-full">
                  <div className="w-full max-w-xl glass-panel rounded-3xl p-6 border border-amber-500/20 bg-gradient-to-br from-slate-900/60 to-slate-950/60 text-center flex flex-col justify-between items-center space-y-4">
                    <div className="w-full flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mb-4">
                        {(() => {
                          const rule = badgeRules.find(r => r._id === "Final Winner");
                          return renderBadgeIcon(rule?.icon || "trophy", "w-10 h-10 text-amber-400");
                        })()}
                      </div>
                      <h4 className="text-xl font-display font-bold text-white uppercase">
                        {(() => {
                          const rule = badgeRules.find(r => r._id === "Final Winner");
                          return rule?._id || "FINAL WINNER";
                        })()}
                      </h4>
                      <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed mt-2">
                        {(() => {
                          const rule = badgeRules.find(r => r._id === "Final Winner");
                          return rule?.description || "The trader with the most Top Rank Monthly badges will be crowned the Ultimate FX Champion!";
                        })()}
                      </p>
                    </div>
                    <div className="w-full border-t border-slate-800/60 pt-4 mt-2">
                      <div className="text-[10px] text-amber-500 uppercase tracking-widest font-black mb-3">
                        Exclusive Rewards
                      </div>
                      <div className="flex justify-center gap-4 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1"><Award className="w-4.5 h-4.5 text-amber-400" /> Physical Trophy</span>
                        <span className="flex items-center gap-1"><Gift className="w-4.5 h-4.5 text-amber-400" /> Premium Gifts</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Achievements & Badges (5 badges in same row on desktop) */}
                <div className="w-full bg-slate-950/40 border border-slate-900 rounded-3xl p-6">
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-black mb-6 border-b border-slate-900 pb-3">
                    Achievements & Badges
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {(() => {
                      const normalBadges = badgeRules.length > 0 
                        ? badgeRules.filter((r) => r._id !== "Final Winner") 
                        : Object.keys(BADGE_DETAILS).filter(k => k !== "Final Winner").map(key => ({
                            _id: key,
                            points: BADGE_DETAILS[key].condition.includes("Points") ? 100 : 50,
                            description: BADGE_DETAILS[key].desc,
                            icon: key,
                            cashPrize: ""
                          }));
                      return normalBadges.map((rule) => (
                        <button
                          key={rule._id}
                          type="button"
                          onClick={() => handleBadgeClick(rule._id)}
                          className="w-full text-left glass-panel rounded-xl p-4 border border-slate-900 flex gap-3 items-start hover:border-violet-500/50 hover:bg-slate-900/40 transition-all duration-200 cursor-pointer group"
                        >
                          <div className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                            {renderBadgeIcon(rule.icon || rule._id, "w-9 h-9")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white text-xs text-left group-hover:text-violet-400 transition-colors">{rule._id}</h4>
                            {rule.cashPrize ? (
                              <span className="text-[7px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider inline-block mt-0.5 mb-1">
                                🏆 {rule.cashPrize} Cash
                              </span>
                            ) : (
                              <span className="text-[7px] bg-violet-500/10 border border-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider inline-block mt-0.5 mb-1">
                                ⭐ {rule.points} Pts
                              </span>
                            )}
                            <p className="text-[10px] text-slate-400 text-left leading-relaxed mt-0.5">
                              {rule.description || (BADGE_DETAILS[rule._id]?.desc || "")}
                            </p>
                            <span className="text-[9px] text-brand-450 font-bold mt-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              View Rules →
                            </span>
                          </div>
                        </button>
                      ));
                    })()}
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

                  <div className="mb-4">
                    {(selectedTrader.volume ?? 0) < ((selectedTrader.mtNetDeposits ?? 0) / 100) * 0.6 ? (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-amber-400 text-xs">
                        <span className="font-bold block uppercase tracking-wider text-[9px] mb-1">Status: Under Volume</span>
                        Requires at least <span className="font-bold font-display">{(((selectedTrader.mtNetDeposits ?? 0) / 100) * 0.6).toFixed(2)} Lots</span> based on Net Deposit. Currently traded <span className="font-bold font-display">{(selectedTrader.volume ?? 0).toFixed(2)} Lots</span>.
                      </div>
                    ) : (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-emerald-400 text-xs">
                        <span className="font-bold block uppercase tracking-wider text-[9px] mb-1">Status: Volume Qualified</span>
                        Traded <span className="font-bold font-display">{(selectedTrader.volume ?? 0).toFixed(2)} Lots</span>, meeting the requirement of <span className="font-bold font-display">{(((selectedTrader.mtNetDeposits ?? 0) / 100) * 0.6).toFixed(2)} Lots</span>.
                      </div>
                    )}
                  </div>

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
                {selectedBadge.displayRules && typeof selectedBadge.displayRules === 'string' && selectedBadge.displayRules.trim() !== '' ? (
                  <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-200 font-medium leading-relaxed">
                    {selectedBadge.displayRules.split('\n').map((b: string) => b.trim()).filter((b: string) => b !== '').map((bullet: string, idx: number) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {selectedBadge.condition}
                  </p>
                )}
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
