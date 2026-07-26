import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (password === adminPassword) {
      const cookieStore = await cookies();
      // Set a simple session cookie for 1 day
      cookieStore.set("admin_session", "authenticated_token_value", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });

      return NextResponse.json({ success: true, message: "Logged in successfully" });
    }

    return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
  } catch (error: any) {
    console.error("Admin Login Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");
    if (session && session.value === "authenticated_token_value") {
      return NextResponse.json({ authenticated: true });
    }
    return NextResponse.json({ authenticated: false });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}
