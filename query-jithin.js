const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

// Parse .env manually to avoid 'dotenv' package dependency
try {
  const envPath = path.join(__dirname, ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach(line => {
      const parts = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (parts) {
        const key = parts[1];
        let value = parts[2] || "";
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value.trim();
      }
    });
  }
} catch (e) {
  console.error("Error reading .env file:", e);
}

const getApiBase = () => process.env.ALPARI_API_BASE_URL || "https://api.alpariportal.com";
const getPrivateToken = () => process.env.ALPARI_PRIVATE_TOKEN || "03764376-ec54-4a11-94aa-7c63d39d1f2f";
const getDirectPartnerId = () => Number(process.env.ALPARI_DIRECT_PARTNER_ID || "72725");

async function fetchFromAlpari(endpoint, params) {
  const url = `${getApiBase()}${endpoint}`;
  console.log(`[API Call] Fetching ${url} ...`);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Private-Token": getPrivateToken(),
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Alpari HTTP Error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return Array.isArray(data) ? data : (data.Data || data.data || data.clients || []);
}

function formatDateForApi(dateStr) {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return "01/01/2000";
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not defined in environment.");
    return;
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("tradetalks");
    
    // Find Jithin in DB
    const jithinDb = await db.collection("traders").findOne({
      $or: [
        { _id: "f02549b7867" },
        { clientId: "f02549b7867" },
        { clientName: /jithin/i }
      ]
    });

    console.log("\n=================== DB RECORD ===================");
    console.log(JSON.stringify(jithinDb, null, 2));

    // Define search parameters matching the challenge season
    const SEASON_START_DATE = "2025-10-01"; 
    const SEASON_END_DATE = "2026-12-30";
    
    const params = {
      RegistrationFromDate: formatDateForApi(SEASON_START_DATE),
      RegistrationToDate: formatDateForApi(SEASON_END_DATE),
      DirectPartner: getDirectPartnerId(),
    };

    console.log("\n================= ALPARI API CALLS =================");
    
    // Fetch live performance
    let performances = [];
    try {
      performances = await fetchFromAlpari("/v1/External/client/performance", params);
      const perf = performances.find(p => String(p.external_client_id || p.clientId || p.id).toLowerCase() === "f02549b7867");
      console.log("Live Performance entry:", perf ? JSON.stringify(perf, null, 2) : "NOT FOUND");
    } catch (err) {
      console.error("Failed to fetch performance:", err.message);
    }

    // Fetch live referrals
    let referrals = [];
    try {
      referrals = await fetchFromAlpari("/v1/External/client/referral_details", params);
      const ref = referrals.find(r => String(r.external_client_id || r.externalClientId || r.clientId || r.id).toLowerCase() === "f02549b7867");
      console.log("Live Referrals entry:", ref ? JSON.stringify(ref, null, 2) : "NOT FOUND");
    } catch (err) {
      console.error("Failed to fetch referrals:", err.message);
    }

    // Fetch live insights
    let insights = [];
    try {
      insights = await fetchFromAlpari("/v1/External/client/insights", params);
      const ins = insights.find(i => String(i.external_client_id || i.externalClientId || i.clientId || i.id).toLowerCase() === "f02549b7867");
      console.log("Live Insights entry:", ins ? JSON.stringify(ins, null, 2) : "NOT FOUND");
    } catch (err) {
      console.error("Failed to fetch insights:", err.message);
    }

    // Clear MongoDB leaderboard cache
    console.log("\n================= CACHE INVALIDATION =================");
    const cacheResult = await db.collection("api_cache").deleteOne({ _id: "leaderboard_data" });
    console.log("Cleared 'leaderboard_data' from api_cache collection:", cacheResult);

  } catch (err) {
    console.error("Global Error:", err);
  } finally {
    await client.close();
  }
}

run();
