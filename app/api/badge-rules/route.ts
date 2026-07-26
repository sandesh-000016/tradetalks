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
    description: "Awarded to the top ranked trader each month."
  },
  {
    _id: "Consistent Trader",
    points: 30,
    metric: "volume",
    operator: "gte",
    value: 2.0,
    nextEvaluationTime: new Date("2026-12-30T17:00:00Z").toISOString(),
    recurring: false,
    description: "Awarded for consistent performance throughout the challenge."
  },
  {
    _id: "Most Active Trader",
    points: 40,
    metric: "volume",
    operator: "gte",
    value: 8.0,
    nextEvaluationTime: new Date("2026-12-30T17:00:00Z").toISOString(),
    recurring: false,
    description: "Awarded for highest active volume (settled + unsettled)."
  },
  {
    _id: "Trader of the Week",
    points: 50,
    metric: "profit",
    operator: "gte",
    value: 0,
    nextEvaluationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    recurring: true,
    description: "Recognizing outstanding trading performance of the week."
  },
  {
    _id: "Best Risk Manager",
    points: 50,
    metric: "profit",
    operator: "gte",
    value: 12.0,
    nextEvaluationTime: new Date("2026-12-30T17:00:00Z").toISOString(),
    recurring: false,
    description: "Awarded for excellent risk management and discipline."
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

    const rules = await collection.find({}).toArray();

    if (rules.length === 0) {
      return NextResponse.json(DEFAULT_RULES);
    }

    return NextResponse.json(rules);
  } catch (error: any) {
    console.error("GET Public Badge Rules Error:", error);
    return NextResponse.json(DEFAULT_RULES);
  }
}
