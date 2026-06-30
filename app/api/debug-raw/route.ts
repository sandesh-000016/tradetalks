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
    RegistrationFromDate: "01/01/2026",
    RegistrationToDate: "30/12/2026",
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

    // Create a merged list of all clients without duplication
    const mergedClientsMap: Record<string, any> = {};

    const getClientKey = (item: any): string => {
      const extId = item.external_client_id || item.externalClientId;
      if (extId) return String(extId);
      const numId = item.id || item.clientId || item.client_id;
      if (numId) return String(numId);
      return "";
    };

    perfList.forEach((p: any) => {
      const key = getClientKey(p);
      if (!key) return;
      if (!mergedClientsMap[key]) mergedClientsMap[key] = {};
      const extId = p.external_client_id || p.externalClientId || key;
      const numId = Number(p.id || p.clientId || p.client_id || 0);

      mergedClientsMap[key] = {
        ...mergedClientsMap[key],
        id: extId,
        name: p.client_name || p.name || mergedClientsMap[key].name,
        externalClientId: extId,
        numericId: numId || mergedClientsMap[key].numericId,
        country: p.country || mergedClientsMap[key].country,
        registrationDate: p.registration_date || mergedClientsMap[key].registrationDate,
        mtNetDeposits: Number(p.mt_net_deposits ?? 0),
        settledRebates: Number(p.settled_rebates ?? 0),
        volume: Number(p.volume ?? 0),
        turnover: Number(p.turnover ?? 0),
      };
    });

    refList.forEach((r: any) => {
      const key = getClientKey(r);
      if (!key) return;
      if (!mergedClientsMap[key]) mergedClientsMap[key] = {};
      const extId = r.external_client_id || r.externalClientId || key;
      const numId = Number(r.id || r.clientId || r.client_id || 0);

      mergedClientsMap[key] = {
        ...mergedClientsMap[key],
        id: extId,
        name: r.client_name || r.name || mergedClientsMap[key].name,
        externalClientId: extId,
        numericId: numId || mergedClientsMap[key].numericId,
        country: r.country || mergedClientsMap[key].country,
        registrationDate: r.registration_date || mergedClientsMap[key].registrationDate,
        programName: r.program_name || mergedClientsMap[key].programName,
      };
    });

    insList.forEach((i: any) => {
      const key = getClientKey(i);
      if (!key) return;
      if (!mergedClientsMap[key]) mergedClientsMap[key] = {};
      const extId = i.external_client_id || i.externalClientId || key;
      const numId = Number(i.id || i.clientId || i.client_id || 0);

      mergedClientsMap[key] = {
        ...mergedClientsMap[key],
        id: extId,
        name: i.client_name || i.name || mergedClientsMap[key].name,
        externalClientId: extId,
        numericId: numId || mergedClientsMap[key].numericId,
        country: i.country || mergedClientsMap[key].country,
        registrationDate: i.registration_date || mergedClientsMap[key].registrationDate,
        totalBalance: Number(i.total_balance ?? 0),
        totalEquity: Number(i.total_equity ?? 0),
        unsettledRebates: Number(i.unsettled_rebates ?? 0),
      };
    });

    const mergedClients = Object.values(mergedClientsMap);

    // Save the file to the project root directory as a clean array
    const outputFilePath = path.join(process.cwd(), "alpari_responses.json");
    fs.writeFileSync(outputFilePath, JSON.stringify(mergedClients, null, 2), "utf8");

    return NextResponse.json(mergedClients);
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

