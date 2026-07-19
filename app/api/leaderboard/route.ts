import { NextResponse } from "next/server";
import { getIntegratedLeaderboard } from "@/lib/alpariApi";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = (searchParams.get("timeframe") || "monthly") as string;

    if (!["all", "monthly", "weekly", "daily"].includes(timeframe)) {
      return NextResponse.json({ error: "Invalid timeframe parameter" }, { status: 400 });
    }

    console.log(`[Leaderboard API] Fetching live data for "${timeframe}"...`);
    const leaderboardData = await getIntegratedLeaderboard(timeframe as any);

    return NextResponse.json(leaderboardData);
  } catch (error: any) {
    console.error("Leaderboard API Route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch leaderboard details" },
      { status: 500 }
    );
  }
}
