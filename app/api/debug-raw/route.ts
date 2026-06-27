import { NextResponse } from "next/server";
import {
  fetchClientPerformance,
  fetchClientReferralDetails,
  fetchClientInsights,
} from "@/lib/alpariApi";

const PARTNER_ID = Number(process.env.ALPARI_DIRECT_PARTNER_ID || "72725");

function formatDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export async function GET() {
  const params = {
    RegistrationFromDate: "01/01/2000",
    RegistrationToDate: formatDate(new Date()),
    DirectPartner: PARTNER_ID,
  };

  const [performances, referrals, insights] = await Promise.all([
    fetchClientPerformance(params).catch((e: any) => [{ _error: e.message }]),
    fetchClientReferralDetails(params).catch((e: any) => [{ _error: e.message }]),
    fetchClientInsights(params).catch((e: any) => [{ _error: e.message }]),
  ]);

  // Show first 5 entries from each with ALL keys so we can see exact field names
  return NextResponse.json({
    params,
    performance_count: Array.isArray(performances) ? performances.length : 0,
    performance_sample: Array.isArray(performances) ? performances.slice(0, 5) : performances,
    referrals_count: Array.isArray(referrals) ? referrals.length : 0,
    referrals_sample: Array.isArray(referrals) ? referrals.slice(0, 5) : referrals,
    insights_count: Array.isArray(insights) ? insights.length : 0,
    insights_sample: Array.isArray(insights) ? insights.slice(0, 5) : insights,
  });
}
