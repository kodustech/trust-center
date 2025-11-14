"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  BadgeCheck,
  BookOpen,
  FileText,
  Globe,
  Lock,
  Mail,
  Phone,
  Server,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { TrustCenterConfig } from "@/lib/trust-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  config: TrustCenterConfig;
  onRequestDocument: (documentName: string) => void;
  showAdminLink?: boolean;
  theme?: "light" | "dark";
};

type SectionKey =
  | "documents"
  | "compliance"
  | "policies"
  | "infrastructure"
  | "monitoring"
  | "updates"
  | "faqs"
  | "subprocessors"
  | "contacts";

type LayoutSpan = "full" | "half";

type SectionBlock = {
  key: SectionKey;
  span: LayoutSpan;
  element: ReactNode;
};

const SECTION_KEYS: SectionKey[] = [
  "documents",
  "compliance",
  "policies",
  "infrastructure",
  "monitoring",
  "updates",
  "faqs",
  "subprocessors",
  "contacts",
];

const DEFAULT_SECTION_LAYOUT: Record<SectionKey, LayoutSpan> = {
  documents: "full",
  compliance: "half",
  policies: "half",
  infrastructure: "half",
  monitoring: "half",
  updates: "half",
  faqs: "half",
  subprocessors: "full",
  contacts: "full",
};

const DEFAULT_SECTION_ORDER: SectionKey[] = [
  "compliance",
  "policies",
  "documents",
  "infrastructure",
  "monitoring",
  "updates",
  "faqs",
  "subprocessors",
  "contacts",
];

