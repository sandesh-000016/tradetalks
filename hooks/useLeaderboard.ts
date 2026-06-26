import { useEffect, useState } from "react";
import { fetchLeaderboard, Trader, Timeframe } from "@/lib/leaderboardApi";

interface UseLeaderboardResult {
  data: Trader[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Consumes the leaderboard API and re-fetches whenever the timeframe changes.
 * The UI never touches the API directly — swap the endpoint in lib/leaderboardApi.ts.
 */
export function useLeaderboard(timeframe: Timeframe): UseLeaderboardResult {
  const [data, setData] = useState<Trader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchLeaderboard(timeframe)
      .then((rows) => {
        if (!cancelled) setData(rows);
      })
      .catch((e) => {
        if (!cancelled)
          setError(
            e instanceof Error ? e.message : "Failed to load leaderboard"
          );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [timeframe]);

  return { data, isLoading, error };
}
