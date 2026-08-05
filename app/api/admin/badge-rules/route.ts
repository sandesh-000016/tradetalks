import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";

const DEFAULT_RULES = [
  {
    _id: "Top Rank Monthly",
    points: 100,
    metric: "profit",
    operator: "gte",
    value: 0,
    nextEvaluationTime: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 17, 0, 0).toISOString(), // End of month, 5 PM
    recurring: true,
    description: "Awarded to the top ranked trader each month.",
    icon: "medal_gold",
    cashPrize: "",
    displayRules: "Achieve the absolute #1 rank in the monthly challenge leaderboard."
  },
  {
    _id: "Consistent Trader",
    points: 30,
    metric: "volume",
    operator: "gte",
    value: 2.0,
    nextEvaluationTime: new Date("2026-12-30T17:00:00Z").toISOString(), // End of season
    recurring: false,
    description: "Awarded for consistent performance throughout the challenge.",
    icon: "shield_green",
    cashPrize: "",
    displayRules: "Maintain a minimum activity level of 12 completed trades."
  },
  {
    _id: "Most Active Trader",
    points: 40,
    metric: "volume",
    operator: "gte",
    value: 8.0,
    nextEvaluationTime: new Date("2026-12-30T17:00:00Z").toISOString(), // End of season
    recurring: false,
    description: "Awarded for highest active volume (settled + unsettled).",
    icon: "shield_blue",
    cashPrize: "",
    displayRules: "Accumulate an aggregate volume (settled + unsettled) of 8.00 Lots or more."
  },
  {
    _id: "Trader of the Week",
    points: 50,
    metric: "profit",
    operator: "gte",
    value: 0,
    nextEvaluationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    recurring: true,
    description: "Recognizing outstanding trading performance of the week.",
    icon: "shield_orange",
    cashPrize: "",
    displayRules: "Secure a Top 3 rank in weekly standings."
  },
  {
    _id: "Best Risk Manager",
    points: 50,
    metric: "profit",
    operator: "gte",
    value: 12.0,
    nextEvaluationTime: new Date("2026-12-30T17:00:00Z").toISOString(), // End of season
    recurring: false,
    description: "Awarded for excellent risk management and discipline.",
    icon: "shield_cyan",
    cashPrize: "",
    displayRules: "Achieve a return above 12% with at least 10 trades."
  },
  {
    _id: "Final Winner",
    points: 500,
    metric: "points",
    operator: "gte",
    value: 400,
    nextEvaluationTime: new Date("2026-12-30T17:00:00Z").toISOString(), // End of season
    recurring: false,
    description: "The trader with the most Top Rank Monthly badges will be crowned the Ultimate FX Champion!",
    icon: "trophy",
    cashPrize: "₹85,000",
    conditions: [
      { metric: "avgPoints", operator: "gte", value: 200 },
      { metric: "avgVolume", operator: "gte", value: 15 },
      { metric: "avgProfit", operator: "gte", value: 20 }
    ],
    displayRules: "Average Points (6-Month) must be at least 200\nAverage Volume (6-Month) must be at least 15 Lots\nAverage Profit ROI (6-Month) must be at least 20%"
  }
];

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session && session.value === "authenticated_token_value";
}

export async function GET() {
  try {
    if (!clientPromise) {
      return NextResponse.json({ success: true, rules: DEFAULT_RULES });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db("tradetalks");
    const collection = db.collection("badge_rules");

    // Fetch existing rules
    let rules = await collection.find({}).toArray();

    // Check if any default rules are missing (e.g. Final Winner added later)
    const missingRules = DEFAULT_RULES.filter(
      (defRule) => !rules.some((rule) => String(rule._id) === String(defRule._id))
    );

    if (missingRules.length > 0) {
      await collection.insertMany(missingRules as any);
      // Refetch after inserting
      rules = await collection.find({}).toArray();
    }

    // Merge default displayRules if not set in MongoDB
    const mergedRules = rules.map(rule => {
      const def = DEFAULT_RULES.find(d => String(d._id) === String(rule._id));
      if (def) {
        return {
          ...def,
          ...rule,
          displayRules: rule.displayRules !== undefined ? rule.displayRules : (def.displayRules || ""),
          showTimer: rule.showTimer !== undefined ? rule.showTimer : true
        };
      }
      return rule;
    });

    return NextResponse.json({ success: true, rules: mergedRules });
  } catch (error: any) {
    console.error("GET Badge Rules Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await checkAdminAuth())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!clientPromise) {
      return NextResponse.json({ success: false, error: "Database not connected" }, { status: 500 });
    }

    const body = await request.json();
    const { _id, points, metric, operator, value, nextEvaluationTime, description, conditions, icon, cashPrize, displayRules, showTimer } = body;

    if (!_id) {
      return NextResponse.json({ success: false, error: "Badge ID required" }, { status: 400 });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db("tradetalks");
    const collection = db.collection("badge_rules");

    const updateDoc: any = {
      points: Number(points ?? 0),
      metric,
      operator,
      value: Number(value ?? 0),
      nextEvaluationTime,
      description,
      icon: icon || "shield_green",
      cashPrize: cashPrize || "",
      displayRules: displayRules || "",
      showTimer: showTimer !== undefined ? !!showTimer : true
    };

    if (Array.isArray(conditions)) {
      updateDoc.conditions = conditions.map((cond: any) => ({
        metric: cond.metric,
        operator: cond.operator,
        value: Number(cond.value ?? 0)
      }));
    }

    await collection.updateOne(
      { _id },
      { $set: updateDoc },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: "Rule updated successfully" });
  } catch (error: any) {
    console.error("POST Badge Rules Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
