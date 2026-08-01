const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

// Read connection string from .env if present
let envUri = "";
try {
  const envContent = fs.readFileSync(path.join(__dirname, ".env"), "utf8");
  const match = envContent.match(/MONGODB_URI\s*=\s*(.*)/);
  if (match) {
    envUri = match[1].trim();
  }
} catch (e) {
  // Ignored
}

const TARGET_URI = envUri;

async function run() {
  const filename = "registered_traders_export.json";
  if (!fs.existsSync(filename)) {
    console.error(`Error: Backup file '${filename}' not found. Please run 'node find_registered.js' first to export from Atlas.`);
    process.exit(1);
  }

  if (!TARGET_URI) {
    console.error("Error: MONGODB_URI is not set in your .env file.");
    process.exit(1);
  }

  console.log(`Connecting to Target Database: ${TARGET_URI}`);
  const client = new MongoClient(TARGET_URI);
  try {
    await client.connect();
    console.log("Connected successfully to target database!");

    const db = client.db("tradetalks");
    const tradersCol = db.collection("traders");

    const fileData = fs.readFileSync(filename, "utf8");
    const tradersToImport = JSON.parse(fileData);

    if (tradersToImport.length === 0) {
      console.log("No traders in backup file to import.");
      return;
    }

    console.log(`Starting migration of ${tradersToImport.length} registered traders...`);

    let importedCount = 0;
    for (const trader of tradersToImport) {
      const id = trader._id || trader.clientId;
      // Upsert so we don't duplicate if they already exist in target
      await tradersCol.updateOne(
        { _id: id },
        { $set: trader },
        { upsert: true }
      );
      importedCount++;
    }

    // Clear target cache to ensure updates show up
    await db.collection("api_cache").deleteOne({ _id: "leaderboard_data" });
    console.log("Invalidated target leaderboard cache.");

    console.log(`\nSuccess! Successfully migrated ${importedCount} registered traders to the target database.`);
  } catch (err) {
    console.error("Migration Error:", err);
  } finally {
    await client.close();
  }
}

run();
