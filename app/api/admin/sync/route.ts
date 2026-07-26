import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIntegratedLeaderboard } from "@/lib/alpariApi";

async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session && session.value === "authenticated_token_value";
}

export async function POST() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Admin Sync] Admin requested manual Alpari API synchronization...");
    
    // Fetch and sync data bypassing the cache
    const data = await getIntegratedLeaderboard("all", false, true);

    return NextResponse.json({
      success: true,
      message: "Data synchronized successfully!",
      count: data.length
    });
  } catch (error: any) {
    console.error("[Admin Sync Error]:", error);
    return NextResponse.json({ error: error.message || "Sync failed" }, { status: 500 });
  }
}
