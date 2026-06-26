import { NextResponse } from "next/server";
import { getIntegratedLeaderboard } from "@/lib/alpariApi";

export const dynamic = "force-dynamic";

// Global cache object to store leaderboard responses
const leaderboardCache: Record<string, { data: any[]; timestamp: number }> = {};
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = (searchParams.get("timeframe") || "monthly") as any;

    if (!["all", "monthly", "weekly", "daily"].includes(timeframe)) {
      return NextResponse.json({ error: "Invalid timeframe parameter" }, { status: 400 });
    }

    const now = Date.now();
    const cachedEntry = leaderboardCache[timeframe];

    if (cachedEntry && now - cachedEntry.timestamp < CACHE_TTL_MS) {
      console.log(`[Cache Hit] Serving leaderboard for ${timeframe} from memory cache`);
      return NextResponse.json(cachedEntry.data);
    }

    console.log(`[Cache Miss] Fetching leaderboard for ${timeframe} from Alpari API`);
    const leaderboardData = await getIntegratedLeaderboard(timeframe);
    
    // Store in cache
    leaderboardCache[timeframe] = {
      data: leaderboardData,
      timestamp: now,
    };

    return NextResponse.json(leaderboardData);
  } catch (error: any) {
    console.error("Leaderboard API Route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch leaderboard details" },
      { status: 500 }
    );
  }
}
