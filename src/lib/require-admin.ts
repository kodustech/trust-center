import { NextResponse } from "next/server";
import { auth } from "./auth";

/**
 * Comma-separated list of emails allowed to access admin features.
 * Example: "alice@company.com,bob@company.com"
 */
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export type AdminSession = {
  user: { name?: string | null; email?: string | null; image?: string | null };
};

/**
 * Returns the session if the current user is an allowed admin.
 * Returns null otherwise.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const session = await auth();
  if (!session?.user?.email) return null;

  if (ADMIN_EMAILS.length === 0) return null;
  if (!ADMIN_EMAILS.includes(session.user.email.toLowerCase())) return null;

  return session as AdminSession;
}

/**
 * Guard for API routes. Returns a 401/403 NextResponse if the user
 * is not an authenticated admin, or null if the request is allowed.
 */
export async function requireAdminApi(): Promise<NextResponse | null> {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (!session.user.email) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  if (ADMIN_EMAILS.length === 0) {
    return NextResponse.json({ error: "Forbidden. No admins configured." }, { status: 403 });
  }

  if (!ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  return null; // access granted
}
