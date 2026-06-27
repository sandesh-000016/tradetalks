import React from "react";
import LeaderboardClient from "@/components/LeaderboardClient";
import { getCachedLeaderboard } from "@/lib/alpariApi";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  let initialTraders = [];
  try {
    initialTraders = await getCachedLeaderboard("monthly");
  } catch (error) {
    console.error("Failed to load monthly leaderboard on server:", error);
  }

  return <LeaderboardClient initialTraders={initialTraders} />;
}
