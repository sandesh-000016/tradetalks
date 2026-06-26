// ============================================================================
// Leaderboard API
// ----------------------------------------------------------------------------
// This is the single integration point for the trading-challenge leaderboard.
// When you have your real API, do TWO things:
//   1. Set API_BASE to your endpoint base URL (or leave "" and edit fetchLeaderboard).
//   2. Map your API response into the `Trader` shape inside `fetchLeaderboard`.
// Everything else in the UI consumes `useLeaderboard()` and needs no changes.
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

