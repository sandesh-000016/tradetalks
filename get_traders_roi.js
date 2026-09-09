const { MongoClient } = require('mongodb');

const TARGET_NAMES = [
  "FAWAZ HASSAN KP",
  "shinas vs",
  "SANIL RAJ",
  "jithin Narayanan",
  "Rahul Uday"
];

async function main() {
  const uri = process.env.MONGODB_URI || "mongodb://trtk_dbuser:a4mJWaJRbfLREQsC5zvpIN9EF2gJINiv@169.58.104.88:39142/tradetalks?authSource=admin";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("tradetalks");
    const tradersCol = db.collection("traders");

    console.log("=== MONGODB TRADERS MATCHES ===");
    for (const name of TARGET_NAMES) {
      const parts = name.split(' ');
      const regexStr = parts.map(p => `(?=.*${p})`).join('');
      const regex = new RegExp(regexStr, 'i');
      
      const found = await tradersCol.find({ clientName: { $regex: regex } }).toArray();
      console.log(`\n--- Matches for "${name}" (${found.length}) ---`);
      if (found.length > 0) {
        found.forEach(t => {
          console.log(JSON.stringify({
            clientId: t.clientId,
            numericId: t.numericId,
            clientName: t.clientName,
            totalNetDeposits: t.totalNetDeposits,
            lastRecordedBalance: t.lastRecordedBalance,
            profit: t.profit,
            twrFactor: t.twrFactor,
            startingBalanceOfThisPeriod: t.startingBalanceOfThisPeriod,
            volume: t.volume,
            isWashedOut: t.isWashedOut,
            isCorrupted: t.isCorrupted
          }, null, 2));
        });
      } else {
        console.log("Not found in MongoDB.");
      }
    }

    // Now call Alpari API Live Search for each
    const getPrivateToken = () => process.env.ALPARI_PRIVATE_TOKEN || "03764376-ec54-4a11-94aa-7c63d39d1f2f";
    const getDirectPartnerId = () => Number(process.env.ALPARI_DIRECT_PARTNER_ID || "417398");

    const params = {
      RegistrationFromDate: "01/01/2025",
      RegistrationToDate: "30/12/2026",
      DirectPartner: getDirectPartnerId(),
    };

    console.log("\n=== FETCHING LIVE ALPARI API DATA ===");
    const [perfRes, insRes, refRes] = await Promise.all([
      fetch("https://api.alpariportal.com/v1/External/client/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Private-Token": getPrivateToken() },
        body: JSON.stringify(params)
      }).then(r => r.json()),
      fetch("https://api.alpariportal.com/v1/External/client/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Private-Token": getPrivateToken() },
        body: JSON.stringify(params)
      }).then(r => r.json()),
      fetch("https://api.alpariportal.com/v1/External/client/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Private-Token": getPrivateToken() },
        body: JSON.stringify(params)
      }).then(r => r.json())
    ]);

    const perfList = Array.isArray(perfRes) ? perfRes : (perfRes.Data || perfRes.data || []);
    const insList = Array.isArray(insRes) ? insRes : (insRes.Data || insRes.data || []);
    const refList = Array.isArray(refRes) ? refRes : (refRes.Data || refRes.data || []);

    console.log(`Live totals - Perf: ${perfList.length}, Insights: ${insList.length}, Referrals: ${refList.length}`);

    for (const name of TARGET_NAMES) {
      const parts = name.toLowerCase().split(' ');
      
      const pMatch = perfList.filter(i => i.client_name && parts.every(p => i.client_name.toLowerCase().includes(p)));
      const iMatch = insList.filter(i => i.client_name && parts.every(p => i.client_name.toLowerCase().includes(p)));
      const rMatch = refList.filter(i => i.client_name && parts.every(p => i.client_name.toLowerCase().includes(p)));

      console.log(`\n===================================`);
      console.log(`LIVE DATA FOR TRADER: ${name}`);
      console.log(`===================================`);
      console.log("Performance API matches:", pMatch.length);
      pMatch.forEach(m => console.log("  Perf:", JSON.stringify(m)));
      console.log("Insights API matches:", iMatch.length);
      iMatch.forEach(m => console.log("  Insights:", JSON.stringify(m)));
      console.log("Referrals API matches:", rMatch.length);
      rMatch.forEach(m => console.log("  Referrals:", JSON.stringify(m)));
    }

  } catch (err) {
    console.error("Error in main:", err);
  } finally {
    await client.close();
  }
}

main();
