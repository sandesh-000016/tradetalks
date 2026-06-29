import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
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

  try {
    const [performances, referrals, insights] = await Promise.all([
      fetchClientPerformance(params).catch((e: any) => ({ error: e.message, data: [] })),
      fetchClientReferralDetails(params).catch((e: any) => ({ error: e.message, data: [] })),
      fetchClientInsights(params).catch((e: any) => ({ error: e.message, data: [] })),
    ]);

    // Handle potential error wraps or raw arrays
    const perfList = Array.isArray(performances) ? performances : (performances.data || []);
    const refList = Array.isArray(referrals) ? referrals : (referrals.data || []);
    const insList = Array.isArray(insights) ? insights : (insights.data || []);

    // Create a merged, easily searchable list of all clients
    const mergedClientsMap: Record<string, any> = {};

    const getCleanId = (c: any) => {
      const extId = c.external_client_id;
      const numId = c.id || c.clientId || c.client_id;
      return extId || (numId ? String(numId) : null);
    };

    perfList.forEach((p: any) => {
      const id = getCleanId(p);
      if (!id) return;
      if (!mergedClientsMap[id]) mergedClientsMap[id] = { id };
      mergedClientsMap[id] = {
        ...mergedClientsMap[id],
        name: p.client_name || p.name || mergedClientsMap[id].name,
        externalClientId: p.external_client_id || mergedClientsMap[id].externalClientId,
        numericId: p.id || p.clientId || p.client_id || mergedClientsMap[id].numericId,
        country: p.country || mergedClientsMap[id].country,
        registrationDate: p.registration_date || mergedClientsMap[id].registrationDate,
        mtNetDeposits: p.mt_net_deposits,
        settledRebates: p.settled_rebates,
        volume: p.volume,
        turnover: p.turnover,
      };
    });

    refList.forEach((r: any) => {
      const id = getCleanId(r);
      if (!id) return;
      if (!mergedClientsMap[id]) mergedClientsMap[id] = { id };
      mergedClientsMap[id] = {
        ...mergedClientsMap[id],
        name: r.client_name || r.name || mergedClientsMap[id].name,
        externalClientId: r.external_client_id || mergedClientsMap[id].externalClientId,
        numericId: r.id || r.clientId || r.client_id || mergedClientsMap[id].numericId,
        country: r.country || mergedClientsMap[id].country,
        registrationDate: r.registration_date || mergedClientsMap[id].registrationDate,
        programName: r.program_name || mergedClientsMap[id].programName,
      };
    });

    insList.forEach((i: any) => {
      const id = getCleanId(i);
      if (!id) return;
      if (!mergedClientsMap[id]) mergedClientsMap[id] = { id };
      mergedClientsMap[id] = {
        ...mergedClientsMap[id],
        name: i.client_name || i.name || mergedClientsMap[id].name,
        externalClientId: i.external_client_id || mergedClientsMap[id].externalClientId,
        numericId: i.id || i.clientId || i.client_id || mergedClientsMap[id].numericId,
        country: i.country || mergedClientsMap[id].country,
        registrationDate: i.registration_date || mergedClientsMap[id].registrationDate,
        totalBalance: i.total_balance,
        totalEquity: i.total_equity,
        unsettledRebates: i.unsettled_rebates,
        status: i.status || mergedClientsMap[id].status,
      };
    });

    const mergedClients = Object.values(mergedClientsMap);

    const fullResponse = {
      metadata: {
        fetchedAt: new Date().toISOString(),
        params,
        counts: {
          performance: perfList.length,
          referrals: refList.length,
          insights: insList.length,
          merged: mergedClients.length,
        }
      },
      mergedClients,
      raw: {
        performance: performances,
        referrals: referrals,
        insights: insights,
      }
    };

    // Save the file to the project root directory
    const outputFilePath = path.join(process.cwd(), "alpari_responses.json");
    fs.writeFileSync(outputFilePath, JSON.stringify(fullResponse, null, 2), "utf8");

    return NextResponse.json({
      success: true,
      message: `Full response written to ${outputFilePath}`,
      ...fullResponse
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

