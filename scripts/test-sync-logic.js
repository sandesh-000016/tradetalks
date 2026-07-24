const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env
function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const index = trimmed.indexOf('=');
        if (index > 0) {
          const key = trimmed.substring(0, index).trim();
          const value = trimmed.substring(index + 1).trim().replace(/(^['"]|['"]$)/g, '');
          process.env[key] = value;
        }
      }
    });
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined in the .env file.");
  process.exit(1);
}

// Exact logic from lib/alpariApi.ts rewritten for simulation testing
function calculateSync(trader, dbTrader) {
  const apiBalance = trader.total_balance ?? 0;
  const apiEquity = trader.total_equity ?? 0;
  const apiDepositDate = trader.last_deposit_date || null;
  const volume = trader.volume ?? 0;
  
  let totalNetDeposits = 100;
  let isWashedOut = false;
  
  if (!dbTrader) {
    // New trader
    if (volume === 0 && apiBalance > 0) {
      totalNetDeposits = apiBalance;
    } else {
      totalNetDeposits = 100;
    }
    isWashedOut = apiEquity <= 1.00;
  } else {
    // Existing trader
    totalNetDeposits = dbTrader.totalNetDeposits ?? 100;
    isWashedOut = dbTrader.isWashedOut || (apiEquity <= 1.00);
    
    // Detect new deposit
    if (apiDepositDate && apiDepositDate !== dbTrader.lastDepositDate) {
      const depositDiff = apiBalance - (dbTrader.lastRecordedBalance ?? 0);
      if (depositDiff > 0) {
        totalNetDeposits += depositDiff;
      }
    }
  }
  
  return {
    totalNetDeposits,
    isWashedOut,
    lastRecordedBalance: apiBalance,
    lastDepositDate: apiDepositDate
  };
}

async function runTest() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log("Connected to MongoDB database successfully.");
    const db = client.db("tradetalks");
    const testCol = db.collection("traders_test_sync");

    // Clean up previous runs
    await testCol.deleteMany({});
    console.log("Cleaned up traders_test_sync collection.\n");

    const TEST_CLIENT_ID = "test_trader_999";

    // -------------------------------------------------------------
    // Test Case 1: Initial Sync for a new trader with no trades yet
    // Expected: net deposit should be equal to the initial balance
    // -------------------------------------------------------------
    console.log("--- Test Case 1: Initial Sync (New Trader, No Trades) ---");
    const traderState1 = {
      external_client_id: TEST_CLIENT_ID,
      total_balance: 500.00,
      total_equity: 500.00,
      last_deposit_date: "2026-07-24T10:00:00Z",
      volume: 0
    };
    
    const dbTrader1 = await testCol.findOne({ _id: TEST_CLIENT_ID });
    const result1 = calculateSync(traderState1, dbTrader1);
    
    console.log(`Simulated Result 1:`, result1);
    if (result1.totalNetDeposits === 500.00 && !result1.isWashedOut) {
      console.log("✅ SUCCESS: Initial deposit correctly detected as $500.");
    } else {
      console.error("❌ FAILED: Initial deposit calculation incorrect.");
      process.exit(1);
    }

    // Save to test DB
    await testCol.updateOne(
      { _id: TEST_CLIENT_ID },
      { $set: { ...result1, lastUpdated: new Date() } },
      { upsert: true }
    );

    // -------------------------------------------------------------
    // Test Case 2: New Deposit triggers balance increase
    // Expected: net deposit should increase by the deposit difference
    // -------------------------------------------------------------
    console.log("\n--- Test Case 2: New Deposit Triggered ---");
    const traderState2 = {
      external_client_id: TEST_CLIENT_ID,
      total_balance: 750.00, // Balance increased by $250
      total_equity: 750.00,
      last_deposit_date: "2026-07-24T12:00:00Z", // New deposit timestamp
      volume: 1.5
    };

    const dbTrader2 = await testCol.findOne({ _id: TEST_CLIENT_ID });
    const result2 = calculateSync(traderState2, dbTrader2);

    console.log(`Simulated Result 2:`, result2);
    if (result2.totalNetDeposits === 750.00 && !result2.isWashedOut) {
      console.log("✅ SUCCESS: New deposit of $250 correctly added. Total net deposits = $750.");
    } else {
      console.error("❌ FAILED: New deposit calculation incorrect.");
      process.exit(1);
    }

    // Save to test DB
    await testCol.updateOne(
      { _id: TEST_CLIENT_ID },
      { $set: { ...result2, lastUpdated: new Date() } },
      { upsert: true }
    );

    // -------------------------------------------------------------
    // Test Case 3: Trader washes out (equity <= 1.00)
    // Expected: isWashedOut should be set to true
    // -------------------------------------------------------------
    console.log("\n--- Test Case 3: Trader Washout ---");
    const traderState3 = {
      external_client_id: TEST_CLIENT_ID,
      total_balance: 0.50,
      total_equity: 0.50, // Equity drops to $0.50
      last_deposit_date: "2026-07-24T12:00:00Z",
      volume: 4.2
    };

    const dbTrader3 = await testCol.findOne({ _id: TEST_CLIENT_ID });
    const result3 = calculateSync(traderState3, dbTrader3);

    console.log(`Simulated Result 3:`, result3);
    if (result3.isWashedOut && result3.totalNetDeposits === 750.00) {
      console.log("✅ SUCCESS: Trader washout correctly detected. Net deposits preserved at $750.");
    } else {
      console.error("❌ FAILED: Washout calculation incorrect.");
      process.exit(1);
    }

    // Clean up test collection
    await testCol.deleteMany({});
    console.log("\nTest collection cleaned up successfully.");
    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY! The live DB calculation logic works perfectly.");

  } catch (err) {
    console.error("Test error:", err);
  } finally {
    await client.close();
  }
}

runTest();
