"use client";

import { useTransition } from "react";
import { signIn } from "next-auth/react";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GithubSignInButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      className="w-full"
      onClick={() =>
        startTransition(() => {
          void signIn("github", { callbackUrl: "/admin" });
        })
      }
      disabled={isPending}
    >
      <Github className="mr-2 h-4 w-4" />
      {isPending ? "Connecting..." : "Continue with GitHub"}
    </Button>
  );
}
