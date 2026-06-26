import React from "react";
import Link from "next/link";
import { ArrowRight, Trophy, BookOpen, Star, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-900/30 border border-brand-500/30 text-brand-300 mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-brand-400 animate-pulse"></span>
              <span className="text-sm font-medium">
                New Offline Batches Starting Soon
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8">
              Master the Markets. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-200">
                Trade with Confidence.
              </span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join Trade Talks to learn professional trading strategies through
              our expert-led online and offline classes. Compete in our
              challenges and climb the leaderboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/classes"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-lg shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all flex items-center justify-center gap-2"
              >
                Explore Classes
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/leaderboard"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-lg backdrop-blur-sm transition-all flex items-center justify-center gap-2"
              >
                View Leaderboard
              </Link>
            </div>
          </div>
        </div>

        {/* Abstract background shapes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-hero-glow opacity-30 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-900/50 border-y border-slate-800/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Why Choose Trade Talks?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Comprehensive education meets real-world application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="w-6 h-6 text-brand-400" />,
                title: "Structured Learning",
                desc: "From basics to advanced price action. Available in both online and offline formats.",
              },
              {
                icon: <Target className="w-6 h-6 text-brand-400" />,
                title: "Live Mentorship",
                desc: "Trade alongside experienced mentors who guide you through live market conditions.",
              },
              {
                icon: <Trophy className="w-6 h-6 text-brand-400" />,
                title: "Trading Challenges",
                desc: "Prove your skills, rank on our global leaderboard, and earn rewards.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass-panel p-8 rounded-2xl hover:bg-slate-800/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-900/50 border border-brand-500/20 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mini Leaderboard Preview */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Top Traders This Month
              </h2>
              <p className="text-slate-400 max-w-2xl">
                Compete with the best. Rank high. Earn rewards.
              </p>
            </div>
            <Link
              href="/leaderboard"
              className="text-brand-400 hover:text-brand-300 font-medium flex items-center gap-2"
            >
              View Full Leaderboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                rank: 1,
                name: "Alex Trader",
                profit: "+32.45%",
                winRate: "78%",
                badges: 12,
              },
              {
                rank: 2,
                name: "Sophia FX",
                profit: "+28.17%",
                winRate: "74%",
                badges: 9,
              },
              {
                rank: 3,
                name: "Trader Max",
                profit: "+24.38%",
                winRate: "71%",
                badges: 11,
              },
              {
                rank: 4,
                name: "Nina Pro",
                profit: "+21.09%",
                winRate: "69%",
                badges: 8,
              },
            ].map((trader) => (
              <div
                key={trader.rank}
                className="glass-panel p-6 rounded-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-600/10 rounded-bl-full -z-10 group-hover:bg-brand-600/20 transition-colors"></div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold">
                    {trader.rank === 1 ? (
                      <Trophy className="w-4 h-4 text-accent-500" />
                    ) : (
                      trader.rank
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-accent-500 bg-accent-500/10 px-2 py-1 rounded text-xs font-medium border border-accent-500/20">
                    <Star className="w-3 h-3 fill-current" /> {trader.badges}
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-slate-700 border-2 border-slate-600 overflow-hidden">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${trader.name}`}
                      alt={trader.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{trader.name}</h4>
                    <p className="text-xs text-slate-400">
                      Win Rate: {trader.winRate}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-800/80">
                  <div className="text-2xl font-display font-bold text-emerald-400">
                    {trader.profit}
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">
                    Monthly Profit
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
