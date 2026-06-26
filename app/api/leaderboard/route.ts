import { NextResponse } from "next/server";
import { getIntegratedLeaderboard } from "@/lib/alpariApi";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = (searchParams.get("timeframe") || "monthly") as any;

    if (!["all", "monthly", "weekly", "daily"].includes(timeframe)) {
      return NextResponse.json({ error: "Invalid timeframe parameter" }, { status: 400 });
    }

    const leaderboardData = await getIntegratedLeaderboard(timeframe);
    return NextResponse.json(leaderboardData);
  } catch (error: any) {
    console.error("Leaderboard API Route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch leaderboard details" },
      { status: 500 }
    );
  }
}




