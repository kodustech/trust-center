import { NextResponse } from "next/server";
import { safeParseTrustCenter } from "@/lib/trust-config";
import {
  getStoredTrustConfig,
  saveTrustConfig,
} from "@/lib/trust-config-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const config = await getStoredTrustConfig();
    return NextResponse.json({ data: config });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to load trust center configuration." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const yaml = typeof payload.yaml === "string" ? payload.yaml : "";
    if (!yaml.trim()) {
      return NextResponse.json(
        { error: "YAML payload cannot be empty." },
        { status: 400 }
      );
    }

    const parsed = safeParseTrustCenter(yaml);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const saved = await saveTrustConfig(yaml);
    return NextResponse.json({ data: saved });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to save trust center configuration." },
      { status: 500 }
    );
  }
}

