import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

async function getCollection() {
  if (!clientPromise) throw new Error("Database not configured.");
  const mongoClient = await clientPromise;
  const db = mongoClient.db("tradetalks");
  const col = db.collection<any>("registrations");
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
      place,
      country,
      occupation,
      market,
      capital,
    } = body;

    if (!fullName || !phone || !email || !place || !country || !occupation || !market || !capital) {
      return NextResponse.json({ error: "All fields (Name, Place, Country, Email, Mobile number, Occupation, Market, Capital) are required." }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    // Mobile validation: 10 digits
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    let finalPhone = cleanPhone;
    if (cleanPhone.length === 12 && cleanPhone.startsWith("91")) {
      finalPhone = cleanPhone.slice(2);
    }
    if (!/^[6-9]\d{9}$/.test(finalPhone)) {
      return NextResponse.json({ error: "Mobile number must be a valid 10-digit number." }, { status: 400 });
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
      phone: finalPhone,
      email,
      place,
      country,
      occupation,
      market,
      capital,
      submittedAt: new Date(),
    };

    await col.insertOne(doc);

    return NextResponse.json({ success: true, message: "Registration submitted successfully!" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to submit registration." }, { status: 500 });
  }
}
