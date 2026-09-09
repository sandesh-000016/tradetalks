const fs = require('fs');
const { MongoClient } = require('mongodb');

const TARGET_IDS = [
  "f08db8edd1e", // FAWAZ HASSAN KP
  "f014edb4b49", // SANIL RAJ
  "f02549b7867"  // jithin Narayanan
];

const TARGET_NAMES = [
  "FAWAZ HASSAN KP",
  "shinas vs",
  "SANIL RAJ",
  "jithin Narayanan",
  "Rahul Uday"
];

async function run() {
  const token = process.env.ALPARI_PRIVATE_TOKEN || "03764376-ec54-4a11-94aa-7c63d39d1f2f";
  const partnerId = Number(process.env.ALPARI_DIRECT_PARTNER_ID || "417398");

  const params = {
    RegistrationFromDate: "01/01/2025",
    RegistrationToDate: "30/12/2026",
    DirectPartner: partnerId
  };

  console.log("=== FETCHING LIVE ALPARI API DATA FROM ALPARI SERVERS ===");
  try {
    const [perfRes, insRes, refRes] = await Promise.all([
      fetch("https://api.alpariportal.com/v1/External/client/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Private-Token": token },
        body: JSON.stringify(params)
      }).then(r => r.json()),
      fetch("https://api.alpariportal.com/v1/External/client/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Private-Token": token },
        body: JSON.stringify(params)
      }).then(r => r.json()),
      fetch("https://api.alpariportal.com/v1/External/client/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Private-Token": token },
        body: JSON.stringify(params)
      }).then(r => r.json())
    ]);

    const perf = Array.isArray(perfRes) ? perfRes : (perfRes.Data || perfRes.data || []);
    const ins = Array.isArray(insRes) ? insRes : (insRes.Data || insRes.data || []);
    const ref = Array.isArray(refRes) ? refRes : (refRes.Data || refRes.data || []);

    console.log(`Live API Counts -> Performance: ${perf.length}, Insights: ${ins.length}, Referrals: ${ref.length}`);

    const results = {};

    for (const name of TARGET_NAMES) {
      const parts = name.toLowerCase().split(' ');
      
      const p = perf.filter(x => x.client_name && parts.every(pt => x.client_name.toLowerCase().includes(pt)));
      const i = ins.filter(x => x.client_name && parts.every(pt => x.client_name.toLowerCase().includes(pt)));
      const r = ref.filter(x => x.client_name && parts.every(pt => x.client_name.toLowerCase().includes(pt)));

      results[name] = {
        performance: p,
        insights: i,
        referrals: r
      };
    }

    console.log("\n=======================================================");
    console.log("EXACT LIVE ALPARI DATA FOR TRADERS:");
    console.log("=======================================================");
    console.log(JSON.stringify(results, null, 2));

    // Also check MongoDB database state
    console.log("\n=======================================================");
    console.log("CHECKING MONGODB DATABASE RECORDS:");
    console.log("=======================================================");
    const mongoUri = process.env.MONGODB_URI || "mongodb://trtk_dbuser:a4mJWaJRbfLREQsC5zvpIN9EF2gJINiv@169.58.104.88:39142/tradetalks?authSource=admin";
    const mongo = new MongoClient(mongoUri);
    await mongo.connect();
    const db = mongo.db("tradetalks");
    const tradersCol = db.collection("traders");

    for (const name of TARGET_NAMES) {
      const parts = name.split(' ');
      const regexStr = parts.map(p => `(?=.*${p})`).join('');
      const regex = new RegExp(regexStr, 'i');
      const dbDocs = await tradersCol.find({ clientName: { $regex: regex } }).toArray();
      console.log(`\nDB Trader Doc for "${name}":`, JSON.stringify(dbDocs, null, 2));
    }
    await mongo.close();

  } catch (err) {
    console.error("Error executing fetch:", err);
  }
}

run();
