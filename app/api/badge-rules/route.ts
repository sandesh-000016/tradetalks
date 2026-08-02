import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const DEFAULT_RULES = [
  {
    _id: "Top Rank Monthly",
    points: 100,
    metric: "profit",
    operator: "gte",
    value: 0,
    nextEvaluationTime: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 17, 0, 0).toISOString(),
    recurring: true,
    description: "Awarded to the top ranked trader each month.",
    icon: "medal_gold",
    cashPrize: ""
  },
  {
    _id: "Consistent Trader",
    points: 30,
    metric: "volume",
    operator: "gte",
    value: 2.0,
    nextEvaluationTime: new Date("2026-12-30T17:00:00Z").toISOString(),
    recurring: false,
    description: "Awarded for consistent performance throughout the challenge.",
    icon: "shield_green",
    cashPrize: ""
  },
  {
    _id: "Most Active Trader",
    points: 40,
    metric: "volume",
    operator: "gte",
    value: 8.0,
    nextEvaluationTime: new Date("2026-12-30T17:00:00Z").toISOString(),
    recurring: false,
    description: "Awarded for highest active volume (settled + unsettled).",
    icon: "shield_blue",
    cashPrize: ""
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
    cashPrize: ""
  },
  {
    _id: "Best Risk Manager",
    points: 50,
    metric: "profit",
    operator: "gte",
    value: 12.0,
    nextEvaluationTime: new Date("2026-12-30T17:00:00Z").toISOString(),
    recurring: false,
    description: "Awarded for excellent risk management and discipline.",
    icon: "shield_cyan",
    cashPrize: ""
  },
  {
    _id: "Final Winner",
    points: 500,
    metric: "points",
    operator: "gte",
    value: 400,
    nextEvaluationTime: new Date("2026-12-30T17:00:00Z").toISOString(),
    recurring: false,
    description: "The trader with the most Top Rank Monthly badges will be crowned the Ultimate FX Champion!",
    icon: "trophy",
    cashPrize: "$1000",
    conditions: [
      { metric: "avgPoints", operator: "gte", value: 200 },
      { metric: "avgVolume", operator: "gte", value: 15 },
      { metric: "avgProfit", operator: "gte", value: 20 }
    ]
  }
];

export async function GET() {
  try {
    if (!clientPromise) {
      return NextResponse.json(DEFAULT_RULES);
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db("tradetalks");
    const collection = db.collection("badge_rules");

    let rules = await collection.find({}).toArray();

    // Check if any default rules are missing (e.g. Final Winner added later)
    const missingRules = DEFAULT_RULES.filter(
      (defRule) => !rules.some((rule) => String(rule._id) === String(defRule._id))
    );

    if (missingRules.length > 0) {
      await collection.insertMany(missingRules as any);
      rules = await collection.find({}).toArray();
    }

    return NextResponse.json(rules);
  } catch (error: any) {
    console.error("GET Public Badge Rules Error:", error);
    return NextResponse.json(DEFAULT_RULES);
  }
}
