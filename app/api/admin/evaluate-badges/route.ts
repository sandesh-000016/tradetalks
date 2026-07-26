import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { getIntegratedLeaderboard } from "@/lib/alpariApi";

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session && session.value === "authenticated_token_value";
}

export async function POST(request: Request) {
  try {
    if (!(await checkAdminAuth())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { badgeName } = await request.json();
    if (!badgeName) {
      return NextResponse.json({ success: false, error: "badgeName is required" }, { status: 400 });
    }

    // 1. Fetch badge rule
    let rule: any = null;
    if (clientPromise) {
      const mongoClient = await clientPromise;
      const db = mongoClient.db("tradetalks");
      rule = await db.collection<any>("badge_rules").findOne({ _id: badgeName });
    }

    // Fallback if rule doesn't exist yet
    if (!rule) {
      return NextResponse.json({ success: false, error: `Rule configuration for badge "${badgeName}" not found.` }, { status: 404 });
    }

    // 2. Fetch live metrics from integrated leaderboard (for registered users)
    // We bypass the cache to ensure we evaluate on the absolute latest real-time data
    const traders = await getIntegratedLeaderboard("all", false, true);

    // Helper function to evaluate a single rule condition against trader metrics
    const evaluateCondition = (trader: any, condition: any) => {
      let traderValue = 0;
      switch (condition.metric) {
        case "profit":
          traderValue = trader.profit ?? 0;
          break;
        case "volume":
          traderValue = trader.volume ?? 0;
          break;
        case "settledRebates":
          traderValue = trader.settledRebates ?? 0;
          break;
        case "unsettledRebates":
          traderValue = trader.unsettledRebates ?? 0;
          break;
        case "totalBalance":
          traderValue = trader.totalBalance ?? 0;
          break;
        default:
          traderValue = 0;
      }

      const targetValue = Number(condition.value ?? 0);
      switch (condition.operator) {
        case "gte":
          return traderValue >= targetValue;
        case "lte":
          return traderValue <= targetValue;
        case "gt":
          return traderValue > targetValue;
        case "lt":
          return traderValue < targetValue;
        case "eq":
          return traderValue === targetValue;
        default:
          return false;
      }
    };

    // 3. Evaluate criteria
    const proposedWinners = traders.filter((t) => {
      // Disqualified traders cannot earn badges
      if (t.isWashedOut) return false;

      // Special cases for rank-based badges
      if (badgeName === "Top Rank Monthly") {
        return t.rank === 1;
      }
      if (badgeName === "Trader of the Week") {
        return t.rank <= 3;
      }

      // Check all conditions
      const conditionsList = rule.conditions && Array.isArray(rule.conditions) && rule.conditions.length > 0
        ? rule.conditions
        : [{ metric: rule.metric, operator: rule.operator, value: rule.value }];

      return conditionsList.every((cond: any) => evaluateCondition(t, cond));
    });

    return NextResponse.json({
      success: true,
      badgeName,
      rule,
      proposedWinners: proposedWinners.map(t => ({
        id: t.id,
        name: t.name,
        profit: t.profit,
        volume: t.volume,
        settledRebates: t.settledRebates,
        totalBalance: t.totalBalance,
        rank: t.rank
      }))
    });
  } catch (error: any) {
    console.error("Evaluate Badges Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
