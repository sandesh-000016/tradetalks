"use client";

import React from "react";
import Link from "next/link";
import { Shield, AlertTriangle, Scale, CheckCircle2, ChevronRight, Trophy } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="relative min-h-screen text-slate-100 bg-slate-950 pb-20 overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-rose-950/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-1/4 w-[400px] h-[400px] bg-brand-950/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 text-center relative z-10 space-y-4">
        <div className="inline-flex px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
          Legal Agreement
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display uppercase">
          Terms & <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-450 via-brand-400 to-violet-400">Conditions</span>
        </h1>
        <p className="text-slate-400 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
          Last Updated: August 2026. Please read this agreement carefully before registering or participating in the TradeTalks Forex Challenge.
        </p>
      </div>

      {/* Content Layout */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-10 space-y-8">
        
        {/* Core Warning Box */}
        <div className="bg-rose-500/[0.02] border border-rose-500/20 rounded-2xl p-6 flex items-start gap-4 backdrop-blur-sm">
          <AlertTriangle className="w-5 h-5 text-rose-450 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider">Crucial Risk Notice</h3>
            <p className="text-xs text-slate-405 leading-relaxed">
              TradeTalks is an educational metrics-tracking portal. We do not provide brokerage services, financial advice, custody of funds, or investment management. Forex trading carries high risks. Only trade capital you can afford to lose.
            </p>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6">
          
          {/* Section 1 */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-2 text-brand-400">
              <Scale className="w-4 h-4" />
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">1. Nature of the Challenge</h3>
            </div>
            <div className="text-xs text-slate-400 leading-relaxed space-y-3">
              <p>
                1.1. The TradeTalks Forex Challenge is an educational performance tracking initiative. It allows traders to register their individual MetaTrader 4 (MT4) accounts powered by third-party brokers (such as Alpari) to verify their performance metrics on a public leaderboard.
              </p>
              <p>
                1.2. The challenge is open to individuals who have reached the age of majority in their jurisdiction. Registration requires accurate broker client info. Any attempt to register invalid, fake, or duplicate client profiles will result in immediate disqualification.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-2 text-violet-400">
              <Shield className="w-4 h-4" />
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">2. Account Setup & Broker Partnerships</h3>
            </div>
            <div className="text-xs text-slate-400 leading-relaxed space-y-3">
              <p>
                2.1. Participants are required to establish an active trading account on MT4/MT5 via a licensed broker. TradeTalks designates <strong>Alpari</strong> as the preferred broker partner.
              </p>
              <p>
                2.2. While registering with our broker referral code offers promotional perks and rewards, participants acknowledge that broker account creation, deposits, leverage structures, and withdrawals are subject strictly to the terms of the third-party broker (Alpari). TradeTalks is not a party to those agreements.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Trophy className="w-4 h-4" />
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">3. Performance Metrics, Badges, & Winners</h3>
            </div>
            <div className="text-xs text-slate-400 leading-relaxed space-y-3">
              <p>
                3.1. Leaderboard standings, monthly rankings, and badges are generated based on mathematical calculations computed from synced trading logs. These computations include Profit ROI, cumulative volume, and risk evaluation.
              </p>
              <p>
                3.2. <strong>MT4 Terminal Verification:</strong> At the close of each evaluation period, final winners and standings will be verified manually by our audit desk. TradeTalks reserves the absolute right to audit raw MT4/MT5 logs. Disqualification will occur if we discover:
              </p>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-350">
                <li>Arb trading, latency exploitation, or hedging across opposing accounts.</li>
                <li>Leverage limits violation or deliberate manipulation of pricing feeds.</li>
                <li>Fake account IDs or data fabrication.</li>
              </ul>
              <p>
                3.3. **Exclusion of Liability:** TradeTalks uses automated data synchronization. We are not responsible for terminal disconnects, API sync lag, calculation discrepancies, or broker downtime that may affect user ratings, badges, or points.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">4. Disclaimers & General Indemnity</h3>
            </div>
            <div className="text-xs text-slate-400 leading-relaxed space-y-3">
              <p>
                4.1. **No Financial Advisory:** TradeTalks represents an educational community portal. No material, score, leaderboard update, or newsletter constitutes financial, investment, legal, or tax advice.
              </p>
              <p>
                4.2. **Indemnification:** By participating, you agree to indemnify, defend, and hold harmless TradeTalks, its directors, partners, and employees from any claims, trading losses, broker failures, regulatory restrictions, or damages arising out of your participation in this challenge.
              </p>
              <p>
                4.3. TradeTalks reserves the right to modify rules, cancel seasons, alter reward distributions, or restrict access to any participant at its sole discretion, with or without prior notice.
              </p>
            </div>
          </div>

        </div>

        {/* Back Link */}
        <div className="flex justify-center pt-4">
          <Link href="/register" className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-white hover:bg-slate-850 hover:border-slate-700 transition-all">
            Return to Registration
            <ChevronRight className="w-4 h-4 text-brand-400" />
          </Link>
        </div>

      </div>

    </div>
  );
}
