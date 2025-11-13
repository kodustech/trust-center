"use client";

import Link from "next/link";
import { useState } from "react";
import { TrustCenterConfig } from "@/lib/trust-config";
import { Button } from "@/components/ui/button";
import { TrustCenterPreview } from "@/components/trust/trust-center-preview";
import { RequestDocumentDialog } from "@/components/trust/request-document-dialog";
import { cn } from "@/lib/utils";

type Props = {
  config: TrustCenterConfig;
};

export function TrustCenterPublic({ config }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const isDark = config.theme === "dark";

  function handleRequest(documentName: string) {
    setSelectedDocument(documentName);
    setDialogOpen(true);
  }

  return (
    <div className={cn(isDark && "dark")}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className={cn("flex flex-wrap items-center justify-between gap-3 rounded-3xl border px-6 py-5 shadow-sm",
            isDark ? "border-slate-800 bg-slate-900 text-slate-100" : "border-slate-200 bg-white/80 text-slate-900"
        )}>
          <div>
            <h1 className="text-3xl font-semibold">{config.company.name} Trust Center</h1>
            <p className="text-sm text-muted-foreground">
              Transparency about security, compliance, and infrastructure in one place.
            </p>
          </div>
        </div>
        <TrustCenterPreview
          config={config}
          onRequestDocument={handleRequest}
          showAdminLink={false}
          theme={config.theme}
        />
        <RequestDocumentDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          documentName={selectedDocument}
          companyName={config.company.name}
        />
        <footer className={cn(
          "flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm text-muted-foreground",
          isDark ? "border-slate-800 bg-slate-900 text-slate-300" : "border-slate-200 bg-white/80"
        )}>
          <span>Made by Kodus</span>
          <Button asChild size="sm" variant="ghost">
            <Link href="/login">Sign in to admin</Link>
          </Button>
        </footer>
      </div>
    </div>
  );
}
