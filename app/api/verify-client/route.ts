import { NextResponse } from "next/server";
import { fetchClientPerformance, fetchClientInsights } from "@/lib/alpariApi";

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

    // Fetch the client base from the Alpari API
    const params = {
      RegistrationFromDate: "01/01/2000",
      RegistrationToDate: new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
      DirectPartner: Number(process.env.ALPARI_DIRECT_PARTNER_ID || "72725"),
    };

    const [performances, insights] = await Promise.all([
      fetchClientPerformance(params).catch(() => []),
      fetchClientInsights(params).catch(() => []),
    ]);

    // Find the matching client by checking both string representation and the prefix-stripped version
    const foundPerf = performances.find((p: any) => {
      const idStr = String(p.clientId || p.id || p.client_id || "");
      return idStr === trimmedId || idStr === numericIdOnly;
    });

    const foundInsight = insights.find((i: any) => {
      const idStr = String(i.clientId || i.id || i.client_id || "");
      return idStr === trimmedId || idStr === numericIdOnly;
    });

    if (!foundPerf && !foundInsight) {
      return NextResponse.json({
        success: false,
        error: `Client ID '${trimmedId}' was not found in our challenge database. Make sure you opened your account using the official referral link below.`,
      });
    }

    // Success response
    const clientName = foundPerf?.client_name || foundInsight?.client_name || `Trader ${trimmedId}`;
    const balance = foundInsight?.total_balance || 100; // fallback to 100

    return NextResponse.json({
      success: true,
      message: "Client verified successfully!",
      client: {
        id: trimmedId,
        name: clientName,
        balance: balance,
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
