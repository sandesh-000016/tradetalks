import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    if (!clientPromise) {
      return NextResponse.json({ success: true, awardedBadges: [] });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db("tradetalks");
    const collection = db.collection<any>("awarded_badges");

    const awardedBadges = await collection.find({}).toArray();

    return NextResponse.json({ success: true, awardedBadges });
  } catch (error: any) {
    console.error("GET Awarded Badges Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
