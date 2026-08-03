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

// Memory cache state for leaderboard data
let memoryCache: { timestamp: number; traders: any[] } | null = null;
let isSyncing = false;
const CACHE_DURATION_MS = process.env.NODE_ENV === "development" ? 5000 : (2 * 60 * 60 * 1000); // 5s in dev, 2h in prod

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
  forVerification = false,
  bypassCache = false
): Promise<any[]> {
  const useMock = process.env.USE_MOCK_DATA === "true" && !forVerification;
  console.log(`[Leaderboard API] Fetching "${timeframe}". USE_MOCK_DATA="${process.env.USE_MOCK_DATA}" (resolved: ${useMock}), NODE_ENV="${process.env.NODE_ENV}", bypassCache=${bypassCache}`);

  let rawClients: any[] = [];
  let cacheHit = false;

  if (!useMock && !bypassCache && clientPromise) {
    try {
      const mongoClient = await clientPromise;
      const db = mongoClient.db("tradetalks");
      const cacheDoc = await db.collection<any>("api_cache").findOne({ _id: "leaderboard_data" });
      
      if (cacheDoc) {
        rawClients = cacheDoc.traders;
        cacheHit = true;
        console.log("[Leaderboard API] Serving from MongoDB cache.");
      }
    } catch (err) {
      console.error("[Leaderboard API] Error reading MongoDB cache:", err);
    }
  }

  if (!cacheHit) {
    // 1. Always use the custom season range starting from October 1, 2025
    const SEASON_START_DATE = "2025-10-01"; // Challenge season starts from Oct 1, 2025
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

    if (useMock) {
      try {
        let mockData: any = null;
        if (clientPromise) {
          try {
            const mongoClient = await clientPromise;
            const db = mongoClient.db("tradetalks");
            mockData = await db.collection<any>("mock_data").findOne({ _id: "current_mock_data" });
          } catch (dbErr) {
            console.error("[Leaderboard API] Failed to fetch mock data from MongoDB:", dbErr);
          }
        }

        if (mockData) {
          performances = mockData.performance || [];
          referrals = mockData.referrals || [];
          insights = mockData.insights || [];
        } else {
          // Fallback to local json file
          const fs = require("fs");
          const path = require("path");
          const mockFilePath = path.join(process.cwd(), "test_alpari_responses.json");
          if (fs.existsSync(mockFilePath)) {
            const fileData = JSON.parse(fs.readFileSync(mockFilePath, "utf8"));
            performances = fileData.performance || [];
            referrals = fileData.referrals || [];
            insights = fileData.insights || [];
          }
        }
      } catch (err) {
        console.error("Error reading mock data:", err);
      }
    } else {
      // 2. Fetch Performance and Insights APIs in parallel (referrals is bypassed to reduce response latency)
      const [perfRes, insRes] = await Promise.all([
        fetchClientPerformance(params).catch((err) => {
          console.error("[Leaderboard API] Error fetching performance data:", err.message || err);
          return [];
        }),
        fetchClientInsights(params).catch((err) => {
          console.error("[Leaderboard API] Error fetching insights:", err.message || err);
          hasInsightsData = false;
          return [];
        }),
      ]);

      performances = perfRes;
      referrals = []; // Bypassed for latency optimization
      insights = insRes;
    }

    const getClientKey = (item: any): string => {
      const extId = item.external_client_id || item.externalClientId;
      if (extId) return String(extId).toLowerCase().trim();
      const numId = item.id || item.clientId || item.client_id;
      if (numId) return String(numId).toLowerCase().trim();
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
        
        // Fetch dynamic global settings
        let minEquityThreshold = 1.0;
        try {
          const settings = await db.collection<any>("global_settings").findOne({ _id: "global_badge_eligibility" });
          if (settings) {
            minEquityThreshold = Number(settings.minEquityForWashout ?? 1.0);
          }
        } catch (settingsErr) {
          console.error("[Leaderboard API] Failed to load global settings:", settingsErr);
        }

        const tradersCol = db.collection<any>("traders");
        
        // Fetch current database state
        const dbList = await tradersCol.find({}).toArray();
        const dbMap = new Map(dbList.map((d: any) => [d.clientId || d._id, d]));

        // Ensure all registered traders from MongoDB are included in mergedMap
        dbList.forEach((dbTrader: any) => {
          if (!dbTrader.isRegistered) return;
          const clientId = dbTrader.clientId || dbTrader._id;
          if (!clientId) return;
          
          const key = clientId.toLowerCase().trim();
          if (!mergedMap[key]) {
            mergedMap[key] = {
              id: key,
              external_client_id: clientId,
              numeric_id: dbTrader.numericId || 0,
              client_name: dbTrader.clientName || `Trader ${clientId.substring(0, 8)}`,
              country: dbTrader.country || "India",
              registration_date: dbTrader.registrationDate || dbTrader.lastUpdated || new Date().toISOString(),
              total_balance: dbTrader.lastRecordedBalance ?? 100,
              total_equity: dbTrader.lastRecordedBalance ?? 100,
              volume: dbTrader.volume ?? 0,
              settled_rebates: dbTrader.settledRebates ?? 0,
              is_registered: true,
              is_washed_out: dbTrader.isWashedOut || false,
              mt_net_deposits: dbTrader.totalNetDeposits ?? 100
            };
          }
          // Copy database TWR values to the merged map for later profit calculations
          mergedMap[key].twr_factor = dbTrader.twrFactor;
          mergedMap[key].starting_balance_of_this_period = dbTrader.startingBalanceOfThisPeriod;
        });
        
        const bulkOps: any[] = [];
        
        for (const key of Object.keys(mergedMap)) {
          const trader = mergedMap[key];
          const clientId = trader.external_client_id || key;
          const dbTrader = dbMap.get(clientId);
          
          // Only sync and save if they are registered in our DB!
          if (!dbTrader || !dbTrader.isRegistered) {
            trader.is_registered = false;
            continue;
          }
          const volume = trader.volume ?? 0;
          const netDepositValue = trader.mt_net_deposits || dbTrader.totalNetDeposits || 100;
          const rawApiBalance = (volume === 0 || trader.total_balance === undefined)
            ? netDepositValue
            : trader.total_balance;
          const simOffset = dbTrader.simulatedBalanceOffset ?? 0;
          const apiBalance = rawApiBalance + simOffset;
          trader.total_balance = apiBalance;
          const apiEquity = (volume === 0 || trader.total_equity === undefined)
            ? apiBalance
            : (Number(trader.total_equity) + simOffset);
          const apiDepositDate = trader.last_deposit_date || null;
          
          // Preserve registration-time deposit, fallback to starting balance or current balance
          let totalNetDeposits = dbTrader.totalNetDeposits ?? dbTrader.lastRecordedBalance ?? apiBalance ?? 100;

          // If the database has 100 (old hardcoded default) but the Alpari API returns a real tracked deposit, update it!
          if (totalNetDeposits === 100 && trader.mt_net_deposits && trader.mt_net_deposits > 0) {
            totalNetDeposits = trader.mt_net_deposits;
          }

          let isWashedOut = dbTrader.isWashedOut || (apiEquity <= minEquityThreshold);
          
          // Detect new deposit
          if (apiDepositDate && apiDepositDate !== dbTrader.lastDepositDate) {
            const depositDiff = apiBalance - (dbTrader.lastRecordedBalance ?? 0);
            if (depositDiff > 0) {
              totalNetDeposits += depositDiff;
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
          trader.is_registered = true;

          // Track Time-Weighted Return (TWR) cash flows
          let twrFactor = dbTrader.twrFactor ?? 1.0;
          let startingBalanceOfThisPeriod = dbTrader.startingBalanceOfThisPeriod ?? netDeposit;
          
          if (trader.total_balance !== undefined) {
            if (netDeposit !== dbTrader.totalNetDeposits && dbTrader.totalNetDeposits !== undefined) {
              // If previous deposit was default 100 placeholder or uninitialized, re-baseline cleanly
              if (dbTrader.totalNetDeposits === 100 || !dbTrader.twrFactor) {
                twrFactor = 1.0;
                startingBalanceOfThisPeriod = netDeposit;
              } else {
                const cashFlow = netDeposit - dbTrader.totalNetDeposits;
                const balanceBefore = apiBalance - cashFlow;
                
                let periodReturn = 0;
                if (startingBalanceOfThisPeriod > 0) {
                  periodReturn = (balanceBefore - startingBalanceOfThisPeriod) / startingBalanceOfThisPeriod;
                }
                
                twrFactor = twrFactor * (1 + periodReturn);
                startingBalanceOfThisPeriod = apiBalance;
              }
            }
          }
          
          let twrProfit = 0;
          if (startingBalanceOfThisPeriod > 0) {
            const currentPeriodReturn = (apiBalance - startingBalanceOfThisPeriod) / startingBalanceOfThisPeriod;
            twrProfit = (twrFactor * (1 + currentPeriodReturn) - 1) * 100;
          }

          bulkOps.push({
            updateOne: {
              filter: { _id: clientId },
              update: {
                $set: {
                  clientId,
                  numericId: Number(numId ?? 0),
                  clientName: trader.client_name || dbTrader.clientName || "",
                  totalNetDeposits: netDeposit,
                  lastRecordedBalance: apiBalance,
                  lastDepositDate: apiDepositDate,
                  isWashedOut,
                  lastUpdated: new Date(),
                  twrFactor,
                  startingBalanceOfThisPeriod,
                  profit: Number(twrProfit.toFixed(2)),
                  volume: Number(volume)
                }
              }
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

    if (useMock || !useDb || !mongoClient) {
      for (const key of Object.keys(mergedMap)) {
        mergedMap[key].is_registered = true;
      }
    }

    rawClients = Object.values(mergedMap);

    // Save to Cache
    if (!useMock) {
      memoryCache = { timestamp: Date.now(), traders: rawClients };
      if (useDb && mongoClient) {
        try {
          const db = mongoClient.db("tradetalks");
          await db.collection<any>("api_cache").updateOne(
            { _id: "leaderboard_data" },
            { $set: { traders: rawClients, updatedAt: new Date() } },
            { upsert: true }
          );
          console.log("[Leaderboard API] Saved fresh live data to MongoDB cache.");
        } catch (cacheErr) {
          console.error("[Leaderboard API] Failed to write cache to MongoDB:", cacheErr);
        }
      }
    }
  }

  // Convert map to list and compile real values
  let tradersList = rawClients
    .filter((t: any) => {
      // For verification, we bypass all date, washout, and deposit filters
      if (forVerification) {
        return true;
      }

      // 0. Only show registered/verified traders
      if (!t.is_registered) return false;

      // 1. Must be registered within the season: October 1, 2025 to December 30, 2026
      if (!t.registration_date) return false;
      const regDate = new Date(t.registration_date);
      const cutoffDate = new Date("2025-09-30T23:59:59");
      const endCutoffDate = new Date("2026-12-30T23:59:59");
      if (regDate <= cutoffDate || regDate > endCutoffDate) return false;

      // 2. Washout Filter: If a trader is washed out, they are disqualified and out of the leaderboard
      if (t.is_washed_out) return false;

      // 3. Minimum Deposit Filter: Must have deposited at least $100
      if ((t.mt_net_deposits ?? 0) < 100) return false;

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
    const totalEquity = t.total_equity || mtNetDeposits || 100;
    const totalBalance = t.total_balance || mtNetDeposits || 100;

    let profit = 0;
    let tradesCount = 0;

    // Generate a deterministic numeric seed from numeric_id or hash the string id
    const getNumericSeed = (trader: any) => {
      const num = Number(trader.numeric_id);
      if (!isNaN(num) && num > 0) return num;
      
      const str = String(trader.id || "");
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash);
    };

    const seed = getNumericSeed(t);

    if (useMock) {
      const idFactor = (seed % 30) + 5; // value between 5 and 35
      const isNegative = (seed % 3) === 0; // 33% chance of being negative
      const baseProfit = (volume * 1.5) + (settledRebates * 0.5) + (idFactor * 0.2);
      profit = isNegative ? -baseProfit : baseProfit;
      tradesCount = volume > 0 ? Math.max(1, Math.round(volume * 6 + (seed % 5))) : 0;
    } else {
      // Real TWR profit calculation:
      const currentBalance = totalBalance || totalEquity;
      const twrFactor = t.twr_factor ?? 1.0;
      const startingBalanceOfThisPeriod = t.starting_balance_of_this_period ?? mtNetDeposits;
      
      let currentPeriodReturn = 0;
      if (startingBalanceOfThisPeriod > 0) {
        currentPeriodReturn = (currentBalance - startingBalanceOfThisPeriod) / startingBalanceOfThisPeriod;
      }
      profit = (twrFactor * (1 + currentPeriodReturn) - 1) * 100;
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
      isRegistered: t.is_registered ?? false,
      isWashedOut: t.is_washed_out ?? false,
    };
  });

  // 1. Sort by profit descending — null/undefined profits treated as 0 (go to bottom)
  tradersList.sort((a, b) => (b.profit ?? 0) - (a.profit ?? 0));

  // 2. Fetch approved badges from database and merge them
  let dbBadgesList: any[] = [];
  try {
    if (clientPromise) {
      const mongoClient = await clientPromise;
      const db = mongoClient.db("tradetalks");
      dbBadgesList = await db.collection<any>("awarded_badges").find({ approved: true }).toArray();
    }
  } catch (dbErr) {
    console.error("[Leaderboard API] Error loading badges from DB:", dbErr);
  }

  // Group badges by traderId
  const traderBadgesMap: Record<string, { badgeNames: string[]; points: number }> = {};
  dbBadgesList.forEach((b) => {
    const key = String(b.traderId);
    if (!traderBadgesMap[key]) {
      traderBadgesMap[key] = { badgeNames: [], points: 0 };
    }
    traderBadgesMap[key].badgeNames.push(b.badgeName);
    traderBadgesMap[key].points += Number(b.points ?? 0);
  });

  tradersList = tradersList.map((t, idx) => {
    const rank = idx + 1;
    
    // Look up in our map using all possible client IDs
    const idKey = String(t.id);
    const internalIdKey = t.internalId ? String(t.internalId) : "";
    const externalClientIdKey = t.externalClientId ? String(t.externalClientId) : "";

    const badgeInfo =
      traderBadgesMap[idKey] ||
      traderBadgesMap[internalIdKey] ||
      traderBadgesMap[externalClientIdKey] ||
      { badgeNames: [], points: 0 };

    return {
      ...t,
      rank,
      earnedBadges: badgeInfo.badgeNames, // list of all earned badges including repetitions
      totalPoints: badgeInfo.points,
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

export async function verifyAlpariClientDirect(clientIdStr: string): Promise<any | null> {
  const input = clientIdStr.trim().toLowerCase();

  // 1. Query MongoDB first
  if (clientPromise) {
    try {
      const mongoClient = await clientPromise;
      const db = mongoClient.db("tradetalks");
      const dbTrader = await db.collection<any>("traders").findOne({
        $or: [
          { _id: input },
          { clientId: { $regex: new RegExp(`^${input}$`, "i") } },
          { numericId: isNaN(Number(input)) ? -1 : Number(input) }
        ]
      });

      if (dbTrader && dbTrader.isRegistered) {
        console.log(`[Verify Direct] Client '${clientIdStr}' found and already registered in MongoDB.`);
        return {
          id: dbTrader.clientId || dbTrader._id,
          name: dbTrader.clientName,
          balance: dbTrader.lastRecordedBalance ?? 0
        };
      }

      // 1b. Check api_cache leaderboard_data (contains all partner clients, registered or not)
      const cacheDoc = await db.collection<any>("api_cache").findOne({ _id: "leaderboard_data" });
      if (cacheDoc && Array.isArray(cacheDoc.traders)) {
        const found = cacheDoc.traders.find((t: any) => {
          const extId = t.external_client_id || t.clientId || t.id;
          const numId = t.numeric_id || t.id;
          return String(extId || "").toLowerCase() === input || String(numId || "").toLowerCase() === input;
        });
        
        if (found) {
          console.log(`[Verify Direct] Client '${clientIdStr}' found in cached api_cache leaderboard_data. Writing to traders col...`);
          
          const extId = found.external_client_id || found.id || input;
          const numId = found.numeric_id || found.id || 0;
          const clientName = found.client_name || `Trader ${extId}`;
          const balance = Number(found.total_balance ?? 0);

          let minEquityThreshold = 1.0;
          try {
            const settings = await db.collection<any>("global_settings").findOne({ _id: "global_badge_eligibility" });
            if (settings) {
              minEquityThreshold = Number(settings.minEquityForWashout ?? 1.0);
            }
          } catch (settingsErr) {
            console.error("[Verify Direct] Failed to load global settings:", settingsErr);
          }

          await db.collection<any>("traders").updateOne(
            { _id: extId },
            {
              $set: {
                clientId: extId,
                numericId: Number(numId),
                clientName,
                totalNetDeposits: balance > 0 ? balance : 100,
                lastRecordedBalance: balance,
                isWashedOut: false,
                isRegistered: true,
                lastUpdated: new Date(),
                profit: 0,
                volume: 0
              },
              $setOnInsert: {
                twrFactor: 1.0,
                startingBalanceOfThisPeriod: balance > 0 ? balance : 100
              }
            },
            { upsert: true }
          );

          // Clear the cache so they show up in the leaderboard
          await db.collection<any>("api_cache").deleteOne({ _id: "leaderboard_data" });
          memoryCache = null;

          // Warm up cache in background
          getIntegratedLeaderboard("monthly", false, true)
            .then(() => console.log("[Verify Direct] Warmup cache build complete!"))
            .catch((e) => console.error("[Verify Direct] Warmup cache build failed:", e));

          return {
            id: extId,
            name: clientName,
            balance
          };
        }
      }
    } catch (err) {
      console.error("[Verify Direct] MongoDB lookup error:", err);
    }
  }

  // 2. Fetch insights directly from Alpari API (only if not found in MongoDB or api_cache)
  console.log(`[Verify Direct] Client '${clientIdStr}' not in DB or cache. Querying Alpari Insights API...`);
  
  const SEASON_START_DATE = "2025-10-01"; 
  const SEASON_END_DATE = "2026-12-30";

  // Check recent range first to speed up API responses for new clients
  const now = new Date();
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(now.getDate() - 60);
  const recentStartDate = sixtyDaysAgo.toISOString().split("T")[0];
  const recentEndDate = now.toISOString().split("T")[0];

  const tryFetchAndVerify = async (startDate: string, endDate: string) => {
    const params: AlpariApiParams = {
      RegistrationFromDate: formatDateForApi(startDate),
      RegistrationToDate: formatDateForApi(endDate),
      DirectPartner: getDirectPartnerId(),
    };
    const insights = await fetchClientInsights(params);
    return insights.find((i: any) => {
      const extId = i.external_client_id || i.externalClientId || i.clientId || i.id;
      const numId = i.id || i.clientId || i.client_id;
      return String(extId || "").toLowerCase() === input || String(numId || "").toLowerCase() === input;
    });
  };

  try {
    // Attempt fast query of recent registrations first
    let foundInsight = await tryFetchAndVerify(recentStartDate, recentEndDate);
    if (!foundInsight) {
      console.log(`[Verify Direct] Client '${clientIdStr}' not found in recent 60-day range. Fetching full season...`);
      foundInsight = await tryFetchAndVerify(SEASON_START_DATE, SEASON_END_DATE);
    }

    if (foundInsight) {
      const extId = foundInsight.external_client_id || foundInsight.externalClientId || foundInsight.clientId || foundInsight.id || input;
      const numId = foundInsight.id || foundInsight.clientId || foundInsight.client_id || 0;
      const clientName = foundInsight.client_name || foundInsight.name || `Trader ${extId}`;
      const balance = Number(foundInsight.total_balance ?? 0);

      // Save/upsert to MongoDB so it's cached for future lookups
      if (clientPromise) {
        try {
          const mongoClient = await clientPromise;
          const db = mongoClient.db("tradetalks");
          
          let minEquityThreshold = 1.0;
          try {
            const settings = await db.collection<any>("global_settings").findOne({ _id: "global_badge_eligibility" });
            if (settings) {
              minEquityThreshold = Number(settings.minEquityForWashout ?? 1.0);
            }
          } catch (settingsErr) {
            console.error("[Verify Direct] Failed to load global settings:", settingsErr);
          }

          await db.collection<any>("traders").updateOne(
            { _id: extId },
            {
              $set: {
                clientId: extId,
                numericId: Number(numId),
                clientName,
                totalNetDeposits: balance > 0 ? balance : 100,
                lastRecordedBalance: balance,
                isWashedOut: false,
                isRegistered: true,
                lastUpdated: new Date(),
                profit: 0,
                volume: 0
              },
              $setOnInsert: {
                twrFactor: 1.0,
                startingBalanceOfThisPeriod: balance > 0 ? balance : 100
              }
            },
            { upsert: true }
          );
          
          // Clear the leaderboard cache so they show up immediately
          await db.collection<any>("api_cache").deleteOne({ _id: "leaderboard_data" });
          memoryCache = null;
          
          // Warm up the leaderboard cache in the background immediately!
          getIntegratedLeaderboard("monthly", false, true)
            .then(() => console.log("[Verify Direct] Warmup cache build complete!"))
            .catch((e) => console.error("[Verify Direct] Warmup cache build failed:", e));
          
          console.log(`[Verify Direct] Saved newly verified client '${extId}' to MongoDB, invalidated cache, and triggered warmup.`);
        } catch (dbErr) {
          console.error("[Verify Direct] Failed to write verified client to MongoDB:", dbErr);
        }
      }

      return {
        id: extId,
        name: clientName,
        balance
      };
    }
  } catch (apiErr: any) {
    console.error("[Verify Direct] Alpari API insights call failed:", apiErr.message || apiErr);
  }

  return null;
}


