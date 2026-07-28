import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIntegratedLeaderboard } from "@/lib/alpariApi";

async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session && session.value === "authenticated_token_value";
}

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim().toLowerCase() || "";

    if (!query) {
      return NextResponse.json({ success: true, traders: [] });
    }

    // Retrieve all live traders (including unregistered and washed out ones)
    // bypassCache = true to ensure fresh live API metrics
    const allTraders = await getIntegratedLeaderboard("all", true, true);

    const filtered = allTraders.filter((t: any) => {
      const name = String(t.name || "").toLowerCase();
      const extId = String(t.id || t.externalClientId || "").toLowerCase();
      const numId = String(t.internalId || "").toLowerCase();

      return name.includes(query) || extId.includes(query) || numId.includes(query);
    });

    return NextResponse.json({ success: true, traders: filtered });
  } catch (error: any) {
    console.error("[Admin Live Search API] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to search live traders" }, { status: 500 });
  }
}
