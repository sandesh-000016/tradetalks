import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";

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

    if (!clientPromise) {
      return NextResponse.json({ success: false, error: "Database not connected" }, { status: 500 });
    }

    const { traderId, traderName, badgeName, points, period } = await request.json();
    if (!traderId || !badgeName) {
      return NextResponse.json({ success: false, error: "traderId and badgeName are required" }, { status: 400 });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db("tradetalks");
    const collection = db.collection<any>("awarded_badges");

    // Standardize period if empty
    const awardPeriod = period || "Season 1";

    const result = await collection.updateOne(
      { traderId, badgeName, period: awardPeriod },
      {
        $set: {
          traderName,
          points: Number(points ?? 0),
          evaluatedAt: new Date(),
          approved: true,
          status: "approved"
        }
      },
      { upsert: true }
    );

    // Invalidate leaderboard cache
    await db.collection<any>("api_cache").deleteOne({ _id: "leaderboard_data" });

    return NextResponse.json({
      success: true,
      message: `Successfully awarded "${badgeName}" to ${traderName} for period ${awardPeriod}!`
    });
  } catch (error: any) {
    console.error("Award Badge Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await checkAdminAuth())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!clientPromise) {
      return NextResponse.json({ success: false, error: "Database not connected" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const traderId = searchParams.get("traderId");
    const badgeName = searchParams.get("badgeName");
    const period = searchParams.get("period");

    if (!traderId || !badgeName || !period) {
      return NextResponse.json({ success: false, error: "traderId, badgeName, and period are required" }, { status: 400 });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db("tradetalks");
    const collection = db.collection<any>("awarded_badges");

    await collection.deleteOne({ traderId, badgeName, period });

    // Invalidate leaderboard cache
    await db.collection<any>("api_cache").deleteOne({ _id: "leaderboard_data" });

    return NextResponse.json({
      success: true,
      message: `Successfully revoked "${badgeName}" badge!`
    });
  } catch (error: any) {
    console.error("Revoke Badge Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
