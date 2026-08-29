import { NextResponse } from "next/server";
import { getIntegratedLeaderboard } from "@/lib/alpariApi";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // 1. Secure the endpoint using Vercel's Cron Secret (or query param secret)
    const authHeader = request.headers.get("authorization");
    const { searchParams } = new URL(request.url);
    const secretParam = searchParams.get("secret");

    const isAuthorized =
      process.env.NODE_ENV !== "production" ||
      !process.env.CRON_SECRET ||
      authHeader === `Bearer ${process.env.CRON_SECRET}` ||
      secretParam === process.env.CRON_SECRET;

    if (!isAuthorized) {
      return new Response("Unauthorized", { status: 401 });
    }
    console.log("[Cron Job] Starting sync-deposits background worker...");
    
    // Fetching the full season forces the compiler to sync all records in MongoDB
    const data = await getIntegratedLeaderboard("all", false, true);

    if (clientPromise) {
      const mongoClient = await clientPromise;
      const db = mongoClient.db("tradetalks");
      await db.collection<any>("cron_history").insertOne({
        timestamp: new Date(),
        status: "success",
        syncedCount: data.length,
      });
    }

    console.log(`[Cron Job] Successfully synced ${data.length} records.`);
    return NextResponse.json({ success: true, syncedCount: data.length });
  } catch (error: any) {
    console.error("[Cron Job] Sync-deposits worker error:", error);
    
    if (clientPromise) {
      try {
        const mongoClient = await clientPromise;
        const db = mongoClient.db("tradetalks");
        await db.collection<any>("cron_history").insertOne({
          timestamp: new Date(),
          status: "failed",
          error: error.message || "Cron job execution failed",
        });
      } catch (dbErr) {
        console.error("Failed to write failed cron log:", dbErr);
      }
    }

    return NextResponse.json(
      { error: error.message || "Cron job execution failed" },
      { status: 500 }
    );
  }
}
