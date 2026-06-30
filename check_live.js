const fs = require('fs');

const API_BASE = process.env.ALPARI_API_BASE_URL || "https://api.alpariportal.com";
const PRIVATE_TOKEN = process.env.ALPARI_PRIVATE_TOKEN || "03764376-ec54-4a11-94aa-7c63d39d1f2f";
const PARTNER_ID = Number(process.env.ALPARI_DIRECT_PARTNER_ID || "417398");

console.log("Using API Config:");
console.log("Base URL:", API_BASE);
console.log("Partner ID:", PARTNER_ID);

const params = {
  RegistrationFromDate: "01/01/2026",
  RegistrationToDate: "30/12/2026",
  DirectPartner: PARTNER_ID
};

async function fetchEndpoint(name, path) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Private-Token": PRIVATE_TOKEN
      },
      body: JSON.stringify(params)
    });
    console.log(`${name} Status:`, res.status, res.statusText);
    const data = await res.json();
    const items = Array.isArray(data) ? data : (data.Data || data.data || data.clients || []);
    console.log(`${name} Item count:`, items.length);
    return items;
  } catch (error) {
    console.error(`Error fetching ${name}:`, error.message);
    return [];
  }
}

async function run() {
  console.log("Fetching live data from Alpari API...");
  const [perfList, refList, insList] = await Promise.all([
    fetchEndpoint("Performance", "/v1/External/client/performance"),
    fetchEndpoint("Referrals", "/v1/External/client/referral_details"),
    fetchEndpoint("Insights", "/v1/External/client/insights")
  ]);

  const mergedClientsMap = {};

  const getCleanId = (c) => {
    const numId = c.id || c.clientId || c.client_id;
    if (numId) return String(numId);
    const extId = c.external_client_id || c.externalClientId;
    if (extId) return String(extId);
    return "";
  };

  perfList.forEach((p) => {
    const key = getCleanId(p);
    if (!key) return;
    if (!mergedClientsMap[key]) mergedClientsMap[key] = { id: key };
    const extId = p.external_client_id || p.externalClientId;
    const numId = p.id || p.clientId || p.client_id;
    mergedClientsMap[key] = {
      ...mergedClientsMap[key],
      name: p.client_name || p.name || mergedClientsMap[key].name,
      externalClientId: extId || mergedClientsMap[key].externalClientId,
      numericId: numId || mergedClientsMap[key].numericId,
      country: p.country || mergedClientsMap[key].country,
      registrationDate: p.registration_date || mergedClientsMap[key].registrationDate,
      mtNetDeposits: p.mt_net_deposits,
      settledRebates: p.settled_rebates,
      volume: p.volume,
      turnover: p.turnover,
    };
  });

  refList.forEach((r) => {
    const key = getCleanId(r);
    if (!key) return;
    if (!mergedClientsMap[key]) mergedClientsMap[key] = { id: key };
    const extId = r.external_client_id || r.externalClientId;
    const numId = r.id || r.clientId || r.client_id;
    mergedClientsMap[key] = {
      ...mergedClientsMap[key],
      name: r.client_name || r.name || mergedClientsMap[key].name,
      externalClientId: extId || mergedClientsMap[key].externalClientId,
      numericId: numId || mergedClientsMap[key].numericId,
      country: r.country || mergedClientsMap[key].country,
      registrationDate: r.registration_date || mergedClientsMap[key].registrationDate,
      programName: r.program_name || mergedClientsMap[key].programName,
    };
  });

  insList.forEach((i) => {
    const key = getCleanId(i);
    if (!key) return;
    if (!mergedClientsMap[key]) mergedClientsMap[key] = { id: key };
    const extId = i.external_client_id || i.externalClientId;
    const numId = i.id || i.clientId || i.client_id;
    mergedClientsMap[key] = {
      ...mergedClientsMap[key],
      name: i.client_name || i.name || mergedClientsMap[key].name,
      externalClientId: extId || mergedClientsMap[key].externalClientId,
      numericId: numId || mergedClientsMap[key].numericId,
      country: i.country || mergedClientsMap[key].country,
      registrationDate: i.registration_date || mergedClientsMap[key].registrationDate,
      totalBalance: i.total_balance,
      totalEquity: i.total_equity,
      unsettledRebates: i.unsettled_rebates,
      status: i.status || mergedClientsMap[key].status,
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
      performance: perfList,
      referrals: refList,
      insights: insList,
    }
  };

  const outputFilePath = "./alpari_responses.json";
  fs.writeFileSync(outputFilePath, JSON.stringify(fullResponse, null, 2), "utf8");
  console.log(`Successfully merged data and wrote ${mergedClients.length} clients without duplicates to ${outputFilePath}`);
}

run();
