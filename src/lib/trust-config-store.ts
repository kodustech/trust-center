import { createServerClient } from "@/lib/supabase";
import { DEFAULT_TRUST_YAML } from "@/lib/trust-config";

const CONFIG_ID = "default";
const TABLE_NAME = "trust_configs";

export type StoredTrustConfig = {
  yaml: string;
  updatedAt: string | null;
};

export async function getStoredTrustConfig(): Promise<StoredTrustConfig> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("yaml, updated_at")
    .eq("id", CONFIG_ID)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    console.error("Failed to fetch trust config:", error);
    throw new Error("Unable to load trust center config.");
  }

  return {
    yaml: data?.yaml ?? DEFAULT_TRUST_YAML,
    updatedAt: data?.updated_at ?? null,
  };
}

export async function saveTrustConfig(yaml: string): Promise<StoredTrustConfig> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .upsert(
      {
        id: CONFIG_ID,
        yaml,
      },
      { onConflict: "id" }
    )
    .select("yaml, updated_at")
    .single();

  if (error || !data) {
    console.error("Failed to persist trust config:", error);
    throw new Error("Unable to save trust center config.");
  }

  return {
    yaml: data.yaml,
    updatedAt: data.updated_at ?? null,
  };
}
