import { NextResponse } from "next/server";
import { getCachedLeaderboard } from "@/lib/alpariApi";

export async function GET() {
  try {
    const traders = await getCachedLeaderboard("all");

    // Return first 10 client IDs so we can pick one to test verify
    const sample = traders.slice(0, 10).map((t: any) => ({
      id: t.id,
      name: t.name,
      totalBalance: t.totalBalance,
      profit: t.profit,
    }));

    return NextResponse.json({ total: traders.length, sample });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch clients" },
      { status: 500 }
    );
  }
}
