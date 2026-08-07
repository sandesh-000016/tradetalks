import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const checkAuth = async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === "authenticated_token_value";
};

// Season boundaries — dummy traders must have a registration date within the season
const SEASON_REGISTRATION_DATE = "2025-11-01T00:00:00.000Z";

// GET — fetch all dummy traders
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const client = await clientPromise;
    if (!client) throw new Error("Database connection failed");
    const db = client.db("tradetalks");
    const dummies = await db.collection("traders").find({ isDummy: true }).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, traders: dummies });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST — create a new dummy trader
export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { clientName, country, netDeposit, currentBalance, volume } = body;

    if (!clientName || netDeposit === undefined || currentBalance === undefined) {
      return NextResponse.json(
        { success: false, error: "Name, net deposit, and current balance are required." },
        { status: 400 }
      );
    }

    const net = Number(netDeposit);
    const bal = Number(currentBalance);
    const vol = Number(volume ?? 0);

    // ROI = ((currentBalance - netDeposit) / netDeposit) * 100
    const profit = net > 0 ? Number((((bal - net) / net) * 100).toFixed(2)) : 0;

    const clientId = `dummy_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const client = await clientPromise;
    if (!client) throw new Error("Database connection failed");
    const db = client.db("tradetalks");

    const doc = {
      clientId,
      clientName: clientName.trim(),
      country: country?.trim() || "India",
      totalNetDeposits: net,
      lastRecordedBalance: bal,
      volume: vol,
      profit,
      isDummy: true,
      isRegistered: true,
      isWashedOut: false,
      registrationDate: SEASON_REGISTRATION_DATE,
      twrFactor: 1.0,
      startingBalanceOfThisPeriod: net,
      lastUpdated: new Date(),
      createdAt: new Date(),
    };

    const result = await db.collection("traders").insertOne(doc);
    return NextResponse.json({ success: true, trader: { ...doc, _id: result.insertedId } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT — update an existing dummy trader
export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { _id, clientName, country, netDeposit, currentBalance, volume } = body;

    if (!_id) {
      return NextResponse.json({ success: false, error: "Missing _id" }, { status: 400 });
    }

    const net = Number(netDeposit);
    const bal = Number(currentBalance);
    const vol = Number(volume ?? 0);
    const profit = net > 0 ? Number((((bal - net) / net) * 100).toFixed(2)) : 0;

    const client = await clientPromise;
    if (!client) throw new Error("Database connection failed");
    const db = client.db("tradetalks");

    await db.collection("traders").updateOne(
      { _id: new ObjectId(_id), isDummy: true },
      {
        $set: {
          clientName: clientName.trim(),
          country: country?.trim() || "India",
          totalNetDeposits: net,
          lastRecordedBalance: bal,
          volume: vol,
          profit,
          twrFactor: 1.0,
          startingBalanceOfThisPeriod: net,
          lastUpdated: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE — remove a dummy trader by id
export async function DELETE(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
    }

    const client = await clientPromise;
    if (!client) throw new Error("Database connection failed");
    const db = client.db("tradetalks");

    const result = await db.collection("traders").deleteOne({
      _id: new ObjectId(id),
      isDummy: true,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Dummy trader not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
