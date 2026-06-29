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
  tradesCount?: number;
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
