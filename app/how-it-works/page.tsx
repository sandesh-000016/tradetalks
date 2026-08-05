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
  X,
  ExternalLink,
  CheckCircle2,
  Info,
  DollarSign,
  Wallet,
  TrendingDown
} from "lucide-react";
import { renderBadgeIcon } from "@/components/BadgeIcons";

const BADGE_DETAILS: Record<string, {
  color: string;
  desc: string;
  condition: string;
}> = {
  "Top Rank Monthly": {
    color: "hover:scale-110",
    desc: "Awarded to the top ranked trader each month.",
    condition: "Achieve the absolute #1 rank in the monthly challenge leaderboard."
  },
  "Consistent Trader": {
    color: "hover:scale-110",
    desc: "Awarded for consistent performance throughout the challenge.",
    condition: "Maintain a minimum activity level of 12 completed trades."
  },
  "Most Active Trader": {
    color: "hover:scale-110",
    desc: "Awarded for highest active volume (settled + unsettled).",
    condition: "Accumulate an aggregate volume (settled + unsettled) of 8.00 Lots or more."
  },
  "Trader of the Week": {
    color: "hover:scale-110",
    desc: "Recognizing outstanding trading performance of the week.",
    condition: "Secure a Top 3 rank in weekly standings."
  },
  "Best Risk Manager": {
    color: "hover:scale-110",
    desc: "Awarded for excellent risk management and discipline.",
    condition: "Achieve a return above 12% with at least 10 trades."
  }
};

const challengeRules = [
  {
    num: 1,
    icon: <Wallet className="w-4 h-4" />,
    color: "text-violet-400 border-violet-500/30 bg-violet-500/10",
    title: "Minimum Deposit",
    value: "$100",
    desc: "Minimum deposit required to start the challenge.",
  },
  {
    num: 2,
    icon: <Scale className="w-4 h-4" />,
    color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
    title: "Risk Reward Ratio",
    value: "1:1 Minimum RR",
    desc: "Maintain at least 1:1 risk to reward ratio.",
  },
  {
    num: 3,
    icon: <Target className="w-4 h-4" />,
    color: "text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10",
    title: "TP & SL Mandatory",
    value: "Take Profit & Stop Loss",
    desc: "Take Profit and Stop Loss must be maintained for every trade.",
  },
  {
    num: 4,
    icon: <Trophy className="w-4 h-4" />,
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    title: "Winner",
    value: "Highest % Return",
    desc: "Trader with the highest percentage return at the end wins.",
  },
  {
    num: 5,
    icon: <TrendingDown className="w-4 h-4" />,
    color: "text-rose-400 border-rose-500/30 bg-rose-500/10",
    title: "Daily Drawdown",
    value: "25%",
    desc: "Maximum daily drawdown allowed is 25%.",
  },
  {
    num: 6,
    icon: <Shield className="w-4 h-4" />,
    color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    title: "Maximum Drawdown",
    value: "100%",
    desc: "Account washout at 100% drawdown.",
  },
  {
    num: 7,
    icon: <Calendar className="w-4 h-4" />,
    color: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    title: "Challenge Duration",
    value: "Fixed Period",
    desc: "Challenge runs for a fixed duration (e.g., 6 Months, 1 year).",
  },
  {
    num: 8,
    icon: <Activity className="w-4 h-4" />,
    color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    title: "Minimum Trading Activity",
    value: "10 Trades",
    desc: "At least 10 trades must be placed in a month.",
  },
];

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

