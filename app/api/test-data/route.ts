import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MOCK_FILE_PATH = path.join(process.cwd(), "test_alpari_responses.json");

// GET: Display the current mock test data
export async function GET() {
  try {
    if (!fs.existsSync(MOCK_FILE_PATH)) {
      return NextResponse.json(
        {
          success: false,
          error: "Test response file not found. Please run 'node generate_test_data.js' to create the mock data.",
        },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(MOCK_FILE_PATH, "utf8");
    const data = JSON.parse(fileContent);
    const prettyJson = JSON.stringify(data, null, 2);

    return new Response(prettyJson, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("GET test-data error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to read test data." },
      { status: 500 }
    );
  }
}

// POST: Dynamically vary/update the test data
export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Basic structure verification
    if (!payload || (!payload.performance && !payload.referrals && !payload.insights)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid mock data structure. Must contain at least one of: performance, referrals, insights.",
        },
        { status: 400 }
      );
    }

    // Preserve existing data for missing keys
    let currentData: any = {};
    if (fs.existsSync(MOCK_FILE_PATH)) {
      try {
        currentData = JSON.parse(fs.readFileSync(MOCK_FILE_PATH, "utf8"));
      } catch (e) {
        currentData = {};
      }
    }

    const mergedData = {
      performance: payload.performance || currentData.performance || [],
      referrals: payload.referrals || currentData.referrals || [],
      insights: payload.insights || currentData.insights || [],
    };

    // Write back to test_alpari_responses.json
    fs.writeFileSync(MOCK_FILE_PATH, JSON.stringify(mergedData, null, 2), "utf8");

    return NextResponse.json({
      success: true,
      message: "Test data successfully updated! The leaderboard has been refreshed with your changes.",
      counts: {
        performance: mergedData.performance.length,
        referrals: mergedData.referrals.length,
        insights: mergedData.insights.length,
      },
    });
  } catch (error: any) {
    console.error("POST test-data error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save test data." },
      { status: 500 }
    );
  }
}
