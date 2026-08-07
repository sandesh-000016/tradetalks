const { MongoClient } = require("mongodb");

async function run() {
  const uri = process.env.MONGODB_URI || "mongodb://trtk_dbuser:a4mJWaJRbfLREQsC5zvpIN9EF2gJINiv@169.58.104.88:39142/tradetalks?authSource=admin";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("tradetalks");
    
    // Find Subhash M in traders collection
    const trader = await db.collection("traders").findOne({ clientName: { $regex: /SUBHASH M/i } });
    if (!trader) {
      console.log("Subhash M not found in database.");
      return;
    }
    
    console.log("=== DB RECORD ===");
    console.log(JSON.stringify(trader, null, 2));

    const clientId = trader.clientId || trader._id;
    console.log(`\nFound Client ID: ${clientId}`);

    // Fetch from Alpari API
    const getPrivateToken = () => process.env.ALPARI_PRIVATE_TOKEN || "03764376-ec54-4a11-94aa-7c63d39d1f2f";
    const getDirectPartnerId = () => Number(process.env.ALPARI_DIRECT_PARTNER_ID || "417398");

    const params = {
      RegistrationFromDate: "01/10/2025",
      RegistrationToDate: "30/12/2026",
      DirectPartner: getDirectPartnerId(),
    };

    console.log("\nFetching Insights from Alpari API...");
    const res = await fetch("https://api.alpariportal.com/v1/External/client/insights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Private-Token": getPrivateToken(),
      },
      body: JSON.stringify(params),
    });

    const data = await res.json();
    const insights = Array.isArray(data) ? data : (data.Data || data.data || data.clients || []);
    
    const liveData = insights.find(i => 
      (i.external_client_id && String(i.external_client_id).toLowerCase() === String(clientId).toLowerCase()) ||
      (i.id && String(i.id).toLowerCase() === String(clientId).toLowerCase())
    );

    console.log("\n=== ALPARI LIVE INSIGHTS API RESULT ===");
    console.log(liveData ? JSON.stringify(liveData, null, 2) : "Not found in live insights (could be inactive or registered outside period).");

    // Also fetch performance API
    console.log("\nFetching Performance from Alpari API...");
    const perfRes = await fetch("https://api.alpariportal.com/v1/External/client/performance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Private-Token": getPrivateToken(),
      },
      body: JSON.stringify(params),
    });

    const perfData = await perfRes.json();
    const performances = Array.isArray(perfData) ? perfData : (perfData.Data || perfData.data || perfData.clients || []);
    
    const livePerf = performances.find(p => 
      (p.external_client_id && String(p.external_client_id).toLowerCase() === String(clientId).toLowerCase()) ||
      (p.id && String(p.id).toLowerCase() === String(clientId).toLowerCase())
    );

    console.log("\n=== ALPARI LIVE PERFORMANCE API RESULT ===");
    console.log(livePerf ? JSON.stringify(livePerf, null, 2) : "Not found in live performance.");

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