export default function HowItWorksPage() {
  const [badgeRules, setBadgeRules] = React.useState<any[]>([]);
  const [selectedBadge, setSelectedBadge] = React.useState<{
    name: string;
    desc: string;
    condition: string;
    color: string;
    icon: React.ReactNode;
    displayRules?: string;
  } | null>(null);

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

  const translateConditionToHuman = (rule: any) => {
    if (!rule) return "No criteria defined.";
    const conds = rule.conditions || [];
    if (conds.length > 0) {
      return conds.map((cond: any) => {
        const opSign = cond.operator === "gte" ? "≥" : cond.operator === "lte" ? "≤" : cond.operator === "gt" ? ">" : cond.operator === "lt" ? "<" : "=";
        let metricDisplay = cond.metric;
        if (cond.metric === "profit") metricDisplay = "Profit ROI";
        else if (cond.metric === "volume") metricDisplay = "Volume (Lots)";

        let valueDisplay = cond.value;
        if (cond.metric === "profit") valueDisplay = `${cond.value}%`;
        return `${metricDisplay} ${opSign} ${valueDisplay}`;
      }).join(" AND ");
    }

    if (rule.metric && rule.operator && rule.value !== undefined) {
      const opSign = rule.operator === "gte" ? "≥" : rule.operator === "lte" ? "≤" : "=";
      let metricDisplay = rule.metric;
      if (rule.metric === "profit") metricDisplay = "Profit ROI";
      else if (rule.metric === "volume") metricDisplay = "Volume (Lots)";
      return `${metricDisplay} ${opSign} ${rule.value}`;
    }
    return "Custom rules apply.";
  };

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

  return (
    <div className="relative min-h-screen text-slate-100 bg-slate-950 pb-20 overflow-hidden">

      {/* Background Glow Elements */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-brand-900/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Header / Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 text-center relative z-10 space-y-6">
        <div className="inline-flex px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider">
          Complete Challenge Walkthrough
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display uppercase">
          How the <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-violet-400 to-indigo-400">Challenge</span> Works
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Learn how to get started, set up your broker account, understand qualification guidelines, and track your achievements on our verified leaderboard.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 relative z-10 space-y-20">

        {/* Section 1: Importance of Forex */}
        <section className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 md:p-10 space-y-6 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white font-display uppercase tracking-wide">
              The Power of Forex Trading
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-450 text-sm leading-relaxed">
            <div className="space-y-4">
              <p>
                Forex (Foreign Exchange) is the largest financial market in the world, with over <strong>$7.5 Trillion</strong> in daily trading volume. Unlike traditional equity markets, forex operates 24 hours a day, 5 days a week, offering continuous opportunities across global time zones.
              </p>
              <p>
                Trading Forex empowers disciplined traders to capitalize on macroeconomic shifts, interest rate changes, and geopolitical events. Through leverage, even small accounts can gain exposure to significant market movements when backed by professional risk-mitigation strategies.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                <strong>Why compete?</strong> A simulated or live trading challenge helps validate your trading model, build consistent discipline under emotional pressure, and track your performance relative to peer metrics.
              </p>
              <p>
                TradeTalks provides this environment to help you transparently prove your market edge, earn bragging rights, collect performance badges, and stand a chance to claim outstanding cash prizes.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Quick Start Steps */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-center text-white font-display uppercase tracking-wider">
            Getting Started in 3 Steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Step 1 Card */}
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold font-mono text-sm">
                  1
                </div>
                <h3 className="font-bold text-white text-base">Register with Partner Broker</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sign up with Alpari (our preferred broker partner) using our link or referral code to activate exclusive TradeTalks benefits.
                </p>
              </div>
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-brand-450 tracking-wider font-mono">Code: 72725</span>
              </div>
            </div>

            {/* Step 2 Card */}
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 font-bold font-mono text-sm">
                  2
                </div>
                <h3 className="font-bold text-white text-base">Submit Challenge Account</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Head over to the Registration form, input your client information and MT4 account ID to sync your live trading feed.
                </p>
              </div>
              <div className="pt-2">
                <Link href="/register" className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-400 hover:text-white transition-colors">
                  Go to Register <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Step 3 Card */}
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono text-sm">
                  3
                </div>
                <h3 className="font-bold text-white text-base">Trade & Climb Standings</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Complete minimum activity requirements, grow your balance, secure achievement badges, and climb the public leaderboard rankings.
                </p>
              </div>
              <div className="pt-2">
                <Link href="/leaderboard" className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-white transition-colors">
                  Go to Leaderboard <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

          </div>

          {/* Partner Referral Box */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/80 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="space-y-2 flex-1 text-center md:text-left">
              <div className="inline-flex px-2 py-0.5 rounded bg-brand-500/10 border border-brand-500/20 text-brand-400 text-[10px] font-black uppercase tracking-wider">
                Special Partnership Offer
              </div>
              <h3 className="text-lg font-bold text-white font-display">Join Alpari with TradeTalks</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                By registering with our official referral link on Alpari and depositing, you qualify for TradeTalks future promotions, direct course fee rebates, and early access to upcoming seasons.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <div className="px-4 py-2.5 bg-slate-950/80 rounded-xl border border-slate-800/60 font-mono text-xs text-slate-300 font-bold select-all flex items-center gap-1">
                <span>Code:</span>
                <span className="text-brand-400 font-black">72725</span>
              </div>
              <a
                href="https://alpari.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-brand-600/15 flex items-center gap-1.5 cursor-pointer"
              >
                Register Account
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* Section 3: Global Rules */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white font-display uppercase tracking-wider">
              Challenge Guidelines & Rules
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Please ensure your trading operations respect the following standard guidelines to remain eligible for seasonal rewards.
            </p>
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
        </section>

        {/* Section 4: Badges & Qualifiers */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white font-display uppercase tracking-wider">
              Earn Performance Badges
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Qualify for specific awards based on your monthly/weekly results. Click any badge to preview detailed requirements.
            </p>
          </div>

          {/* Row 1: Final Winner (Centered Card - Same Size) */}
          <div className="flex justify-center mb-12 w-full">
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="uiverse-card !w-full max-w-[240px] group transition-all duration-300 relative overflow-hidden cursor-pointer"
              style={{ height: "260px" }}
              onClick={() => handleBadgeClick("Final Winner")}
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
                    return (
                      <div className="flex flex-col items-center gap-1.5 mt-1.5">
                        <div className="px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-[10px] font-bold inline-flex items-center gap-1 uppercase tracking-wider">
                          <span>⭐</span>
                          <span>{rule?.points || 500} Pts</span>
                        </div>
                        {rule?.cashPrize && (
                          <div className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black inline-flex items-center gap-1 uppercase tracking-wider">
                            <span>🏆</span>
                            <span>₹{rule.cashPrize} Cash</span>
                          </div>
                        )}
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
                  className="uiverse-card !w-full group transition-all duration-300 relative overflow-hidden mx-auto sm:mx-0 cursor-pointer"
                  style={{ height: "260px" }}
                  onClick={() => handleBadgeClick(rule._id)}
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
                      <div className="flex flex-col items-center gap-1.5 mt-1.5">
                        <div className="px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-bold inline-flex items-center gap-1 uppercase tracking-wider">
                          <span>⭐</span>
                          <span>{rule.points} Pts</span>
                        </div>
                        {rule.cashPrize && (
                          <div className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black inline-flex items-center gap-1 uppercase tracking-wider">
                            <span>🏆</span>
                            <span>₹{rule.cashPrize} Cash</span>
                          </div>
                        )}
                      </div>
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
        </section>

        {/* Section 5: Winner Selection & Disclaimer */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">

          {/* MT4 Verification */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 md:p-8 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 blur-xl pointer-events-none rounded-full" />
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-450" />
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">MT4 Terminal Log Verification</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              To ensure fairness, all seasonal leaders and final winners will undergo a strict terminal log audit. Our verification desk will retrieve the MetaTrader 4 (MT4) history directly to confirm that no trading regulations (e.g. max lot limits per trade, leverage anomalies, or trade manipulation) were violated. If inconsistencies are detected, ranking positions and reward eligibility will be re-assigned.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 md:p-8 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 blur-xl pointer-events-none rounded-full" />
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h3 className="font-bold text-white text-sm uppercase tracking-wider text-rose-450">Awards Discrepancy Disclaimer</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              TradeTalks acts solely as an educational tracking platform. TradeTalks holds no financial custody, is not a registered financial advisor or broker entity, and does not conduct direct financial trading. We are not responsible for broker terminal sync errors, metric lag, or any discrepancies regarding badge assignments and prize awarding. All decisions by our verification board are final.
            </p>
          </div>

        </section>

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

    </div>
  );
}
