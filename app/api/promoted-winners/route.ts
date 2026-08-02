import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session && session.value === "authenticated_token_value";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdminMode = searchParams.get("admin") === "true";

    if (isAdminMode && !(await checkAdminAuth())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!clientPromise) {
      return NextResponse.json({ success: true, winners: [] });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db("tradetalks");
    const collection = db.collection<any>("promoted_winners");

    const query = isAdminMode ? {} : { enabled: true };
    const winners = await collection.find(query).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ success: true, winners });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await checkAdminAuth())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!clientPromise) {
      return NextResponse.json({ success: false, error: "Database not connected" }, { status: 500 });
    }

    const body = await request.json();
    const { name, challengeName, description, rank, profit, photo, enabled, clientId } = body;

    if (!name || !challengeName || !description) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db("tradetalks");
    const collection = db.collection<any>("promoted_winners");

    const newWinner = {
      name,
      challengeName,
      description,
      rank: rank || "1",
      profit: profit || "",
      photo: photo || "",
      enabled: enabled !== false,
      clientId: clientId || "",
      createdAt: new Date()
    };

    const result = await collection.insertOne(newWinner);

    return NextResponse.json({ success: true, message: "Winner promoted successfully", id: result.insertedId });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await checkAdminAuth())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!clientPromise) {
      return NextResponse.json({ success: false, error: "Database not connected" }, { status: 500 });
    }

    const body = await request.json();
    const { id, _id, name, challengeName, description, rank, profit, photo, enabled, clientId } = body;
    const winnerId = id || _id;

    if (!winnerId) {
      return NextResponse.json({ success: false, error: "Winner ID is required" }, { status: 400 });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db("tradetalks");
    const collection = db.collection<any>("promoted_winners");

    const updateDoc: any = {};
    if (name !== undefined) updateDoc.name = name;
    if (challengeName !== undefined) updateDoc.challengeName = challengeName;
    if (description !== undefined) updateDoc.description = description;
    if (rank !== undefined) updateDoc.rank = rank;
    if (profit !== undefined) updateDoc.profit = profit;
    if (photo !== undefined) updateDoc.photo = photo;
    if (enabled !== undefined) updateDoc.enabled = enabled;
    if (clientId !== undefined) updateDoc.clientId = clientId;

    await collection.updateOne(
      { _id: new ObjectId(winnerId) },
      { $set: updateDoc }
    );

    return NextResponse.json({ success: true, message: "Winner updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await checkAdminAuth())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!clientPromise) {
      return NextResponse.json({ success: false, error: "Database not connected" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Winner ID required" }, { status: 400 });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db("tradetalks");
    const collection = db.collection<any>("promoted_winners");

    await collection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true, message: "Winner deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
