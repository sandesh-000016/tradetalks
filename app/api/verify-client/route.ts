import { NextResponse } from "next/server";
import { getCachedLeaderboard } from "@/lib/alpariApi";

export async function POST(request: Request) {
  try {
    const { clientId } = await request.json();

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: "Client ID is required." },
        { status: 400 }
      );
    }

    const trimmedId = clientId.trim().toLowerCase();

    // Fetch the consolidated list of traders (cached, fast after first load)
    const traders = await getCachedLeaderboard("all");

    // Match against external_client_id (case-insensitive full match)
    const foundTrader = traders.find((t: any) => {
      const extId = String(t.id || "").toLowerCase().trim();
      return extId === trimmedId;
    });

    if (!foundTrader) {
      return NextResponse.json({
        success: false,
        error: `Client ID '${clientId.trim()}' was not found in our challenge database. Make sure you opened your account using the official referral link below.`,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Client verified successfully!",
      client: {
        id: foundTrader.id,
        name: foundTrader.name || `Trader ${clientId.trim()}`,
        balance: foundTrader.totalBalance ?? 0,
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
