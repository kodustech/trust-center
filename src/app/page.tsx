import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { TrustCenterPublic } from "@/components/trust/trust-center-public";
import { safeParseTrustCenter } from "@/lib/trust-config";
import { cn } from "@/lib/utils";

async function loadTrustConfig() {
  const yamlPath = path.join(process.cwd(), "data", "trust.yaml");
  const yaml = await readFile(yamlPath, "utf-8");
  const parsed = safeParseTrustCenter(yaml);
  if (!parsed.ok) {
    throw new Error(`Failed to parse data/trust.yaml: ${parsed.error}`);
  }
  return parsed.data;
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await loadTrustConfig();
  return {
    title: `${config.company.name} | Trust Center`,
    description: config.company.description,
  };
}

export default async function Home() {
  const config = await loadTrustConfig();
  const isDark = config.theme === "dark";

  return (
    <div className={cn(isDark && "dark")}>
      <main
        className={cn(
          "min-h-screen px-4 py-10 transition-colors",
          isDark
            ? "bg-slate-950 text-slate-50"
            : "bg-slate-100/70 text-slate-900"
        )}
      >
        <TrustCenterPublic config={config} />
      </main>
    </div>
  );
}
