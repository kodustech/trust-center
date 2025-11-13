import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GithubSignInButton } from "@/components/auth/github-sign-in-button";

export const metadata: Metadata = {
  title: "Sign in | EzTrust",
  description: "Sign in with GitHub to access the admin area.",
};

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Access the admin area</CardTitle>
          <p className="text-sm text-muted-foreground">
            Connect with your GitHub account to unlock edit mode and review document requests.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <GithubSignInButton />
          <p className="text-center text-sm text-muted-foreground">
            Or go back to the{" "}
            <Link href="/" className="font-medium underline">
              public page
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
