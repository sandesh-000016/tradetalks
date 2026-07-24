import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const mockFilePath = path.join(process.cwd(), "test_alpari_responses.json");

// Helper to check authorization
function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  const token = process.env.ADMIN_TOKEN || process.env.ALPARI_PRIVATE_TOKEN;
  
  if (!token) {
    console.error("[Admin API] Auth Token configuration missing.");
    return false;
  }
  return authHeader === `Bearer ${token}`;
}

// Helper to get raw file content
async function readMockData() {
  try {
    const data = await fs.readFile(mockFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return { performance: [], referrals: [], insights: [] };
  }
}

// Helper to save data
async function saveMockData(data: any) {
  await fs.writeFile(mockFilePath, JSON.stringify(data, null, 2), "utf8");
}

export async function GET(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

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
    if (!isAuthorized(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

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
    console.error("Admin Mock-Data Save Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save mock data." },
      { status: 500 }
    );
  }
}

