// ============================================================================
// Leaderboard API (Real Source of Truth)
// ----------------------------------------------------------------------------
// This is the single integration point for the trading-challenge leaderboard.
// ============================================================================

export type Timeframe = "all" | "monthly" | "weekly" | "daily";

export interface TradeActivity {
  instrument: string;
  action: "Buy" | "Sell";
  status: string;
  opened: string;
  closed: string;
  pl: number; // profit/loss %
}

export interface Trader {
  id: number | string;
  rank: number;
  name: string;
  title?: string;
  avatar?: string;
  profit: number; // %
  drawdown: number; // %
  winRate: number; // %
  badges: number;
  status: "online" | "offline";
  activity?: TradeActivity[];
  country?: string;
  registrationDate?: string;
  volume?: number;
  settledRebates?: number;
  mtNetDeposits?: number;
  totalBalance?: number;
  totalEquity?: number;
  programName?: string;
  earnedBadges?: string[];
}

export interface BadgeInfo {
  id: string;
  title: string;
  subtitle?: string;
  desc: string;
  color: string;
  textColor: string;
  iconName: "medal" | "star" | "check" | "down" | "chart" | "shield";
}

export const BADGE_DEFINITIONS: Record<string, BadgeInfo> = {
  final_winner: {
    id: "final_winner",
    title: "Final Winner",
    subtitle: "GRAND PRIZE",
    desc: "Overall 6-month winner: Win rate >= 50%, profit > 30%, drawdown <= 20%, account balance > $100.",
    color: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    textColor: "text-amber-400",
    iconName: "medal",
  },
  top_rank_monthly: {
    id: "top_rank_monthly",
    title: "Monthly Top Rank",
    desc: "Win rate > 70%, profit > 50%, drawdown < 20% in the month, account balance > $100.",
    color: "bg-violet-500/10 border-violet-500/30 text-violet-400",
    textColor: "text-violet-400",
    iconName: "star",
  },
  weekly_top: {
    id: "weekly_top",
    title: "Weekly Top",
    desc: "Win rate > 70%, profit >= 20%, drawdown < 10% in the week, account balance > $100.",
    color: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    textColor: "text-blue-400",
    iconName: "chart",
  },
  consistent_trader: {
    id: "consistent_trader",
    title: "Consistent Trader",
    desc: "Challenge-wide consistency: Win rate > 50%, volume > 70 lots, capital >= $1000.",
    color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    textColor: "text-emerald-400",
    iconName: "check",
  },
  low_drawdown: {
    id: "low_drawdown",
    title: "Low Drawdown Monthly",
    desc: "Monthly reward: Volume > 20 lots, drawdown < 5%, account balance > $100.",
    color: "bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400",
    textColor: "text-fuchsia-400",
    iconName: "down",
  },
  trader_of_the_week: {
    id: "trader_of_the_week",
    title: "Trader of the Week",
    desc: "Recognizing outstanding performance: Profit >= 20%, win rate >= 65%, account balance > $100.",
    color: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
    textColor: "text-cyan-400",
    iconName: "chart",
  },
  best_risk_manager: {
    id: "best_risk_manager",
    title: "Best Risk Manager",
    desc: "6-month risk award: Win rate > 60%, drawdown < 20%, account balance > $100.",
    color: "bg-rose-500/10 border-rose-500/30 text-rose-400",
    textColor: "text-rose-400",
    iconName: "shield",
  },
};

export function determineTraderBadges(trader: {
  rank: number;
  profit: number;
  drawdown: number;
  winRate: number;
  volume?: number;
  totalBalance?: number;
}): string[] {
  const earned: string[] = [];
  const volume = trader.volume ?? 0;
  const balance = trader.totalBalance ?? 0;

  // Priority 1: Final Winner (6-month challenge)
  if (trader.winRate >= 50 && trader.profit > 30 && trader.drawdown <= 20 && balance > 100) {
    earned.push("final_winner");
  }
  // Priority 2: Monthly Top Rank
  else if (trader.winRate > 70 && trader.profit > 50 && trader.drawdown < 20 && balance > 100) {
    earned.push("top_rank_monthly");
  }
  // Priority 3: Weekly Top
  else if (trader.winRate > 70 && trader.profit >= 20 && trader.drawdown < 10 && balance > 100) {
    earned.push("weekly_top");
  }
  // Priority 4: Consistent Trader
  else if (trader.winRate > 50 && volume > 70 && balance >= 1000) {
    earned.push("consistent_trader");
  }
  // Priority 5: Low Drawdown Monthly Award
  else if (volume > 20 && trader.drawdown < 5 && balance > 100) {
    earned.push("low_drawdown");
  }
  // Priority 6: Best Risk Manager (6-month)
  else if (trader.winRate > 60 && trader.drawdown < 20 && balance > 100) {
    earned.push("best_risk_manager");
  }
  // Priority 7: Trader of the Week
  else if (trader.profit >= 20 && trader.winRate >= 65 && balance > 100) {
    earned.push("trader_of_the_week");
  }
  return earned;
}

export async function fetchLeaderboard(
  timeframe: Timeframe
): Promise<Trader[]> {
  const res = await fetch(`/api/leaderboard?timeframe=${timeframe}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `API returned status ${res.status}`);
  }
  const data = await res.json();
  return data;
}
