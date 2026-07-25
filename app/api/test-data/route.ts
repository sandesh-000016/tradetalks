import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import clientPromise from "@/lib/mongodb";

const mockFilePath = path.join(process.cwd(), "test_alpari_responses.json");

// Helper to get raw file content / DB content
async function readMockData() {
  if (clientPromise) {
    try {
      const mongoClient = await clientPromise;
      const db = mongoClient.db("tradetalks");
      const dbData = await db.collection<any>("mock_data").findOne({ _id: "current_mock_data" });
      if (dbData) {
        return dbData;
      }
    } catch (dbErr) {
      console.error("[API test-data] DB Read failed, falling back to file:", dbErr);
    }
  }

  // Fallback to filesystem
  try {
    const data = await fs.readFile(mockFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return { performance: [], referrals: [], insights: [] };
  }
}

// Helper to save data
async function saveMockData(data: any) {
  if (clientPromise) {
    const mongoClient = await clientPromise;
    const db = mongoClient.db("tradetalks");
    await db.collection<any>("mock_data").updateOne(
      { _id: "current_mock_data" },
      {
        $set: {
          performance: data.performance,
          referrals: data.referrals,
          insights: data.insights,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
    return;
  }

  // Fallback to file system (local development without DB)
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    throw new Error("MONGODB_URI environment variable is missing on Vercel. In serverless environments, the filesystem is read-only. Please add MONGODB_URI to your Vercel Project Settings to persist mock data.");
  }

  await fs.writeFile(mockFilePath, JSON.stringify(data, null, 2), "utf8");
}

export async function GET() {
  try {
    const data = await readMockData();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load mock data." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid data format. JSON object required." },
        { status: 400 }
      );
    }

    // Basic structure check
    if (!Array.isArray(body.performance) || !Array.isArray(body.referrals) || !Array.isArray(body.insights)) {
      return NextResponse.json(
        { success: false, error: "JSON must contain 'performance', 'referrals', and 'insights' arrays." },
        { status: 400 }
      );
    }

    await saveMockData(body);

    return NextResponse.json({
      success: true,
      message: "Mock data updated successfully!",
      tradersCount: body.performance.length
    });
  } catch (error: any) {
    console.error("Mock-Data Save Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save mock data." },
      { status: 500 }
    );
  }
}
