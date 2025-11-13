"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Copy, Eye, EyeOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_TRUST_YAML,
  safeParseTrustCenter,
  TrustCenterConfig,
} from "@/lib/trust-config";
import { TrustCenterPreview } from "@/components/trust/trust-center-preview";
import { RequestDocumentDialog } from "@/components/trust/request-document-dialog";

type Props = {
  initialYaml?: string;
  initialUpdatedAt?: string | null;
};

export function BuilderPanel({
  initialYaml = DEFAULT_TRUST_YAML,
  initialUpdatedAt = null,
}: Props) {
  const [yamlValue, setYamlValue] = useState(initialYaml);
  const [lastSavedYaml, setLastSavedYaml] = useState(initialYaml);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(initialUpdatedAt);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const parseResult = useMemo(() => safeParseTrustCenter(yamlValue), [yamlValue]);
  const config: TrustCenterConfig | null = parseResult.ok ? parseResult.data : null;
  const parseError = !parseResult.ok ? parseResult.error : null;

  function handleRequest(documentName: string) {
    setSelectedDocument(documentName);
    setDialogOpen(true);
  }

  async function copyYaml() {
    if (!("clipboard" in navigator)) {
      toast.error("Clipboard is not supported in this browser.");
      return;
    }

    try {
      await navigator.clipboard.writeText(yamlValue);
      toast.success("YAML copied to clipboard.");
    } catch {
      toast.error("Could not copy YAML.");
    }
  }

  function resetYaml() {
    setYamlValue(DEFAULT_TRUST_YAML);
    toast.success("Template restored.");
  }

  async function handleSave() {
    try {
      setIsSaving(true);
      const response = await fetch("/api/trust-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ yaml: yamlValue }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to save trust center.");
      }

      const saved = payload?.data;
      if (saved?.yaml) {
        setLastSavedYaml(saved.yaml);
        setLastSavedAt(saved.updatedAt ?? null);
      }
      toast.success("Trust center saved.");
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Failed to save trust center.";
      toast.error(description);
    } finally {
      setIsSaving(false);
    }
  }

  const isDirty = yamlValue !== lastSavedYaml;

  const editorSection = (
    <section className={showPreview ? "" : "w-full"}>
      <Card className="h-full border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Paste your YAML
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Every change updates the preview automatically. Use the template as a
            starting point and adjust it to match your program.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-muted-foreground">
              {lastSavedAt
                ? `Last saved ${new Date(lastSavedAt).toLocaleString()}`
                : "Not saved yet"}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={showPreview ? "outline" : "secondary"}
                size="sm"
                onClick={() => setShowPreview((prev) => !prev)}
              >
                {showPreview ? (
                  <>
                    <EyeOff className="mr-2 h-3.5 w-3.5" />
                    Hide preview
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-3.5 w-3.5" />
                    Show preview
                  </>
                )}
              </Button>
              <Button
                size="sm"
                disabled={!isDirty || isSaving}
                onClick={handleSave}
              >
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            className={`min-h-[560px] w-full resize-y text-sm font-mono leading-6 ${
              showPreview ? "" : "lg:min-h-[720px]"
            }`}
            value={yamlValue}
            onChange={(event) => setYamlValue(event.target.value)}
            spellCheck={false}
          />
          <div className="flex flex-wrap gap-2 text-sm">
            <Button variant="outline" size="sm" onClick={copyYaml}>
              <Copy className="mr-2 h-3.5 w-3.5" />
              Copy YAML
            </Button>
            <Button variant="ghost" size="sm" onClick={resetYaml}>
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              Restore template
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );

  const previewSection = showPreview ? (
    <section className="flex-1">
      {config ? (
            <TrustCenterPreview
              config={config}
              onRequestDocument={handleRequest}
              showAdminLink={false}
              theme={config.theme}
            />
      ) : (
        <Card className="border border-red-200 bg-red-50/70">
          <CardContent className="flex items-start gap-3 p-6">
            <AlertCircle className="mt-1 h-5 w-5 text-red-500" />
            <div>
              <p className="font-semibold text-red-900">
                We couldn&apos;t build the trust center.
              </p>
              <p className="text-sm text-red-700">{parseError}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  ) : null;

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-6 text-slate-900 shadow-sm">
      {showPreview ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(540px,720px)_1fr]">
          {editorSection}
          {previewSection}
        </div>
      ) : (
        <div className="flex flex-col gap-6">{editorSection}</div>
      )}
      {config && (
        <RequestDocumentDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          documentName={selectedDocument}
          companyName={config.company.name}
        />
      )}
    </div>
  );
}
