import { getServerSession } from "next-auth";
import { authOptions } from "./auth-options";

export function auth() {
  return getServerSession(authOptions);
}

