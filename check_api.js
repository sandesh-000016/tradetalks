// Use native fetch (available in Node 22+)
const fs = require('fs');
const path = require('path');

const API_BASE = "https://api.alpariportal.com";
const PRIVATE_TOKEN = "03764376-ec54-4a11-94aa-7c63d39d1f2f";
const PARTNER_ID = 417398;

async function fetchEndpoint(name, url, params) {
  console.log(`\n--- Fetching ${name} from ${url} ---`);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Private-Token": PRIVATE_TOKEN,
      },
      body: JSON.stringify(params),
    });

    console.log(`Status: ${res.status} ${res.statusText}`);
    const contentType = res.headers.get("content-type") || "";
    console.log(`Content-Type: ${contentType}`);

    const text = await res.text();

    if (!res.ok) {
      console.error(`Error: Response was not OK (status ${res.status})`);
      console.error(`Body snippet: ${text.substring(0, 500)}`);
      return null;
    }

    if (!contentType.includes("application/json")) {
      console.error(`Error: Content-type is not JSON!`);
      console.error(`Body snippet: ${text.substring(0, 500)}`);
      return null;
    }

    try {
      const data = JSON.parse(text);
      console.log(`Successfully parsed JSON. Item count: ${Array.isArray(data) ? data.length : (data.Data || data.data || data.clients || []).length || 'unknown'}`);
      return data;
    } catch (e) {
      console.error(`JSON Parse Error: ${e.message}`);
      console.error(`Body snippet: ${text.substring(0, 500)}`);
      return null;
    }
  } catch (err) {
    console.error(`Fetch exception for ${name}: ${err.message}`);
    return null;
  }
}

async function checkApi() {
  const params = {
    RegistrationFromDate: "01/01/2026",
    RegistrationToDate: "30/12/2026",
    DirectPartner: PARTNER_ID,
  };

  const perfData = await fetchEndpoint("Performance Data", `${API_BASE}/v1/External/client/performance`, params);
  const refData = await fetchEndpoint("Referral Details", `${API_BASE}/v1/External/client/referral_details`, params);
  const insData = await fetchEndpoint("Insights", `${API_BASE}/v1/External/client/insights`, params);

  const performances = perfData ? (Array.isArray(perfData) ? perfData : (perfData.Data || perfData.data || perfData.clients || [])) : [];
  const referrals = refData ? (Array.isArray(refData) ? refData : (refData.Data || refData.data || refData.clients || [])) : [];
  const insights = insData ? (Array.isArray(insData) ? insData : (insData.Data || insData.data || insData.clients || [])) : [];

  console.log(`\n--- Summary of Fetched Data ---`);
  console.log(`Performance records: ${performances.length}`);
  console.log(`Referral records: ${referrals.length}`);
  console.log(`Insights records: ${insights.length}`);

  const getClientKey = (item) => {
    const extId = item.external_client_id || item.externalClientId;
    if (extId) return String(extId);
    const numId = item.id || item.clientId || item.client_id;
    if (numId) return String(numId);
    return "";
  };

  const mergedClientsMap = {};

  const outputFilePath = path.join(process.cwd(), "live_api_results.json");

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

  if (mergedList.length > 0) {
    fs.writeFileSync(outputFilePath, JSON.stringify(mergedList, null, 2), "utf8");
    console.log(`Successfully wrote ${mergedList.length} unique client records to ${outputFilePath}`);
  } else {
    console.log("No data was successfully fetched, skipping writing live_api_results.json to preserve existing file.");
  }
}

checkApi().catch(console.error);
