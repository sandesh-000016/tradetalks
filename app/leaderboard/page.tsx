import React from "react";
import LeaderboardClient from "@/components/LeaderboardClient";
import { getCachedLeaderboard } from "@/lib/alpariApi";

// ISR: Cache the leaderboard page and revalidate every 30 minutes.
// Live data updates are still served via client-side API calls in LeaderboardClient.
export const revalidate = 1800; // 30 minutes

export default async function LeaderboardPage() {
  let initialTraders = [];
  try {
    initialTraders = await getCachedLeaderboard("monthly");
  } catch (error) {
    console.error("Failed to load monthly leaderboard on server:", error);
  }

  return <LeaderboardClient initialTraders={initialTraders} />;
}
