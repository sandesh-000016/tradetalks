import React from "react";
import HomePageClient from "../components/HomePageClient";
import { getCachedLeaderboard } from "@/lib/alpariApi";

export const dynamic = "force-dynamic";

export default async function Home() {
  let initialTraders = [];
  try {
    initialTraders = await getCachedLeaderboard("monthly");
  } catch (error) {
    console.error("Failed to load monthly leaderboard on server:", error);
  }

  return <HomePageClient initialTraders={initialTraders} />;
}
