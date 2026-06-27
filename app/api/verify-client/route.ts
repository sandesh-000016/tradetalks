import { NextResponse } from "next/server";
import { getIntegratedLeaderboard } from "@/lib/alpariApi";

export async function POST(request: Request) {
  try {
    const { clientId } = await request.json();

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: "Client ID is required." },
        { status: 400 }
      );
    }

    const trimmedId = clientId.trim();

    // Enforce that Client ID must start with 'f' (case-insensitive)
    if (!/^f/i.test(trimmedId)) {
      return NextResponse.json(
        { success: false, error: "Invalid format. Your Client ID must start with 'f' (e.g. f12345678)." },
        { status: 400 }
      );
    }

    // Strip the 'f' prefix to perform a matching check with the raw numeric IDs
    const numericIdOnly = trimmedId.replace(/^f/i, "");

    // Fetch the consolidated list of traders using the integrated leaderboard helper
    const traders = await getIntegratedLeaderboard("all");

    // Find the trader in the active list
    const foundTrader = traders.find((t: any) => {
      const idStr = String(t.id).trim();
      return idStr === trimmedId || idStr === numericIdOnly;
    });

    if (!foundTrader) {
      return NextResponse.json({
        success: false,
        error: `Client ID '${trimmedId}' was not found in our challenge database. Make sure you opened your account using the official referral link below.`,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Client verified successfully!",
      client: {
        id: foundTrader.id,
        name: foundTrader.name || `Trader ${trimmedId}`,
        balance: foundTrader.totalBalance ?? 100,
      },
    });
  } catch (error: any) {
    console.error("Verification API Error:", error);
    return NextResponse.json(
      { success: false, error: "Server verification failed. Please try again later." },
      { status: 500 }
    );
  }
}
