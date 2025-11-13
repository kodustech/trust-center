import { redirect } from "next/navigation";

export default function BuilderRedirectPage() {
  redirect("/admin?tab=builder");
}

