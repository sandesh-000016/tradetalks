import { MongoClient } from 'mongodb';

const uri = "mongodb://trtk_dbuser:a4mJWaJRbfLREQsC5zvpIN9EF2gJINiv@169.58.104.88:39142/tradetalks?authSource=admin";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('tradetalks');
    
    // Check if client is registered in traders
    const trader = await db.collection('traders').findOne({ clientId: 'f00904b4902' });
    console.log("In 'traders' collection:", trader ? "FOUND" : "NOT FOUND");

    // Check api_cache
    const cacheDoc = await db.collection('api_cache').findOne({ _id: "leaderboard_data" });
    if (cacheDoc && cacheDoc.traders) {
      const found = cacheDoc.traders.find(t => 
        String(t.external_client_id).toLowerCase() === 'f00904b4902' ||
        String(t.id).toLowerCase() === 'f00904b4902' ||
        String(t.clientId).toLowerCase() === 'f00904b4902'
      );
      if (found) {
        console.log("In 'api_cache': FOUND. details:", JSON.stringify(found, null, 2));
      } else {
        console.log("In 'api_cache': NOT FOUND.");
      }
    } else {
      console.log("api_cache 'leaderboard_data' not found or empty.");
    }
  } catch(e) {
    console.error("DB error:", e);
  } finally {
    await client.close();
  }
}
run();
