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
} from "lucide-react";

const ALPARI_REFERRAL_URL = "https://alpari.com/en/?Referral=72725";
const REGISTRATION_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSe5FB5CkkrPeVE0CTNhFWTRQ1MOnDWLvSBsn8lgKUMghzbCfA/viewform?usp=publish-editor";

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
    desc: "Challenge runs for a fixed duration (e.g., 30 days, 1 year).",
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

// Badges Data
const badges = [
  {
    icon: <Medal className="w-5 h-5" />,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    title: "Top Rank Monthly",
    subtitle: "BEST BADGE",
    desc: "Awarded to the top ranked trader each month.",
  },
  {
    icon: <Star className="w-5 h-5" />,
    color: "text-violet-400 bg-violet-500/10 border-violet-500/30",
    title: "Weekly Top",
    desc: "Awarded to the top performer of the week.",
  },
  {
    icon: <CheckCircle2 className="w-5 h-5" />,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    title: "Consistent Trader",
    desc: "Awarded for consistent performance throughout the challenge.",
  },
  {
    icon: <TrendingDown className="w-5 h-5" />,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    title: "Low Drawdown Trader",
    desc: "Awarded for maintaining low drawdown.",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    color: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30",
    title: "Trader of the Week",
    desc: "Recognizing outstanding trading performance of the week.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    title: "Best Risk Manager",
    desc: "Awarded for excellent risk management and discipline.",
  },
];

function RegisterContent() {
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
            { num: 1, label: "Alpari Account", sub: "Verify your account" },
            { num: 2, label: "Challenge Rules", sub: "Know the rules" },
            { num: 3, label: "Rewards & Badges", sub: "Earn and win" },
          ].map((step, i) => (
            <div key={step.num} className="flex items-center gap-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-display font-bold text-sm mb-2 shadow-lg shadow-brand-600/30">
                  {step.num}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white">{step.label}</div>
                <div className="text-[10px] text-slate-500 hidden sm:block">{step.sub}</div>
              </div>
              {i < 2 && (
                <div className="w-12 sm:w-20 h-px bg-slate-800 mb-6"></div>
              )}
            </div>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 1: Alpari Account
        ═══════════════════════════════════════════════════════════════ */}
        <section className="glass-panel rounded-3xl p-8 md:p-10 mb-10 border border-slate-800">
          <h2 className="text-lg font-display font-bold mb-6 text-center">
            Do you have a Traders Account with Alpari?
          </h2>
          <p className="text-sm text-slate-400 text-center mb-8 max-w-lg mx-auto">
            This challenge is only open to traders with a valid Alpari trading account.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Option A — Already have account */}
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 space-y-5">
              <h3 className="font-semibold text-white text-center">
                Yes, I have an Alpari Account
              </h3>
              <p className="text-xs text-slate-400 text-center">
                Please provide your Alpari account details or submit via Google Form.
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Alpari Account Number"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                <select
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 appearance-none"
                  defaultValue=""
                >
                  <option value="" disabled>Account Type</option>
                  <option value="standard">Standard</option>
                  <option value="ecn">ECN</option>
                  <option value="pro-ecn">Pro ECN</option>
                  <option value="nano">Nano</option>
                </select>
                <input
                  type="email"
                  placeholder="Registered Email with Alpari"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <a
                href={REGISTRATION_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-brand-600/20 text-center block"
              >
                Submit & Continue
              </a>
            </div>

            {/* Divider */}
            <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            </div>

            {/* Option B — Need to create account */}
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 space-y-5 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-white text-center mb-3">
                  No, I don&apos;t have an Alpari Account
                </h3>
                <p className="text-xs text-slate-400 text-center mb-6">
                  Open your account with Alpari to participate in the challenge.
                </p>

                <ul className="space-y-3 mb-6">
                  {[
                    "Trusted global broker",
                    "Competitive spreads",
                    "Secure & reliable",
                  ].map((perk, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
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

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 2: Challenge Rules
        ═══════════════════════════════════════════════════════════════ */}
        <section className="mb-10">
          <div className="text-center mb-8">
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
                {/* Rule Number Badge */}
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

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 3: Rewards & Prizes
        ═══════════════════════════════════════════════════════════════ */}
        <section className="mb-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight">
              Rewards & Prizes
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Compete, earn badges, and win exciting rewards.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Final Winner Highlight */}
            <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-amber-500/20 bg-gradient-to-br from-slate-900/60 to-slate-950/60 text-center flex flex-col justify-center items-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-amber-400" />
              </div>
              <h3 className="text-xl font-display font-bold text-white">FINAL WINNER</h3>
              <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
                The trader with the most Top Rank Monthly badges will be crowned the Ultimate FX Champion!
              </p>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2 text-amber-400 text-xs font-semibold">
                🏆 Exclusive Rewards
              </div>
              <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-2">
                <span className="flex items-center gap-1"><Award className="w-3 h-3" /> Physical Badge</span>
                <span className="flex items-center gap-1"><Gift className="w-3 h-3" /> Books & Premium Gifts</span>
              </div>
            </div>

            {/* Badges Grid */}
            <div className="lg:col-span-8">
              <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
                Achievements & Badges
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((badge, i) => (
                  <div
                    key={i}
                    className="glass-panel rounded-xl p-4 border border-slate-800 flex gap-3 items-start hover:border-slate-700 transition-colors"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${badge.color}`}>
                      {badge.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-xs">{badge.title}</h4>
                      {badge.subtitle && (
                        <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider inline-block mt-0.5 mb-1">
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

        {/* ═══════════════════════════════════════════════════════════════
            BOTTOM CTA
        ═══════════════════════════════════════════════════════════════ */}
        <section className="glass-panel rounded-3xl p-8 md:p-10 border border-slate-800 text-center">
          <h2 className="text-xl md:text-2xl font-display font-bold mb-3">
            Ready to Start?
          </h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            You&apos;re just a few steps away from joining the challenge.
            Read the rules carefully and begin your journey to the top!
          </p>
          <a
            href={REGISTRATION_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-base shadow-lg shadow-violet-600/20 transition-all hover:-translate-y-0.5"
          >
            I Understand the Rules, Start Challenge
            <ExternalLink className="w-4 h-4" />
          </a>
        </section>

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
