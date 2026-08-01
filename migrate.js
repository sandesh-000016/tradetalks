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
  const args = process.argv.slice(2);
  const mode = args[0] || "inspect"; // inspect, export, import

  if (mode === "inspect") {
    await inspectDatabase();
  } else if (mode === "export") {
    await exportData();
  } else if (mode === "import") {
    const targetUri = args[1];
    if (!targetUri) {
      console.error("Error: Please provide a target MongoDB connection URI to import into.");
      console.log("Example: node migrate.js import mongodb://localhost:27017");
      process.exit(1);
    }
    await importData(targetUri);
  } else {
    console.log("Unknown mode. Use: inspect, export, or import");
  }
}

async function inspectDatabase() {
  console.log("Connecting to MongoDB Atlas...");
  const client = new MongoClient(ATLAS_URI);
  try {
    await client.connect();
    console.log("Connected successfully!");

    const admin = client.db().admin();
    const dbsList = await admin.listDatabases();
    console.log("\n=== Databases in Atlas ===");
    
    for (const dbInfo of dbsList.databases) {
      const dbName = dbInfo.name;
      // Skip system databases unless requested
      if (["admin", "local", "config"].includes(dbName)) continue;
      
      const db = client.db(dbName);
      const collections = await db.listCollections().toArray();
      console.log(`\nDatabase: ${dbName} (Size: ${(dbInfo.sizeOnDisk / (1024 * 1024)).toFixed(2)} MB)`);
      
      if (collections.length === 0) {
        console.log("  No collections found.");
      }
      
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        console.log(`  - Collection: ${col.name} (${count} documents)`);
      }
    }
    
    console.log("\nTo export data from Atlas, run: node migrate.js export");
  } catch (err) {
    console.error("Connection/Inspection Error:", err);
  } finally {
    await client.close();
  }
}

async function exportData() {
  console.log("Connecting to MongoDB Atlas for Export...");
  const client = new MongoClient(ATLAS_URI);
  try {
    await client.connect();
    
    // We will search across all databases (usually "tradetalks" or "test")
    const admin = client.db().admin();
    const dbsList = await admin.listDatabases();
    
    // Find where registrations are
    let sourceDbName = "tradetalks";
    let foundDb = false;
    
    for (const dbInfo of dbsList.databases) {
      const db = client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();
      const colNames = collections.map(c => c.name);
      if (colNames.includes("registrations")) {
        sourceDbName = dbInfo.name;
        foundDb = true;
        break;
      }
    }
    
    if (!foundDb) {
      console.warn(`Could not automatically find a database containing 'registrations' collection. Defaulting to '${sourceDbName}'`);
    } else {
      console.log(`Found 'registrations' in database: '${sourceDbName}'`);
    }

    const db = client.db(sourceDbName);
    const collectionsToBackup = ["registrations", "awarded_badges", "badge_rules", "traders", "mock_data"];
    
    for (const colName of collectionsToBackup) {
      const collection = db.collection(colName);
      const count = await collection.countDocuments();
      console.log(`Backing up ${colName} (${count} documents)...`);
      
      const docs = await collection.find({}).toArray();
      const filename = `backup_${colName}.json`;
      fs.writeFileSync(filename, JSON.stringify(docs, null, 2), "utf8");
      console.log(`Saved to ${filename}`);
    }
    
    console.log("\nExport complete! JSON backups saved to your project directory.");
    console.log("To import these backups to your new/local database, run:");
    console.log("  node migrate.js import <YOUR_NEW_MONGODB_URI>");
    console.log("Example for local MongoDB: node migrate.js import mongodb://127.0.0.1:27017");
  } catch (err) {
    console.error("Export Error:", err);
  } finally {
    await client.close();
  }
}

async function importData(targetUri) {
  console.log(`Connecting to Target Database: ${targetUri}`);
  const client = new MongoClient(targetUri);
  try {
    await client.connect();
    console.log("Connected successfully to target database!");
    
    // Target DB name is "tradetalks" as used by the application code
    const targetDbName = "tradetalks";
    const db = client.db(targetDbName);
    
    const collectionsToRestore = ["registrations", "awarded_badges", "badge_rules", "traders", "mock_data"];
    
    for (const colName of collectionsToRestore) {
      const filename = `backup_${colName}.json`;
      if (!fs.existsSync(filename)) {
        console.log(`No backup file found for ${colName} (${filename}). Skipping.`);
        continue;
      }
      
      const fileData = fs.readFileSync(filename, "utf8");
      const docs = JSON.parse(fileData);
      
      if (docs.length === 0) {
        console.log(`Backup file ${filename} is empty. Skipping.`);
        continue;
      }
      
      console.log(`Restoring ${docs.length} documents into ${colName}...`);
      
      // Clean existing collection first to avoid duplicates
      await db.collection(colName).deleteMany({});
      
      // MongoDB insertMany throws error if array is empty, which we checked
      const result = await db.collection(colName).insertMany(docs);
      console.log(`Successfully restored ${result.insertedCount} documents into '${colName}' collection.`);
    }
    
    console.log("\nImport process completed successfully!");
  } catch (err) {
    console.error("Import Error:", err);
  } finally {
    await client.close();
  }
}

run();
