import { NextResponse } from "next/server";
import { getIntegratedLeaderboard } from "@/lib/alpariApi";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// In-memory cache with stale-while-revalidate strategy
// ---------------------------------------------------------------------------
// The Alpari API is slow (3 external POST calls per timeframe). To fix this:
//  1. Cache responses for 15 minutes (FRESH_TTL).
//  2. Serve stale cache for up to 60 minutes while re-fetching in background.
//  3. On the very first request, pre-warm ALL 4 timeframes in the background
//     so subsequent timeframe switches are instant.
// ---------------------------------------------------------------------------

interface CacheEntry {
  data: any[];
  timestamp: number;
}

const leaderboardCache: Record<string, CacheEntry> = {};
const FRESH_TTL_MS = 60 * 1000;  // 1 min — served without revalidation
const STALE_TTL_MS = 5 * 60 * 1000;  // 5 min — served stale while revalidating

// Track in-flight revalidations to avoid duplicate fetches
const revalidating: Record<string, boolean> = {};

// Whether we've already triggered the initial pre-warm
let hasPreWarmed = false;

/**
 * Background revalidation — fetch fresh data without blocking the response
 */
function backgroundRevalidate(timeframe: string) {
  if (revalidating[timeframe]) return; // already in progress
  revalidating[timeframe] = true;

  console.log(`[Revalidate] Background refresh for "${timeframe}"...`);
  getIntegratedLeaderboard(timeframe as any)
    .then((freshData) => {
      leaderboardCache[timeframe] = { data: freshData, timestamp: Date.now() };
      console.log(`[Revalidate] ✓ "${timeframe}" cache updated (${freshData.length} traders)`);
    })
    .catch((err) => {
      console.error(`[Revalidate] ✗ "${timeframe}" failed:`, err.message);
    })
    .finally(() => {
      revalidating[timeframe] = false;
    });
}

/**
 * Pre-warm all 4 timeframes in background on first request
 */
function preWarmAll() {
  if (hasPreWarmed) return;
  hasPreWarmed = true;

  console.log("[Pre-warm] Warming all 4 timeframes in background...");
  const timeframes = ["all", "monthly", "weekly", "daily"];
  timeframes.forEach((tf) => {
    if (!leaderboardCache[tf]) {
      backgroundRevalidate(tf);
    }
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = (searchParams.get("timeframe") || "monthly") as string;

    if (!["all", "monthly", "weekly", "daily"].includes(timeframe)) {
      return NextResponse.json({ error: "Invalid timeframe parameter" }, { status: 400 });
    }

    const now = Date.now();
    const cached = leaderboardCache[timeframe];

    // ── Cache HIT: Fresh ──
    if (cached && now - cached.timestamp < FRESH_TTL_MS) {
      console.log(`[Cache ✓ Fresh] "${timeframe}" — ${cached.data.length} traders`);
      // Trigger pre-warm for other timeframes
      preWarmAll();
      return NextResponse.json(cached.data);
    }

    // ── Cache HIT: Stale — serve immediately, revalidate in background ──
    if (cached && now - cached.timestamp < STALE_TTL_MS) {
      console.log(`[Cache ~ Stale] "${timeframe}" — serving stale, revalidating...`);
      backgroundRevalidate(timeframe);
      preWarmAll();
      return NextResponse.json(cached.data);
    }

    // ── Cache MISS — must wait for fresh data ──
    console.log(`[Cache ✗ Miss] "${timeframe}" — fetching from Alpari API...`);
    const leaderboardData = await getIntegratedLeaderboard(timeframe as any);

    leaderboardCache[timeframe] = { data: leaderboardData, timestamp: Date.now() };
    console.log(`[Cache ✗ Miss] ✓ "${timeframe}" loaded (${leaderboardData.length} traders)`);

    // Pre-warm remaining timeframes in background
    preWarmAll();

    return NextResponse.json(leaderboardData);
  } catch (error: any) {
    console.error("Leaderboard API Route error:", error);

    // On error, try serving stale cache if available (any age)
    const { searchParams } = new URL(request.url);
    const tf = searchParams.get("timeframe") || "monthly";
    const fallback = leaderboardCache[tf];
    if (fallback) {
      console.log(`[Fallback] Serving stale "${tf}" cache after error`);
      return NextResponse.json(fallback.data);
    }

    return NextResponse.json(
      { error: error.message || "Failed to fetch leaderboard details" },
      { status: 500 }
    );
  }
}
