import { NextResponse } from "next/server";
import { fetchClientPerformance, fetchClientReferralDetails, fetchClientInsights } from "@/lib/alpariApi";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const params = {
      RegistrationFromDate: "01/01/2000",
      RegistrationToDate: "01/01/2027",
      DirectPartner: Number(process.env.ALPARI_DIRECT_PARTNER_ID || "417398"),
    };

    const [performanceData, referralData, insightData] = await Promise.all([
      fetchClientPerformance(params).catch(err => ({ error: err.message })),
      fetchClientReferralDetails(params).catch(err => ({ error: err.message })),
      fetchClientInsights(params).catch(err => ({ error: err.message })),
    ]);

    return NextResponse.json({
      performanceSample: Array.isArray(performanceData) ? performanceData.slice(0, 2) : performanceData,
      referralSample: Array.isArray(referralData) ? referralData.slice(0, 2) : referralData,
      insightSample: Array.isArray(insightData) ? insightData.slice(0, 2) : insightData,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
