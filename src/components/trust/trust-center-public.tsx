"use client";

import { TrustCenterConfig } from "@/lib/trust-config";
import { TrustCenterPreview } from "@/components/trust/trust-center-preview";
import { cn } from "@/lib/utils";

type Props = {
  config: TrustCenterConfig;
};

export function TrustCenterPublic({ config }: Props) {
  const isDark = config.theme === "dark";
  const requestEmail = config.contactEmail ?? config.contacts?.email;

  function handleRequest(documentName: string) {
    if (!requestEmail) return;
    const subject = encodeURIComponent(
      `Document request: ${documentName}`
    );
    const body = encodeURIComponent(
      `Hi ${config.company.name} team,\n\nI'd like to request access to: ${documentName}.\n\nContext:\n\nThanks,\n`
    );
    window.location.href = `mailto:${requestEmail}?subject=${subject}&body=${body}`;
  }

  return (
    <div className={cn(isDark && "dark")}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-3 rounded-3xl border px-6 py-5 shadow-sm",
            isDark
              ? "border-slate-800 bg-slate-900 text-slate-100"
              : "border-slate-200 bg-white/80 text-slate-900"
          )}
        >
          <div>
            <h1 className="text-3xl font-semibold">
              {config.company.name} Trust Center
            </h1>
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
        <footer
          className={cn(
            "flex flex-wrap items-center justify-center gap-3 rounded-2xl border px-4 py-3 text-sm text-muted-foreground",
            isDark
              ? "border-slate-800 bg-slate-900 text-slate-300"
              : "border-slate-200 bg-white/80"
          )}
        >
          <span>
            Powered by{" "}
            <a
              href="https://github.com/hilljw/trust-center-static"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline-offset-4 hover:underline"
            >
              trust-center-static
            </a>
          </span>
        </footer>
      </div>
    </div>
  );
}
