import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session && session.value === "authenticated_token_value";
}

export async function GET() {
  try {
    const defaultSettings = {
      _id: "global_badge_eligibility",
      minVolumePer100NetDeposits: 0.6,
      minEquityForWashout: 1.0
    };
    if (!clientPromise) {
      return NextResponse.json({ success: true, settings: defaultSettings });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db("tradetalks");
    const collection = db.collection<any>("global_settings");

    let settings = await collection.findOne({ _id: "global_badge_eligibility" });
    if (!settings) {
      settings = defaultSettings;
      await collection.insertOne(settings);
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
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
    const { minVolumePer100NetDeposits, minEquityForWashout } = body;

    const mongoClient = await clientPromise;
    const db = mongoClient.db("tradetalks");
    const collection = db.collection<any>("global_settings");

    await collection.updateOne(
      { _id: "global_badge_eligibility" },
      {
        $set: {
          minVolumePer100NetDeposits: Number(minVolumePer100NetDeposits ?? 0.6),
          minEquityForWashout: Number(minEquityForWashout ?? 1.0)
        }
      },
      { upsert: true }
    );

    // Invalidate API cache so leaderboard values recalculate
    try {
      await db.collection<any>("api_cache").deleteOne({ _id: "leaderboard_data" });
    } catch (cacheErr) {
      console.error("Failed to delete cache:", cacheErr);
    }

    return NextResponse.json({ success: true, message: "Global eligibility settings saved." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
