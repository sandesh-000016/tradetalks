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

const ATLAS_URI = envUri || "mongodb+srv://sandeshgirish_db_user:idcTK8EGI5BE53Fv@cluster0.ci7mmxz.mongodb.net/";

async function run() {
  console.log("Connecting to MongoDB Atlas...");
  const client = new MongoClient(ATLAS_URI);
  try {
    await client.connect();
    console.log("Connected successfully to Atlas!");

    const db = client.db("tradetalks");
    const tradersCol = db.collection("traders");

    // Query for registered traders only
    console.log("Searching for traders with isRegistered = true...");
    const registeredTraders = await tradersCol.find({ isRegistered: true }).toArray();

    console.log(`\n=== Found ${registeredTraders.length} Registered Traders ===\n`);
    
    if (registeredTraders.length === 0) {
      console.log("No registered traders found in the 'traders' collection.");
    } else {
      registeredTraders.forEach((t, i) => {
        console.log(`${i + 1}. Name: ${t.clientName || "N/A"} | Client ID: ${t.clientId || t._id} | Balance: $${t.lastRecordedBalance ?? 0}`);
      });
      
      // Save to a backup JSON file
      const backupFilename = "registered_traders_export.json";
      fs.writeFileSync(backupFilename, JSON.stringify(registeredTraders, null, 2), "utf8");
      console.log(`\nSaved these ${registeredTraders.length} traders to '${backupFilename}'`);
    }

    console.log("\n=== Instructions to Migrate to Local/VPS Database ===");
    console.log("1. Change your MONGODB_URI in your .env to point to your target DB (e.g. VPS or local).");
    console.log("2. Run the import script to write these traders to the new DB.");
    console.log("   Example: node import_registered.js");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

run();
