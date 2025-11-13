"use client";

import { useTransition } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() =>
        startTransition(() => {
          void signOut({ callbackUrl: "/" });
        })
      }
      disabled={isPending}
    >
      <LogOut className="mr-2 h-3.5 w-3.5" />
      {isPending ? "Signing out..." : "Sign out"}
    </Button>
  );
}
