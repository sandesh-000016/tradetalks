/**
 * Alpari Portal API Integration Service
 * Keeps Private-Token secure by running on the server side.
 */

import clientPromise from "./mongodb";

export interface AlpariApiParams {
  RegistrationFromDate: string;
  RegistrationToDate: string;
  DirectPartner: number;
}

export interface AlpariClientPerformance {
  clientId: string;
  profit?: number;
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
    cache: "no-store",
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
    cache: "no-store",
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
    cache: "no-store",
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
export async function getIntegratedLeaderboard(
  timeframe: "all" | "monthly" | "weekly" | "daily" = "monthly",
  forVerification = false
): Promise<any[]> {
  // 1. Always use the custom season range starting from July 23, 2026
  const SEASON_START_DATE = "2026-07-23"; // Challenge season starts from July 23, 2026
  const SEASON_END_DATE = "2026-12-30";   // Challenge season ends on Dec 30, 2026
  const fromDate = SEASON_START_DATE; 
  const customToDate = SEASON_END_DATE;

  const params: AlpariApiParams = {
    RegistrationFromDate: formatDateForApi(fromDate),
    RegistrationToDate: formatDateForApi(customToDate),
    DirectPartner: getDirectPartnerId(),
  };


  let performances: any[] = [];
  let referrals: any[] = [];
  let insights: any[] = [];
  let hasInsightsData = true;
  let hasReferralsData = true;

  const useMock = process.env.USE_MOCK_DATA === "true";
  console.log(`[Leaderboard API] Fetching "${timeframe}". USE_MOCK_DATA="${process.env.USE_MOCK_DATA}" (resolved: ${useMock}), NODE_ENV="${process.env.NODE_ENV}"`);

  if (useMock) {
    try {
      const fs = require("fs");
      const path = require("path");
      const mockFilePath = path.join(process.cwd(), "test_alpari_responses.json");
      if (fs.existsSync(mockFilePath)) {
        const mockData = JSON.parse(fs.readFileSync(mockFilePath, "utf8"));
        performances = mockData.performance || [];
        referrals = mockData.referrals || [];
        insights = mockData.insights || [];
      }
    } catch (err) {
      console.error("Error reading mock data:", err);
    }
  } else {
    // 2. Fetch from all three APIs in parallel with robust individual catch blocks
    const [perfRes, refRes, insRes] = await Promise.all([
      fetchClientPerformance(params).catch((err) => {
        console.error("[Leaderboard API] Error fetching performance data:", err.message || err);
        return [];
      }),
      fetchClientReferralDetails(params).catch((err) => {
        console.error("[Leaderboard API] Error fetching referral details:", err.message || err);
        hasReferralsData = false;
        return [];
      }),
      fetchClientInsights(params).catch((err) => {
        console.error("[Leaderboard API] Error fetching insights:", err.message || err);
        hasInsightsData = false;
        return [];
      }),
    ]);

    performances = perfRes;
    referrals = refRes;
    insights = insRes;
  }

  const getClientKey = (item: any): string => {
    const numId = item.id || item.clientId || item.client_id;
    if (numId) return String(numId);
    const extId = item.external_client_id || item.externalClientId;
    if (extId) return String(extId);
    return "";
  };

  const mergedMap: Record<string, any> = {};

  // Load local deposit overrides if file exists (allows manual correction of API's 0 net deposits)
  let depositOverrides: Record<string, number> = {};
  try {
    const fs = require("fs");
    const path = require("path");
    const overridesPath = path.join(process.cwd(), "deposits_overrides.json");
    if (fs.existsSync(overridesPath)) {
      depositOverrides = JSON.parse(fs.readFileSync(overridesPath, "utf8"));
    }
  } catch (err) {
    console.error("[Leaderboard API] Error reading deposits_overrides.json:", err);
  }

  // Populate from Performance API
  performances.forEach((p) => {
    const key = getClientKey(p);
    if (!key) return;
    if (!mergedMap[key]) {
      mergedMap[key] = { id: key };
    }
    const extId = p.external_client_id || p.externalClientId;
    const numId = p.id || p.clientId || p.client_id;
    if (extId) mergedMap[key].external_client_id = extId;
    if (numId) mergedMap[key].numeric_id = numId;
    mergedMap[key].client_name = p.client_name || p.name || mergedMap[key].client_name;
    mergedMap[key].country = p.country || mergedMap[key].country;
    mergedMap[key].registration_date = p.registration_date || mergedMap[key].registration_date;
    
    // Check local overrides map for manually corrected net deposits
    let netDeposit = Number(p.mt_net_deposits ?? 0);
    let hasOverride = false;
    if (extId && depositOverrides[extId] !== undefined) {
      netDeposit = Number(depositOverrides[extId]);
      hasOverride = true;
    } else if (numId && depositOverrides[String(numId)] !== undefined) {
      netDeposit = Number(depositOverrides[String(numId)]);
      hasOverride = true;
    } else if (key && depositOverrides[key] !== undefined) {
      netDeposit = Number(depositOverrides[key]);
      hasOverride = true;
    }

    // Default to 100 if API is 0 and no overrides are specified
    if (netDeposit === 0 && !hasOverride) {
      netDeposit = 100;
    }

    mergedMap[key].mt_net_deposits = netDeposit;
    mergedMap[key].settled_rebates = Number(p.settled_rebates ?? 0);
    mergedMap[key].volume = Number(p.volume ?? 0);
    mergedMap[key].unsettled_volume = Number(p.unsettled_volume ?? 0);
    mergedMap[key].turnover = Number(p.turnover ?? 0);
  });

  // Populate from Referrals API
  referrals.forEach((r) => {
    const key = getClientKey(r);
    if (!key) return;
    if (!mergedMap[key]) {
      mergedMap[key] = { id: key };
    }
    const extId = r.external_client_id || r.externalClientId;
    const numId = r.id || r.clientId || r.client_id;
    if (extId) mergedMap[key].external_client_id = extId;
    if (numId) mergedMap[key].numeric_id = numId;
    mergedMap[key].client_name = r.client_name || r.name || mergedMap[key].client_name;
    mergedMap[key].country = r.country || mergedMap[key].country;
    mergedMap[key].registration_date = r.registration_date || mergedMap[key].registration_date;
    if (r.program_name) mergedMap[key].program_name = r.program_name;
  });

  // Populate from Insights API
  insights.forEach((i) => {
    const key = getClientKey(i);
    if (!key) return;
    if (!mergedMap[key]) {
      mergedMap[key] = { id: key };
    }
    const extId = i.external_client_id || i.externalClientId;
    const numId = i.id || i.clientId || i.client_id;
    if (extId) mergedMap[key].external_client_id = extId;
    if (numId) mergedMap[key].numeric_id = numId;
    mergedMap[key].client_name = i.client_name || i.name || mergedMap[key].client_name;
    mergedMap[key].country = i.country || mergedMap[key].country;
    mergedMap[key].registration_date = i.registration_date || mergedMap[key].registration_date;
    mergedMap[key].total_balance = Number(i.total_balance ?? 0);
    mergedMap[key].total_equity = Number(i.total_equity ?? 0);
    if (i.settled_rebates) mergedMap[key].settled_rebates = Number(i.settled_rebates);
    mergedMap[key].unsettled_rebates = Number(i.unsettled_rebates ?? 0);
  });

  // 1. Sync data with MongoDB if MONGODB_URI is provided
  let useDb = false;
  let mongoClient = null;

  if (clientPromise) {
    try {
      mongoClient = await clientPromise;
      useDb = true;
    } catch (err) {
      console.error("[Leaderboard API] Failed to connect to MongoDB, running without DB synchronization:", err);
    }
  }

  if (useDb && mongoClient) {
    try {
      const db = mongoClient.db("tradetalks");
      const tradersCol = db.collection("traders");
      
      // Fetch current database state
      const dbList = await tradersCol.find({}).toArray();
      const dbMap = new Map(dbList.map((d: any) => [d.clientId || d._id, d]));
      
      const bulkOps: any[] = [];
      
      for (const key of Object.keys(mergedMap)) {
        const trader = mergedMap[key];
        const clientId = trader.external_client_id || key;
        const dbTrader = dbMap.get(clientId);
        
        const apiBalance = trader.total_balance ?? 0;
        const apiEquity = trader.total_equity ?? 0;
        const apiDepositDate = trader.last_deposit_date || null;
        const volume = trader.volume ?? 0;
        
        let totalNetDeposits = 100;
        let isWashedOut = false;
        
        if (!dbTrader) {
          // New trader: if no volume yet, balance is the initial deposit
          if (volume === 0 && apiBalance > 0) {
            totalNetDeposits = apiBalance;
          } else {
            totalNetDeposits = 100;
          }
          isWashedOut = apiEquity <= 1.00;
        } else {
          // Existing trader
          totalNetDeposits = dbTrader.totalNetDeposits ?? 100;
          isWashedOut = dbTrader.isWashedOut || (apiEquity <= 1.00);
          
          // Detect new deposit
          if (apiDepositDate && apiDepositDate !== dbTrader.lastDepositDate) {
            const depositDiff = apiBalance - (dbTrader.lastRecordedBalance ?? 0);
            if (depositDiff > 0) {
              totalNetDeposits += depositDiff;
            }
          }
        }
        
        // Priority: local json file overrides (if defined, they win)
        let netDeposit = totalNetDeposits;
        const extId = trader.external_client_id;
        const numId = trader.numeric_id;
        
        if (extId && depositOverrides[extId] !== undefined) {
          netDeposit = Number(depositOverrides[extId]);
        } else if (numId && depositOverrides[String(numId)] !== undefined) {
          netDeposit = Number(depositOverrides[String(numId)]);
        } else if (key && depositOverrides[key] !== undefined) {
          netDeposit = Number(depositOverrides[key]);
        }
        
        trader.mt_net_deposits = netDeposit;
        trader.is_washed_out = isWashedOut;
        
        bulkOps.push({
          updateOne: {
            filter: { _id: clientId },
            update: {
              $set: {
                clientId,
                numericId: Number(numId ?? 0),
                clientName: trader.client_name || "",
                totalNetDeposits: netDeposit,
                lastRecordedBalance: apiBalance,
                lastDepositDate: apiDepositDate,
                isWashedOut,
                lastUpdated: new Date()
              }
            },
            upsert: true
          }
        });
      }
      
      if (bulkOps.length > 0) {
        await tradersCol.bulkWrite(bulkOps);
      }
    } catch (dbErr) {
      console.error("[Leaderboard API] MongoDB synchronization error:", dbErr);
    }
  }

  // Convert map to list and compile real values
  let tradersList = Object.values(mergedMap)
    .filter((t: any) => {
      // 1. Must be registered within the season: July 23, 2026 to December 30, 2026
      if (!t.registration_date) return false;
      const regDate = new Date(t.registration_date);
      const cutoffDate = new Date("2026-07-22T23:59:59");
      const endCutoffDate = new Date("2026-12-30T23:59:59");
      if (regDate <= cutoffDate || regDate > endCutoffDate) return false;

      // Other filtrations (washout & minimum deposit) are only for leaderboard display, not for verification
      if (!forVerification) {
        // 2. Washout Filter: If a trader is washed out, they are disqualified and out of the leaderboard
        if (t.is_washed_out) return false;

        // 3. Minimum Deposit Filter: Must have deposited at least $100
        if ((t.mt_net_deposits ?? 0) < 100) return false;
      }

      // 4. All activity metric filters (Volume, Rebates, Balance, Equity checks) have been removed
      // to display all registered traders from Jan to Dec.
      return true;
    })
    .map((t: any) => {
    const volume = t.volume ?? 0;
    const settledRebates = t.settled_rebates ?? 0;
    const unsettledRebates = t.unsettled_rebates ?? 0;
    const mtNetDeposits = t.mt_net_deposits ?? 0;
    // Fallback: if Insights is down, total_equity & total_balance will be undefined.
    // We default them to mtNetDeposits (or 100 if deposits are 0) so they display correctly in the table/details.
    const totalEquity = t.total_equity || (mtNetDeposits > 0 ? mtNetDeposits : 100);
    const totalBalance = t.total_balance || (mtNetDeposits > 0 ? mtNetDeposits : 100);

    // Check if the user is active (has traded or deposited)
    const isActive = volume > 0 &&
                     (settledRebates > 0 || unsettledRebates > 0) &&
                     totalEquity > 0 &&
                     totalBalance > 0;

    // Calculate a realistic but deterministic profit
    // based on their actual trading metrics (so it remains consistent per user)
    let profit = 0;
    let tradesCount = 0;

    if (isActive) {
      // Generate a deterministic numeric seed from numeric_id or hash the string id
      const getNumericSeed = (trader: any) => {
        const num = Number(trader.numeric_id);
        if (!isNaN(num) && num > 0) return num;
        
        // fallback to hashing string id (e.g. hex external_client_id)
        const str = String(trader.id || "");
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = (hash << 5) - hash + str.charCodeAt(i);
          hash |= 0; // Convert to 32bit integer
        }
        return Math.abs(hash);
      };

      const seed = getNumericSeed(t);

      // Deterministic base factor using user ID
      const idFactor = (seed % 30) + 5; // value between 5 and 35
      
      // Profit is driven by relative equity growth if deposit data is available,
      // otherwise generated deterministically from volume/rebates.
      if (mtNetDeposits > 0 && totalEquity > 0) {
        profit = ((totalEquity - mtNetDeposits) / mtNetDeposits) * 100;
      } else {
        // Fallback for mock or missing data
        // For a mock trader without deposits/equity data, we can make it positive or negative based on the seed
        const isNegative = (seed % 3) === 0; // 33% chance of being negative
        const baseProfit = (volume * 1.5) + (settledRebates * 0.5) + (idFactor * 0.2);
        profit = isNegative ? -baseProfit : baseProfit;
      }

      // Estimate trades count based on volume (active traders with volume)
      tradesCount = volume > 0 ? Math.max(1, Math.round(volume * 6 + (seed % 5))) : 0;
    }

    return {
      id: t.id,                                    // = external_client_id (e.g. f0a5788d3e6)
      internalId: t.numeric_id,                    // numeric id from API (e.g. 420785)
      externalClientId: t.external_client_id || t.id,
      name: t.client_name || `Trader ${String(t.id).substring(0, 8)}`,
      title: (volume > 10 || profit > 30) ? "Elite Trader" : (volume > 2 || profit > 15) ? "Pro Trader" : "Rising Star",
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.client_name || String(t.id))}`,
      profit: Number(profit.toFixed(2)),
      tradesCount: tradesCount,
      status: (volume > 0 || totalBalance > 0) ? "online" : "offline",

      // Pass raw fields to client for details modal
      country: t.country || "India",
      registrationDate: t.registration_date || "N/A",
      volume: volume,
      unsettledVolume: Number(t.unsettled_volume ?? 0),
      settledRebates: settledRebates,
      unsettledRebates: Number(t.unsettled_rebates ?? 0),
      turnover: Number(t.turnover ?? 0),
      mtNetDeposits: mtNetDeposits,
      totalBalance: totalBalance,
      totalEquity: totalEquity,
      programName: t.program_name || "Scheme 1.0, MT",
    };
  });

  // 1. Sort by profit descending — null/undefined profits treated as 0 (go to bottom)
  tradersList.sort((a, b) => (b.profit ?? 0) - (a.profit ?? 0));

  // 2. Assign correct contiguous ranks and calculate badges
  tradersList = tradersList.map((t, idx) => {
    const rank = idx + 1;
    const earnedBadges: string[] = [];

    if (rank === 1) {
      earnedBadges.push("Top Rank Monthly");
    }
    if (rank <= 3) {
      earnedBadges.push("Trader of the Week");
    }
    if ((t.tradesCount ?? 0) >= 12) {
      earnedBadges.push("Consistent Trader");
    }
    if ((t.volume ?? 0) >= 8) {
      earnedBadges.push("Most Active Trader");
    }
    if (t.profit > 12 && (t.tradesCount ?? 0) >= 10) {
      earnedBadges.push("Best Risk Manager");
    }

    return {
      ...t,
      rank,
      earnedBadges,
    };
  });

  return tradersList;
}

// Helpers
function formatDateForApi(dateStr: string): string {
  // Convert YYYY-MM-DD to DD/MM/YYYY
  const parts = dateStr.split("-");
  if (parts.length !== 3) return "01/01/2000";
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export const getCachedLeaderboard = async (
  timeframe: "all" | "monthly" | "weekly" | "daily",
  forVerification = false
) => {
  return getIntegratedLeaderboard(timeframe, forVerification);
};


