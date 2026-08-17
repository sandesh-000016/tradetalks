const { MongoClient } = require('mongodb');

async function resetTWR() {
  const uri = "mongodb://trtk_dbuser:a4mJWaJRbfLREQsC5zvpIN9EF2gJINiv@169.58.104.88:39142/tradetalks?authSource=admin";
  if (!uri) {
    console.error("MONGODB_URI not found in .env.local");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB.");
    const db = client.db('tradetalks');
    
    // Reset twrFactor to 1.0 and startingBalanceOfThisPeriod to totalNetDeposits
    // for all traders who have a valid totalNetDeposits.
    // This uses an aggregation pipeline in updateMany to reference the document's own fields.
    const result = await db.collection('traders').updateMany(
      { totalNetDeposits: { $exists: true, $gt: 0 }, isDummy: { $ne: true } },
      [
        {
          $set: {
            twrFactor: 1.0,
            startingBalanceOfThisPeriod: "$totalNetDeposits"
          }
        }
      ]
    );

    console.log(`Successfully reset TWR for ${result.modifiedCount} traders.`);
    console.log("Their ROI will now exactly match their Simple ROI, and true TWR will start building fresh from today's balances on their next deposit.");
  } catch (error) {
    console.error("Error resetting TWR:", error);
  } finally {
    await client.close();
  }
}

resetTWR();
