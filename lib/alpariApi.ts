/**
 * Alpari Portal API Integration Service
 * Keeps Private-Token secure by running on the server side.
 */

export interface AlpariApiParams {
  RegistrationFromDate: string;
  RegistrationToDate: string;
  DirectPartnerId: number;
}

export interface AlpariClientPerformance {
  clientId: string;
  profit?: number;
  drawdown?: number;
  winRate?: number;
  [key: string]: any;
}

export interface AlpariClientReferral {
  clientId: string;
  referralsCount?: number;
  [key: string]: any;
}

export interface AlpariClientInsight {
  clientId: string;
  status?: "online" | "offline";
  badges?: number;
  name?: string;
  [key: string]: any;
}

// Helpers to get fresh env values on every request
const getApiBase = () => process.env.ALPARI_API_BASE_URL || "https://api.alpariportal.com";
const getPrivateToken = () => process.env.ALPARI_PRIVATE_TOKEN || "03764376-ec54-4a11-94aa-7c63d39d1f2f";
const getDirectPartnerId = () => Number(process.env.ALPARI_DIRECT_PARTNER_ID || "72725");

/**
 * Method 1: Fetch Client Performance
 */
export async function fetchClientPerformance(params: AlpariApiParams): Promise<AlpariClientPerformance[]> {
  const res = await fetch(`${getApiBase()}/v1/External/client/performance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Private-Token": getPrivateToken(),
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error(`Performance API error: ${res.status} ${res.statusText}`);
  }

  const resData = await res.json();
  return Array.isArray(resData) ? resData : (resData.Data || resData.data || resData.clients || []);
}

/**
 * Method 2: Fetch Client Referral Details
 */
export async function fetchClientReferralDetails(params: AlpariApiParams): Promise<AlpariClientReferral[]> {
  const res = await fetch(`${getApiBase()}/v1/External/client/referral_details`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Private-Token": getPrivateToken(),
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error(`Referrals API error: ${res.status} ${res.statusText}`);
  }

  const resData = await res.json();
  return Array.isArray(resData) ? resData : (resData.Data || resData.data || resData.clients || []);
}

/**
 * Method 3: Fetch Client Insights
 */
export async function fetchClientInsights(params: AlpariApiParams): Promise<AlpariClientInsight[]> {
  const res = await fetch(`${getApiBase()}/v1/External/client/insights`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Private-Token": getPrivateToken(),
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error(`Insights API error: ${res.status} ${res.statusText}`);
  }

  const resData = await res.json();
  return Array.isArray(resData) ? resData : (resData.Data || resData.data || resData.clients || []);
}

/**
 * Method 4: Consolidated Leaderboard compiler
 * Fetches all 3 endpoints, merges the metrics per client, and returns sorted Trader list.
 */
export async function getIntegratedLeaderboard(timeframe: "all" | "monthly" | "weekly" | "daily"): Promise<any[]> {
  // 1. Calculate dynamic date ranges based on timeframe
  const now = new Date();
  const toDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
  
  let fromDate = "2000-01-01"; // default for 'all'
  let customToDate = toDate;

  if (timeframe === "all") {
    // Exact dates requested by the user
    fromDate = "2000-01-01";
    customToDate = "2026-04-01"; // "01/04/2026"
  } else if (timeframe === "daily") {
    const date = new Date();
    date.setDate(now.getDate() - 1);
    fromDate = date.toISOString().split("T")[0];
  } else if (timeframe === "weekly") {
    const date = new Date();
    date.setDate(now.getDate() - 7);
    fromDate = date.toISOString().split("T")[0];
  } else if (timeframe === "monthly") {
    const date = new Date();
    date.setDate(now.getDate() - 30);
    fromDate = date.toISOString().split("T")[0];
  }

  const params: AlpariApiParams = {
    RegistrationFromDate: formatDateForApi(fromDate),
    RegistrationToDate: formatDateForApi(customToDate),
    DirectPartnerId: getDirectPartnerId(),
  };


  // 2. Fetch from all three APIs in parallel
  const [performances, referrals, insights] = await Promise.all([
    fetchClientPerformance(params),
    fetchClientReferralDetails(params),
    fetchClientInsights(params),
  ]);

  const mergedMap: Record<string, any> = {};

  // Populate from Performance API
  performances.forEach((p) => {
    const id = p.clientId || p.id || p.client_id;
    if (!id) return;
    if (!mergedMap[id]) {
      mergedMap[id] = { id, name: p.name || `Trader ${String(id).substring(0, 6)}` };
    }
    mergedMap[id].profit = Number(p.profit ?? p.performance ?? p.profit_pct ?? 0);
    mergedMap[id].drawdown = Number(p.drawdown ?? p.drawdown_pct ?? 0);
    mergedMap[id].winRate = Number(p.winRate ?? p.win_rate ?? 0);
  });

  // Populate from Referrals API
  referrals.forEach((r) => {
    const id = r.clientId || r.id || r.client_id;
    if (!id) return;
    if (!mergedMap[id]) {
      mergedMap[id] = { id, name: r.name || `Trader ${String(id).substring(0, 6)}` };
    }
    mergedMap[id].badges = Number(r.referralsCount ?? r.badges ?? 0);
  });

  // Populate from Insights API
  insights.forEach((i) => {
    const id = i.clientId || i.id || i.client_id;
    if (!id) return;
    if (!mergedMap[id]) {
      mergedMap[id] = { id, name: i.name || `Trader ${String(id).substring(0, 6)}` };
    }
    if (i.status) mergedMap[id].status = i.status;
    if (i.name) mergedMap[id].name = i.name;
    if (i.badges) mergedMap[id].badges = i.badges;
  });

  // Convert map to list and compile real values
  let tradersList = Object.values(mergedMap).map((t: any, index) => {
    return {
      id: t.id,
      name: t.name || `Trader ${String(t.id).substring(0, 6)}`,
      title: index === 0 ? "Elite Trader" : index < 3 ? "Pro Trader" : "Rising Star",
      profit: Number((t.profit ?? 0).toFixed(2)),
      drawdown: Number((t.drawdown ?? 0).toFixed(2)),
      winRate: Math.round(t.winRate ?? 0),
      badges: t.badges ?? 0,
      status: t.status || "offline",
    };
  });

  // Sort by profit descending
  tradersList.sort((a, b) => b.profit - a.profit);

  // Assign ranks
  tradersList = tradersList.map((t, idx) => ({
    ...t,
    rank: idx + 1,
  }));

  return tradersList;
}

// Helpers
function formatDateForApi(dateStr: string): string {
  // Convert YYYY-MM-DD to DD/MM/YYYY
  const parts = dateStr.split("-");
  if (parts.length !== 3) return "01/01/2000";
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}


