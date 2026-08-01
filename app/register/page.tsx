"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ExternalLink,
  Shield,
  Trophy,
  Star,
  TrendingDown,
  Scale,
  DollarSign,
  Target,
  Activity,
  AlertTriangle,
  Award,
  Gift,
  Medal,
  Clock,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  Play,
  X,
} from "lucide-react";

const ALPARI_REFERRAL_URL = "https://alpari.com/en/?Referral=72725";

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

function RegisterContent() {
  const [clientId, setClientId] = React.useState("");
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [verifiedClient, setVerifiedClient] = React.useState<any>(null);
  const [referralChecked, setReferralChecked] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [selectedVideoId, setSelectedVideoId] = React.useState("lmtgjAD18nE");

  // Custom registration form state
  const [regForm, setRegForm] = React.useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    experience: "",
    howHeard: "",
    tradingGoal: "",
  });
  const [isSubmittingReg, setIsSubmittingReg] = React.useState(false);
  const [regError, setRegError] = React.useState<string | null>(null);

  const handleRegFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setRegForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setRegError(null);
  };

  const handleRegSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.fullName.trim() || !regForm.phone.trim()) {
      setRegError("Full Name and Phone Number are required.");
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

  const [selectedBadge, setSelectedBadge] = React.useState<{
    name: string;
    desc: string;
    condition: string;
    color: string;
    icon: React.ReactNode;
  } | null>(null);
  const [badgeRules, setBadgeRules] = React.useState<any[]>([]);


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

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);



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

  return (
    <div className="pt-8 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link href="/" className="hover:text-brand-400 transition-colors">Home</Link>
          <span className="text-slate-600">›</span>
          <span className="text-white font-medium">Join Challenge</span>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3 uppercase tracking-tight">
            Join the Challenge
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Start your journey to compete, rank, and earn amazing rewards.
          </p>
        </div>

        {/* ── Step Indicator ── */}
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
                    currentStep > step.num ? "bg-emerald-500" : "bg-slate-850"
                  } hidden md:block`}></div>
                )}
              </div>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            STEP 1: Alpari Account Verification
        ═══════════════════════════════════════════════════════════════ */}
        {currentStep === 1 && (
          <section className="glass-panel rounded-3xl p-8 md:p-10 mb-10 border border-slate-800 animate-in fade-in duration-300">
            <h2 className="text-lg font-display font-bold mb-6 text-center">
              Step 1: Verify Your Alpari Account
            </h2>
            <p className="text-sm text-slate-400 text-center mb-8 max-w-lg mx-auto">
              To participate in this challenge, you must have a valid Alpari account registered under our referral code.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              {/* Option A — Verify existing account */}
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
                    <h3 className="text-xl font-display font-black text-white leading-tight uppercase">
                      Verify Your Client ID
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-2">
                      Enter the exact client ID from your Alpari account. Once verified, the challenge portal unlocks and your balance is recorded.
                    </p>
                  </div>

                  <form onSubmit={handleVerify} className="space-y-4">
                    <div className="space-y-1.5 font-sans">
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
                        placeholder="(e.g. f0a5788d3e6)"
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
                          className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-950 text-violet-600 focus:ring-violet-655 focus:ring-offset-slate-900 cursor-pointer"
                        />
                        <span className="leading-snug select-none">
                          I confirm that I have registered my Alpari account using referral ID <strong className="text-amber-400">72725</strong> to join in the challenge.
                        </span>
                      </label>
                    </div>

                    {errorMsg && (
                      <div className="bg-rose-500/10 border border-rose-500/20 text-rose-450 text-xs px-4 py-3 rounded-xl leading-relaxed">
                        {errorMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isVerifying || !referralChecked}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-950/20 disabled:text-slate-600 disabled:border-slate-900 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/10 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isVerifying ? "Verifying..." : "Verify Challenge Access"}
                    </button>
                  </form>
                </div>
              </div>

              {/* Option B — Need to create account */}
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 space-y-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-white text-center mb-3">
                    No, I don&apos;t have an Alpari Account
                  </h3>
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
                      <li key={i} className="flex items-center gap-3 text-sm text-slate-355">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">✓</span>
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={ALPARI_REFERRAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-sm text-center flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"
                >
                  Open Alpari Account
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <p className="text-center text-[11px] text-slate-500 mt-6">
              Your details are secure and will only be used for challenge verification.
            </p>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            STEP 2: Custom Registration Form
        ═══════════════════════════════════════════════════════════════ */}
        {currentStep === 2 && (
          <section className="glass-panel rounded-3xl p-6 md:p-8 mb-10 border border-slate-800 bg-slate-950/40 relative overflow-hidden animate-in fade-in duration-300">
            <div className="text-center mb-8 space-y-2">
              <h2 className="text-xl font-display font-black text-white uppercase tracking-wider">
                Step 2: Complete Your Registration
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Fill in your details below. Your verified Client ID has been pre-linked.
              </p>
            </div>

            {/* Verified badge banner */}
            <div className="flex items-center gap-3 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl px-5 py-3 mb-6">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-emerald-400 text-sm font-semibold block">Account Verified</span>
                <span className="text-slate-400 text-xs">
                  {verifiedClient?.name} — Balance:{" "}
                  <strong className="text-white">${verifiedClient?.balance ?? "100"}</strong>
                </span>
              </div>
            </div>

            <form onSubmit={handleRegSubmit} className="space-y-5">
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
                    Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={regForm.phone}
                    onChange={handleRegFormChange}
                    required
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={regForm.email}
                    onChange={handleRegFormChange}
                    placeholder="your@email.com"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={regForm.city}
                    onChange={handleRegFormChange}
                    placeholder="Your city"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={regForm.state}
                    onChange={handleRegFormChange}
                    placeholder="Your state"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Trading Experience
                  </label>
                  <select
                    name="experience"
                    value={regForm.experience}
                    onChange={handleRegFormChange}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                  >
                    <option value="">Select experience level</option>
                    <option value="Beginner (Less than 1 year)">Beginner (Less than 1 year)</option>
                    <option value="Intermediate (1–3 years)">Intermediate (1–3 years)</option>
                    <option value="Experienced (3–5 years)">Experienced (3–5 years)</option>
                    <option value="Expert (5+ years)">Expert (5+ years)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    How Did You Hear About Us?
                  </label>
                  <select
                    name="howHeard"
                    value={regForm.howHeard}
                    onChange={handleRegFormChange}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                  >
                    <option value="">Select an option</option>
                    <option value="Instagram">Instagram</option>
                    <option value="YouTube">YouTube</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Friend / Referral">Friend / Referral</option>
                    <option value="Google Search">Google Search</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Your Trading Goal
                  </label>
                  <input
                    type="text"
                    name="tradingGoal"
                    value={regForm.tradingGoal}
                    onChange={handleRegFormChange}
                    placeholder="e.g. Earn consistent returns"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                  />
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
          </section>
        )}


        {/* ═══════════════════════════════════════════════════════════════
            STEP 3: Complete Verification Page
        ═══════════════════════════════════════════════════════════════ */}
        {currentStep === 3 && (
          <section className="glass-panel rounded-3xl p-8 md:p-10 mb-10 border border-slate-800 text-center space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <h2 className="text-xl md:text-2xl font-display font-extrabold uppercase tracking-wide text-white">
                Welcome, {verifiedClient?.name || "Trader"}!
              </h2>
              <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                Your Alpari account balance of <strong className="text-emerald-400 font-mono text-base">${verifiedClient?.balance ?? "100"}</strong> has been successfully verified.
              </p>
              <p className="text-slate-450 text-xs max-w-md mx-auto leading-relaxed">
                You have successfully unlocked access to the trading challenge and our Forex educational series.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 border-t border-slate-900/60 w-full max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-350 font-semibold text-sm transition-colors border border-slate-800 flex items-center justify-center gap-2 cursor-pointer"
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
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            STEP 4: Rules & Rewards Dashboard
        ═══════════════════════════════════════════════════════════════ */}
        {currentStep === 4 && (
          <div className="space-y-12 mb-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Rules Section */}
            <section className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight">
                  Challenge Rules
                </h2>
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
                <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight">
                  Rewards & Prizes
                </h2>
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
                    <h3 className="text-xl font-display font-bold text-white">FINAL WINNER</h3>
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
                          <h4 className="font-semibold text-white text-xs group-hover:text-violet-400 transition-colors">{badge.title}</h4>
                          {badge.subtitle && (
                            <span className="text-[7px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider inline-block mt-0.5 mb-1">
                              {badge.subtitle}
                            </span>
                          )}
                          <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">{badge.desc}</p>
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
                className="px-6 py-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-350 font-semibold text-sm transition-colors border border-slate-800 flex items-center gap-2 cursor-pointer"
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

        {/* ═══════════════════════════════════════════════════════════════
            STEP 5: Forex Bootcamp Video Playlist Player
        ═══════════════════════════════════════════════════════════════ */}
        {currentStep === 5 && (
          <section className="glass-panel rounded-3xl p-6 md:p-8 mb-10 border border-slate-800 bg-slate-950/40 relative overflow-hidden flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-center mb-6 space-y-2">
              <h2 className="text-xl font-display font-black text-white uppercase tracking-wider">
                Step 5: Educational Forex Playlist
              </h2>
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
                  <h4 className="text-sm font-semibold text-white font-display">
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
                <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider px-1">
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
                        className={`w-full flex gap-3 p-2.5 rounded-xl border text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
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
                className="px-6 py-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-350 font-semibold text-sm transition-colors border border-slate-800 flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <Link
                href="/leaderboard"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-600/20 flex items-center gap-2 cursor-pointer"
              >
                Go to Leaderboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}
      </div>

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
                <p className="text-[11px] text-slate-450 leading-relaxed">
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
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="w-full py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-white text-xs font-semibold transition-all border border-slate-800 cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Register() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-400">
          Loading registration details...
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
