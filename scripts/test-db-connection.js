// scripts/test-db-connection.js
// Run this script using: node scripts/test-db-connection.js

const { MongoClient } = require("mongodb");
const path = require("path");
const fs = require("fs");

// Simple helper to load environment variables from .env
function loadEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        process.env[key] = value.trim();
      }
    });
  }
}

async function testConnection() {
  loadEnv();

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("\x1b[31mError: MONGODB_URI is not set in your .env file.\x1b[0m");
    process.exit(1);
  }

  console.log("Attempting to connect to MongoDB Atlas...");
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("\x1b[32m✔ Successfully connected to MongoDB Atlas!\x1b[0m");

    const db = client.db("tradetalks");
    console.log(`Connected to database: "${db.databaseName}"`);

    // List collections
    const collections = await db.listCollections().toArray();
    console.log("Available collections:");
    if (collections.length === 0) {
      console.log("  (No collections created yet - they will be initialized on first run)");
    } else {
      collections.forEach((col) => console.log(`  - ${col.name}`));
    }

  } catch (error) {
    console.error("\x1b[31m✖ Failed to connect to MongoDB Atlas!\x1b[0m");
    console.error(error);
  } finally {
    await client.close();
  }
}

testConnection();
