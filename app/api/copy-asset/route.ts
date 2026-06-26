import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const srcPath = `C:\\Users\\SANDESH\\.gemini\\antigravity\\brain\\05c3bebb-e6ed-421e-9f6b-cca56bdc89dd\\trading_trophy_1782459405664.png`;
    const destDir = path.join(process.cwd(), "public");
    const destPath = path.join(destDir, "trading_trophy.png");

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      return NextResponse.json({ success: true, message: `Copied to ${destPath}` });
    } else {
      return NextResponse.json({ success: false, message: `Source file not found at ${srcPath}` }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
