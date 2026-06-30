// Use native fetch (available in Node 22+)
const fs = require('fs');
const path = require('path');

const API_BASE = "https://api.alpariportal.com";
const PRIVATE_TOKEN = "03764376-ec54-4a11-94aa-7c63d39d1f2f";
const PARTNER_ID = 417398;

async function checkApi() {
  const params = {
    RegistrationFromDate: "01/01/2026",
    RegistrationToDate: "30/12/2026",
    DirectPartner: PARTNER_ID,
  };

  console.log("Fetching performance data...");
  const perfRes = await fetch(`${API_BASE}/v1/External/client/performance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Private-Token": PRIVATE_TOKEN,
    },
    body: JSON.stringify(params),
  });
  const perfData = await perfRes.json();
  const performances = Array.isArray(perfData) ? perfData : (perfData.Data || perfData.data || perfData.clients || []);

  console.log("Fetching referral details...");
  const refRes = await fetch(`${API_BASE}/v1/External/client/referral_details`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Private-Token": PRIVATE_TOKEN,
    },
    body: JSON.stringify(params),
  });
  const refData = await refRes.json();
  const referrals = Array.isArray(refData) ? refData : (refData.Data || refData.data || refData.clients || []);

  console.log("Fetching insights...");
  const insRes = await fetch(`${API_BASE}/v1/External/client/insights`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Private-Token": PRIVATE_TOKEN,
    },
    body: JSON.stringify(params),
  });
  const insData = await insRes.json();
  const insights = Array.isArray(insData) ? insData : (insData.Data || insData.data || insData.clients || []);

  const getClientKey = (item) => {
    const extId = item.external_client_id || item.externalClientId;
    if (extId) return String(extId);
    const numId = item.id || item.clientId || item.client_id;
    if (numId) return String(numId);
    return "";
  };

  const mergedClientsMap = {};

  performances.forEach((p) => {
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

  referrals.forEach((r) => {
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

  insights.forEach((i) => {
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

  const mergedList = Object.values(mergedClientsMap);

  const outputFilePath = path.join(process.cwd(), "live_api_results.json");
  fs.writeFileSync(outputFilePath, JSON.stringify(mergedList, null, 2), "utf8");
  console.log(`Successfully wrote ${mergedList.length} unique client records to ${outputFilePath}`);
}

checkApi().catch(console.error);
