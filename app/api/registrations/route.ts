import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

async function getCollection() {
  if (!clientPromise) throw new Error("Database not configured.");
  const mongoClient = await clientPromise;
  const db = mongoClient.db("tradetalks");
  const col = db.collection("registrations");
  // Ensure indexes for fast lookups (idempotent)
  await col.createIndex({ clientId: 1 }, { unique: true, sparse: true }).catch(() => {});
  await col.createIndex({ submittedAt: -1 }).catch(() => {});
  return col;
}

// GET: Fetch all registrations (admin only)
export async function GET() {
  try {
    const col = await getCollection();
    const registrations = await col.find({}).sort({ submittedAt: -1 }).toArray();
    return NextResponse.json({ success: true, registrations });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch registrations." }, { status: 500 });
  }
}

// POST: Submit a new registration
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      clientId,
      clientName,
      fullName,
      phone,
      email,
      city,
      state,
      experience,
      howHeard,
      tradingGoal,
    } = body;

    if (!fullName || !phone) {
      return NextResponse.json({ error: "Full Name and Phone are required." }, { status: 400 });
    }

    const col = await getCollection();

    // Check for duplicate registration by clientId
    if (clientId) {
      const existing = await col.findOne({ clientId });
      if (existing) {
        return NextResponse.json({ success: true, alreadyRegistered: true, message: "You have already registered." });
      }
    }

    const doc = {
      clientId: clientId || "",
      clientName: clientName || fullName,
      fullName,
      phone,
      email: email || "",
      city: city || "",
      state: state || "",
      experience: experience || "",
      howHeard: howHeard || "",
      tradingGoal: tradingGoal || "",
      submittedAt: new Date(),
    };

    await col.insertOne(doc);

    return NextResponse.json({ success: true, message: "Registration submitted successfully!" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to submit registration." }, { status: 500 });
  }
}
