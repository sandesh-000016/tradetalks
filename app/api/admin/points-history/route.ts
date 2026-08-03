import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIntegratedLeaderboard } from "@/lib/alpariApi";

// Helper to verify admin authentication
async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session && session.value === "authenticated_token_value";
}

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("refresh") === "true";

    // Call getIntegratedLeaderboard with timeframe "all" (the full challenge period)
    // and bypassCache if forceRefresh is true.
    const traders = await getIntegratedLeaderboard("all", false, forceRefresh);

    // Sort traders by totalPoints descending, then by profit descending
    const sortedByPoints = [...traders].sort((a, b) => {
      const pointsDiff = (b.totalPoints ?? 0) - (a.totalPoints ?? 0);
      if (pointsDiff !== 0) return pointsDiff;
      return (b.profit ?? 0) - (a.profit ?? 0);
    });

    // Map to include a specific points rank
    const rankedTraders = sortedByPoints.map((t, idx) => ({
      clientId: t.id,
      numericId: t.internalId,
      name: t.name,
      avatar: t.avatar,
      country: t.country,
      totalPoints: t.totalPoints ?? 0,
      earnedBadges: t.earnedBadges || [],
      pointsRank: idx + 1,
      profit: t.profit
    }));

    return NextResponse.json({ success: true, traders: rankedTraders });
  } catch (error: any) {
    console.error("[Points History API GET] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch points history" },
      { status: 500 }
    );
  }
}
