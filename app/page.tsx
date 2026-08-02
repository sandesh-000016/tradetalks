import React from "react";
import HomePageClient from "../components/HomePageClient";
import { getCachedLeaderboard } from "@/lib/alpariApi";

// ISR: Serve the cached static page instantly and revalidate in the background every 2 hours.
// This eliminates the initial delay caused by hitting the Alpari API on every request.
export const revalidate = 7200; // 2 hours

export default async function Home() {
  let initialTraders = [];
  try {
    initialTraders = await getCachedLeaderboard("monthly");
  } catch (error) {
    console.error("Failed to load monthly leaderboard on server:", error);
  }

  return <HomePageClient initialTraders={initialTraders} />;
}
