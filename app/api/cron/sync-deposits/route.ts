import { NextResponse } from "next/server";
import { getIntegratedLeaderboard } from "@/lib/alpariApi";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // 1. Secure the endpoint using Vercel's Cron Secret
    const authHeader = request.headers.get("authorization");
    if (process.env.NODE_ENV === "production" && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response("Unauthorized", { status: 401 });
    }
    console.log("[Cron Job] Starting sync-deposits background worker...");
    
    // Fetching the full season forces the compiler to sync all records in MongoDB
    const data = await getIntegratedLeaderboard("all", false, true);

    console.log(`[Cron Job] Successfully synced ${data.length} records.`);
    return NextResponse.json({ success: true, syncedCount: data.length });
  } catch (error: any) {
    console.error("[Cron Job] Sync-deposits worker error:", error);
    return NextResponse.json(
      { error: error.message || "Cron job execution failed" },
      { status: 500 }
    );
  }
}
