import { NextResponse } from "next/server";
import { verifyAlpariClientDirect } from "@/lib/alpariApi";

export async function POST(request: Request) {
  try {
    const { clientId } = await request.json();

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: "Client ID is required." },
        { status: 400 }
      );
    }

    const foundClient = await verifyAlpariClientDirect(clientId);

    if (!foundClient) {
      return NextResponse.json({
        success: false,
        error: `Client ID '${clientId.trim()}' was not found in our challenge database. Make sure you opened your account using the official referral link below.`,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Client verified successfully!",
      client: {
        id: foundClient.id,
        name: foundClient.name,
        balance: foundClient.balance,
      },
    });
  } catch (error: any) {
    console.error("Verification API Error:", error);
    return NextResponse.json(
      { success: false, error: "Server verification failed. Please try again later." },
      { status: 500 }
    );
  }
}
