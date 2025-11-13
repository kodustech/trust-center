import { NextResponse } from "next/server";
import { z } from "zod";
import { addRequest, listRequests } from "@/lib/request-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestSchema = z.object({
  email: z.string().email(),
  document: z.string().min(2),
  company: z.string().min(2),
  message: z.string().max(500).optional(),
});

export async function GET() {
  const data = await listRequests();
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const data = requestSchema.parse(payload);
    const created = await addRequest(data);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.issues.map((issue) => issue.message).join(", "),
        },
        { status: 400 }
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: "Could not register the request." },
      { status: 500 }
    );
  }
}
