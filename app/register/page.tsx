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
const REGISTRATION_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSe5FB5CkkrPeVE0CTNhFWTRQ1MOnDWLvSBsn8lgKUMghzbCfA/viewform?usp=publish-editor";

import {
  TopRankBadge,
  WeeklyTopBadge,
  ConsistentTraderBadge,
  MostActiveTraderBadge,
  TraderOfWeekBadge,
  BestRiskManagerBadge
} from "@/components/BadgeIcons";

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

        {/* ═══════════════════════════════════════════════════════════════
            STEP 1: Alpari Account Verification
        ═══════════════════════════════════════════════════════════════ */}
        {currentStep === 1 && (
          <section className="glass-panel rounded-3xl p-8 md:p-10 mb-10 border border-slate-800">
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

                  {/* Referral Verification Checkbox */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer group text-xs text-slate-350">
                      <input
                        type="checkbox"
                        checked={referralChecked}
                        onChange={(e) => {
                          setReferralChecked(e.target.checked);
                          setErrorMsg(null);
                        }}
                        className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-950 text-violet-600 focus:ring-violet-650 focus:ring-offset-slate-900 cursor-pointer"
                      />
                      <span className="leading-snug select-none">
                        I confirm that I have registered my Alpari account using referral ID <strong className="text-amber-400">72725</strong> to join in the challenge.
                      </span>
                    </label>
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

                    {errorMsg && (
                      <div className="bg-rose-500/10 border border-rose-500/20 text-rose-450 text-xs px-4 py-3 rounded-xl leading-relaxed">
                        {errorMsg}
                      </div>
                    )}

                    {successMsg && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-3 rounded-xl leading-relaxed">
                        {successMsg}
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
                      <li key={i} className="flex items-center gap-3 text-sm text-slate-350">
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
            STEP 2: Embedded Google Form
        ═══════════════════════════════════════════════════════════════ */}
        {currentStep === 2 && (
          <section className="glass-panel rounded-3xl p-6 md:p-8 mb-10 border border-slate-800 bg-slate-950/40 relative overflow-hidden flex flex-col items-center">
            <div className="text-center mb-6 space-y-2">
              <h2 className="text-xl font-display font-black text-white uppercase tracking-wider">
                Step 2: Fill the Google Form
              </h2>
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
                className="px-6 py-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-350 font-semibold text-sm transition-colors border border-slate-800 flex items-center gap-2 cursor-pointer"
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
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            STEP 3: Rules & Rewards Dashboard
        ═══════════════════════════════════════════════════════════════ */}
        {currentStep === 3 && (
          <div className="space-y-12">
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
                      <div
                        key={i}
                        className="glass-panel rounded-xl p-4 border border-slate-900 flex gap-3 items-start hover:border-slate-800 transition-colors"
                      >
                        <div className="shrink-0">
                          {badge.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-xs">{badge.title}</h4>
                          {badge.subtitle && (
                            <span className="text-[7px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider inline-block mt-0.5 mb-1">
                              {badge.subtitle}
                            </span>
                          )}
                          <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">{badge.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Bottom Final CTA */}
            <section className="glass-panel rounded-3xl p-8 md:p-10 border border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl md:text-2xl font-display font-bold">Registration Completed!</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                You are all set! Ensure you trade using your verified Alpari Client ID.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-350 font-semibold text-sm transition-colors border border-slate-800 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Form
                </button>
                <Link
                  href="/leaderboard"
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2"
                >
                  Go to Leaderboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
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
                  className="flex-1 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest text-center shadow-lg shadow-red-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
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
