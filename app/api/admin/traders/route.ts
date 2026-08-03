import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { verifyAlpariClientDirect, getIntegratedLeaderboard } from "@/lib/alpariApi";

// Helper to verify admin authentication
async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session && session.value === "authenticated_token_value";
}

// GET: Fetch all registered/verified traders from MongoDB
export async function GET() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!clientPromise) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db("tradetalks");
    
    // Fetch all traders where isRegistered is true
    const registeredTraders = await db
      .collection<any>("traders")
      .find({ isRegistered: true })
      .toArray();

    return NextResponse.json({ success: true, traders: registeredTraders });
  } catch (error: any) {
    console.error("[Admin API GET] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch traders" }, { status: 500 });
  }
}

// POST: Manually verify/register a trader by Client ID
export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { clientId } = await request.json();
    if (!clientId) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
    }

    const result = await verifyAlpariClientDirect(clientId);
    if (!result) {
      return NextResponse.json({
        success: false,
        error: "Client not found in Alpari API or database. Please check the Client ID."
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Trader manually registered successfully!",
      trader: result
    });
  } catch (error: any) {
    console.error("[Admin API POST] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to register trader" }, { status: 500 });
  }
}

// PUT: Update a trader's net deposit, cash flow, or washout status
export async function PUT(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { clientId, totalNetDeposits, isWashedOut, updateType, cashFlowAmount } = body;
    if (!clientId) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
    }

    if (!clientPromise) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db("tradetalks");

    const updateFields: any = {};

    const numId = isNaN(Number(clientId)) ? -1 : Number(clientId);
    const traderFilter = {
      $or: [
        { _id: clientId },
        { clientId: clientId },
        { numericId: numId },
        { _id: numId }
      ]
    };

    if (updateType === "twr_cash_flow" && cashFlowAmount !== undefined) {
      const dbTrader = await db.collection<any>("traders").findOne(traderFilter);
      if (dbTrader) {
        const cashFlow = Number(cashFlowAmount);
        const oldNetDeposits = dbTrader.totalNetDeposits ?? 100;
        const currentBalance = dbTrader.lastRecordedBalance ?? oldNetDeposits;
        const twrFactor = dbTrader.twrFactor ?? 1.0;
        const startingBalance = dbTrader.startingBalanceOfThisPeriod ?? oldNetDeposits;

        // 1. Calculate return for the sub-period preceding this cash flow
        let periodReturn = 0;
        if (startingBalance > 0) {
          periodReturn = (currentBalance - startingBalance) / startingBalance;
        }

        // 2. Lock in return into twrFactor
        const newTwrFactor = twrFactor * (1 + periodReturn);
        const newBalance = currentBalance + cashFlow;
        const newNetDeposits = oldNetDeposits + cashFlow;
        const currentOffset = dbTrader.simulatedBalanceOffset ?? 0;

        updateFields.totalNetDeposits = newNetDeposits;
        updateFields.lastRecordedBalance = newBalance;
        updateFields.twrFactor = newTwrFactor;
        updateFields.startingBalanceOfThisPeriod = newBalance;
        updateFields.simulatedBalanceOffset = currentOffset + cashFlow;
      }
    } else if (updateType === "reset_simulation") {
      updateFields.simulatedBalanceOffset = 0;
      updateFields.twrFactor = 1.0;
      updateFields.totalNetDeposits = 175.56;
      updateFields.startingBalanceOfThisPeriod = 175.56;
    } else if (totalNetDeposits !== undefined) {
      const newNetDeposits = Number(totalNetDeposits);
      updateFields.totalNetDeposits = newNetDeposits;
      updateFields.simulatedBalanceOffset = 0;

      // Re-baseline TWR variables to the updated deposit amount so ROI accurately reflects performance from the new deposit base
      updateFields.twrFactor = 1.0;
      updateFields.startingBalanceOfThisPeriod = newNetDeposits;
    }
    if (isWashedOut !== undefined) {
      updateFields.isWashedOut = Boolean(isWashedOut);
      updateFields.manualDisqualified = Boolean(isWashedOut);
    }

    updateFields.lastUpdated = new Date();

    const result = await db.collection<any>("traders").updateOne(
      traderFilter,
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Trader not found" }, { status: 404 });
    }

    // Invalidate the cache to ensure leaderboard reflects changes immediately
    const cacheDb = mongoClient.db("tradetalks");
    await cacheDb.collection<any>("api_cache").deleteOne({ _id: "leaderboard_data" });

    return NextResponse.json({ success: true, message: "Trader updated successfully!" });
  } catch (error: any) {
    console.error("[Admin API PUT] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update trader" }, { status: 500 });
  }
}

// DELETE: Unregister/Remove a trader from the leaderboard
export async function DELETE(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");

    if (!clientId) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
    }

    if (!clientPromise) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db("tradetalks");

    const numId = isNaN(Number(clientId)) ? -1 : Number(clientId);
    const traderFilter = {
      $or: [
        { _id: clientId },
        { clientId: clientId },
        { numericId: numId },
        { _id: numId }
      ]
    };

    // Remove registration status (we set isRegistered to false, keeping the data in DB but removing them from leaderboard/sidebar)
    const result = await db.collection<any>("traders").updateOne(
      traderFilter,
      { $set: { isRegistered: false, lastUpdated: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Trader not found" }, { status: 404 });
    }

    // Invalidate cache
    await db.collection<any>("api_cache").deleteOne({ _id: "leaderboard_data" });

    return NextResponse.json({ success: true, message: "Trader unregistered successfully!" });
  } catch (error: any) {
    console.error("[Admin API DELETE] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to unregister trader" }, { status: 500 });
  }
}
