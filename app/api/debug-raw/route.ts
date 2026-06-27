import { NextResponse } from "next/server";
import {
  fetchClientPerformance,
  fetchClientReferralDetails,
  fetchClientInsights,
} from "@/lib/alpariApi";

export async function GET() {
  const now = new Date();
  const toDate = now.toISOString().split("T")[0];
  const fromDate = "2000-01-01";

  const params = {
    RegistrationFromDate: fromDate.split("-").reverse().join("/"), // DD/MM/YYYY
    RegistrationToDate: toDate.split("-").reverse().join("/"),
    DirectPartner: Number(process.env.ALPARI_DIRECT_PARTNER_ID || "72725"),
  };

  try {
    const [performances, referrals, insights] = await Promise.all([
      fetchClientPerformance(params).catch((e) => ({ error: e.message })),
      fetchClientReferralDetails(params).catch((e) => ({ error: e.message })),
      fetchClientInsights(params).catch((e) => ({ error: e.message })),
    ]);

    return NextResponse.json({
      params,
      performance: performances,
      referrals: referrals,
      insights: insights,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
