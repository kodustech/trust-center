import type { Metadata } from "next";
import { TrustCenterPublic } from "@/components/trust/trust-center-public";
import { DEFAULT_TRUST_YAML, safeParseTrustCenter } from "@/lib/trust-config";
import { getStoredTrustConfig } from "@/lib/trust-config-store";
import { cn } from "@/lib/utils";

async function loadTrustConfig() {
  let yaml = DEFAULT_TRUST_YAML;

  try {
    const stored = await getStoredTrustConfig();
    if (stored?.yaml) {
      yaml = stored.yaml;
    }
  } catch (error) {
    console.error("Falling back to default trust center config:", error);
  }

  const parsed = safeParseTrustCenter(yaml);
  if (parsed.ok) {
    return parsed.data;
  }

  const fallbackParsed = safeParseTrustCenter(DEFAULT_TRUST_YAML);
  if (!fallbackParsed.ok) {
    throw new Error(
      `Failed to load trust center configuration: ${parsed.error}`
    );
  }

  return fallbackParsed.data;
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