export function TrustCenterPreview({
  config,
  onRequestDocument,
  showAdminLink = false,
  theme = "light",
}: Props) {
  const hero = config.hero ?? { commitments: [] };
  const metrics = config.metrics ?? [];
  const compliance = config.compliance ?? [];
  const documents = config.documents ?? [];
  const policies = config.policies ?? [];
  const infrastructure = config.infrastructure;
  const monitoring = config.monitoring;
  const updates = config.updates ?? [];
  const faqs = config.faqs ?? [];
  const contacts = config.contacts;
  const subprocessors = config.subprocessors ?? [];

  const isDark = theme === "dark";
  const surfaceCard =
    "border border-slate-200 bg-white/70 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70";
  const sectionCard = "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900";

  const layoutConfig = config.layout ?? {};
  const getSpan = (key: SectionKey): LayoutSpan =>
    (layoutConfig[key] as LayoutSpan | undefined) ?? DEFAULT_SECTION_LAYOUT[key] ?? "full";

  const sectionBlocks: SectionBlock[] = [];
  const pushSection = (key: SectionKey, shouldRender: boolean, element: ReactNode) => {
    if (shouldRender) {
      sectionBlocks.push({ key, span: getSpan(key), element });
    }
  };

  const hasCompliance = config.compliance !== undefined;
  const hasPolicies = config.policies !== undefined;
  const hasDocuments = config.documents !== undefined;
  const hasInfrastructure = Boolean(
    infrastructure &&
      (infrastructure.hosting ||
        infrastructure.encryption ||
        infrastructure.retention ||
        infrastructure.backups ||
        infrastructure.dataResidency?.length ||
        infrastructure.dataCenters?.length)
  );
  const hasMonitoring = Boolean(
    monitoring && (monitoring.statusPage || monitoring.incidentHistory?.length)
  );
  const hasUpdates = config.updates !== undefined;
  const hasFaqs = config.faqs !== undefined;
  const hasSubprocessors =
    config.subprocessors !== undefined || Boolean(config.subprocessorsLink);
  const hasContacts = Boolean(contacts);

  pushSection(
    "compliance",
    hasCompliance,
    <Card className={sectionCard}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
          Certifications & compliance
        </CardTitle>
        <BadgeCheck className="h-4 w-4 text-emerald-500" />
      </CardHeader>
      <CardContent className="space-y-3">
        {compliance.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No certifications listed yet.
          </p>
        )}
        {compliance.map((item) => (
          <div
            key={`${item.name}-${item.status}`}
            className="rounded-lg border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-800/70"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{item.name}</p>
                {item.scope && (
                  <p className="text-xs text-muted-foreground dark:text-slate-400">
                    Scope: {item.scope}
                  </p>
                )}
              </div>
              <Badge variant="outline">{item.status}</Badge>
            </div>
            {item.year && (
              <p className="text-xs text-muted-foreground">
                Audit year: {String(item.year)}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );

  pushSection(
    "policies",
    hasPolicies,
    <Card className={sectionCard}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
          Policies & controls
        </CardTitle>
        <Lock className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent className="space-y-3">
        {policies.length === 0 && (
          <p className="text-sm text-muted-foreground">
            List key policies in the YAML file to showcase them here.
          </p>
        )}
        {policies.map((policy) => (
          <div
            key={policy.name}
            className="rounded-lg border border-slate-100 p-3 dark:border-slate-700 dark:bg-slate-800/70"
          >
            <p className="font-medium text-slate-900 dark:text-white">{policy.name}</p>
            <p className="text-xs text-muted-foreground">
              {policy.owner ? `Owner: ${policy.owner} • ` : ""}
              {policy.coverage ?? "Coverage not provided"}
            </p>
            {policy.cadence && (
              <p className="text-xs text-muted-foreground">
                Cadence: {policy.cadence}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );

  pushSection(
    "documents",
    hasDocuments,
    <Card className={sectionCard}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
          Available documents
        </CardTitle>
        <FileText className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent className="space-y-4">
        {documents.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Add documents via YAML to enable this list.
          </p>
        )}
        {documents.map((doc) => (
          <div
            key={doc.name}
            className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/70 p-4 dark:border-slate-700 dark:from-slate-900 dark:to-slate-800 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-slate-900 dark:text-white">{doc.name}</p>
                <Badge variant="outline">{doc.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{doc.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant={doc.access === "request" ? "default" : "secondary"}>
                  {doc.access === "request" ? "Request only" : "Public"}
                </Badge>
                {doc.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
                {doc.updatedAt && (
                  <span className="text-xs text-muted-foreground">
                    Updated on {doc.updatedAt}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 md:flex-col">
              {doc.access === "request" ? (
                <Button onClick={() => onRequestDocument(doc.name)}>
                  Request access
                </Button>
              ) : doc.url ? (
                <Button asChild variant="secondary">
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    Open document
                  </a>
                </Button>
              ) : (
                <Button disabled variant="secondary">
                  Link unavailable
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  pushSection(
    "infrastructure",
    hasInfrastructure,
    <Card className={sectionCard}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
          Stack & infrastructure
        </CardTitle>
        <Server className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        {infrastructure?.hosting && (
          <p>
            <span className="font-semibold text-slate-800 dark:text-slate-100">Hosting:</span>{" "}
            {infrastructure.hosting}
          </p>
        )}
        {infrastructure?.encryption && (
          <p>
            <span className="font-semibold text-slate-800 dark:text-slate-100">Encryption:</span>{" "}
            {infrastructure.encryption}
          </p>
        )}
        {infrastructure?.retention && (
          <p>
            <span className="font-semibold text-slate-800 dark:text-slate-100">Retention:</span>{" "}
            {infrastructure.retention}
          </p>
        )}
        {infrastructure?.backups && (
          <p>
            <span className="font-semibold text-slate-800 dark:text-slate-100">Backups:</span>{" "}
            {infrastructure.backups}
          </p>
        )}
        {infrastructure?.dataResidency?.length ? (
          <p>
            <span className="font-semibold text-slate-800 dark:text-slate-100">Regions:</span>{" "}
            {infrastructure.dataResidency.join(", ")}
          </p>
        ) : null}
        {infrastructure?.dataCenters?.length ? (
          <p>
            <span className="font-semibold text-slate-800 dark:text-slate-100">Data centers:</span>{" "}
            {infrastructure.dataCenters.join(", ")}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );

  pushSection(
    "monitoring",
    hasMonitoring,
    <Card className={sectionCard}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
          Monitoring & history
        </CardTitle>
        <Globe className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent className="space-y-3">
        {monitoring?.statusPage && (
          <Button asChild size="sm" variant="secondary">
            <a href={monitoring.statusPage} target="_blank" rel="noopener noreferrer">
              Open status page
            </a>
          </Button>
        )}
        {monitoring?.incidentHistory?.length ? (
          <div className="space-y-3">
            {monitoring.incidentHistory.map((incident) => (
              <div
                key={incident.date}
                className="rounded-lg border p-3 text-sm dark:border-slate-700 dark:bg-slate-800/70"
              >
                <p className="font-medium text-slate-900 dark:text-white">
                  {incident.summary}
                </p>
                <p className="text-xs text-muted-foreground">
                  {incident.date} — Impact: {incident.impact}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No incidents recorded in the past months.
          </p>
        )}
      </CardContent>
    </Card>
  );

  pushSection(
    "updates",
    hasUpdates,
    <Card className={sectionCard}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
          Recent updates
        </CardTitle>
        <BookOpen className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent className="space-y-3">
        {updates.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Use the updates field in your YAML to publish announcements.
          </p>
        )}
        {updates.map((update) => (
          <div
            key={update.title}
            className="rounded-lg border p-3 text-sm dark:border-slate-700 dark:bg-slate-800/70"
          >
            <p className="font-medium text-slate-900 dark:text-white">{update.title}</p>
            <p className="text-xs text-muted-foreground">{update.date}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{update.summary}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  pushSection(
    "faqs",
    hasFaqs,
    <Card className={sectionCard}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
          FAQs
        </CardTitle>
        <Sparkles className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent className="space-y-3">
        {faqs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Add frequently asked questions to reduce back-and-forth with sales.
          </p>
        ) : (
          <Accordion
            type="single"
            collapsible
            className="w-full rounded-2xl border border-slate-100 bg-white dark:border-slate-700 dark:bg-slate-900"
          >
            {faqs.map((faq, index) => (
              <AccordionItem key={`${faq.question}-${index}`} value={`faq-${index}`}>
                <AccordionTrigger className="px-4 text-left text-base font-semibold text-slate-900 dark:text-white">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );

  pushSection(
    "subprocessors",
    hasSubprocessors,
    <Card className={sectionCard}>
      <CardHeader className="flex flex-wrap items-center justify-between gap-3 space-y-0">
        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
          Subprocessors {subprocessors.length > 0 && `(${subprocessors.length})`}
        </CardTitle>
        {config.subprocessorsLink && (
          <Button asChild variant="link" className="px-0 text-sm font-semibold">
            <a href={config.subprocessorsLink} target="_blank" rel="noopener noreferrer">
              View details
            </a>
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {subprocessors.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Keep your subprocessors list up to date to increase trust with prospects.
          </p>
        ) : (
          <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-900/60">
            {subprocessors.map((vendor, index) => (
              <div
                key={`${vendor.name}-${index}`}
                className="flex flex-col gap-1 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-1 items-center gap-3">
                  {vendor.logo ? (
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-slate-100 bg-white dark:border-slate-700 dark:bg-slate-800">
                      <Image
                        src={vendor.logo}
                        alt={`${vendor.name} logo`}
                        fill
                        className="object-contain p-1.5"
                      />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {vendor.name
                        .split(" ")
                        .map((chunk) => chunk[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {vendor.name}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800">
                        <Globe className="h-3 w-3" />
                        {vendor.location}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800">
                        {vendor.category}
                      </span>
                    </div>
                    {vendor.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {vendor.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  pushSection(
    "contacts",
    hasContacts,
    <Card className="border border-indigo-100 bg-indigo-50/80 text-indigo-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold">Trust team</CardTitle>
        <ShieldCheck className="h-4 w-4" />
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="inline-flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {contacts?.email} (SLA {contacts?.sla})
          </span>
          {contacts?.phone && (
            <span className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {contacts.phone}
            </span>
          )}
        </div>
        {contacts?.officeHours && <p>Office hours: {contacts.officeHours}</p>}
      </CardContent>
    </Card>
  );

  const layoutKeys = Object.keys(layoutConfig ?? {}).filter((key): key is SectionKey =>
    SECTION_KEYS.includes(key as SectionKey)
  );

  const yamlOrderKeys = SECTION_KEYS.filter(
    (key) => (config as Record<string, unknown>)[key] !== undefined
  );

  const sectionsOverride = (config.sections ?? []).filter((key): key is SectionKey =>
    SECTION_KEYS.includes(key)
  );

  const orderedBlocks: SectionBlock[] = [];
  const seen = new Set<SectionKey>();
  const pushFromOrder = (keys: SectionKey[]) => {
    keys.forEach((key) => {
      if (seen.has(key)) return;
      const block = sectionBlocks.find((section) => section.key === key);
      if (block) {
        orderedBlocks.push(block);
        seen.add(key);
      }
    });
  };

  pushFromOrder(sectionsOverride);
  pushFromOrder(layoutKeys);
  pushFromOrder(yamlOrderKeys);
  pushFromOrder(DEFAULT_SECTION_ORDER);
  pushFromOrder(sectionBlocks.map((block) => block.key));

  const blocksToRender = orderedBlocks;

  return (
    <div className={cn(isDark && "dark")}>
      <div className="space-y-5">
        <Card className={surfaceCard}>
          <CardContent className="space-y-5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {config.company.logo && (
                  <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                    <Image
                      src={config.company.logo}
                      alt={`${config.company.name} logo`}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                )}
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Trust Center
                  </p>
                  <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                    {config.company.name}
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {config.company.tagline}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {hero?.lastUpdate && (
                  <Badge variant="outline">Updated on {hero.lastUpdate}</Badge>
                )}
                {showAdminLink && (
                  <Button asChild variant="secondary" size="sm">
                    <Link href="/admin">Admin area</Link>
                  </Button>
                )}
              </div>
            </div>
            <p className="max-w-3xl text-sm text-slate-700 dark:text-slate-200">
              {config.company.description}
            </p>
            {hero?.statusMessage && (
              <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-emerald-200">
                <ShieldCheck className="h-4 w-4" />
                {hero.statusMessage}
              </div>
            )}
            {hero?.commitments?.length ? (
              <div className="flex flex-wrap gap-2">
                {hero.commitments.map((item) => (
                  <Badge key={item} variant="secondary">
                    <Sparkles className="mr-1 h-3 w-3" />
                    {item}
                  </Badge>
                ))}
              </div>
            ) : null}
            {metrics.length > 0 && (
              <div className="grid gap-3 md:grid-cols-3">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-lg border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-800/70"
                  >
                    <p className="text-xs uppercase tracking-wide text-muted-foreground dark:text-slate-400">
                      {metric.label}
                    </p>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                      {metric.value}
                    </p>
                    {metric.caption && (
                      <p className="text-xs text-muted-foreground dark:text-slate-400">
                        {metric.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {blocksToRender.length > 0 && (
          <div className="grid gap-5 lg:grid-cols-2">
            {blocksToRender.map((section) => (
              <div
                key={section.key}
                className={cn(section.span === "full" && "lg:col-span-2")}
              >
                {section.element}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
