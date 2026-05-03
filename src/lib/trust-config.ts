import * as yaml from "js-yaml";
import { ZodError, z } from "zod";

const metricSchema = z.object({
  label: z.string(),
  value: z.string(),
  caption: z.string().optional(),
});

const complianceSchema = z.object({
  name: z.string(),
  status: z.string(),
  year: z.union([z.string(), z.number()]).optional(),
  scope: z.string().optional(),
  badge: z.string().optional(),
});

const documentSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.string(),
  access: z.enum(["public", "request"]).default("request"),
  tags: z.array(z.string()).default([]),
  url: z.string().optional(),
  updatedAt: z.string().optional(),
});

const policySchema = z.object({
  name: z.string(),
  owner: z.string().optional(),
  coverage: z.string().optional(),
  cadence: z.string().optional(),
});

const updateSchema = z.object({
  date: z.string(),
  title: z.string(),
  summary: z.string(),
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const layoutSchema = z
  .object({
    compliance: z.enum(["full", "half"]).optional(),
    policies: z.enum(["full", "half"]).optional(),
    documents: z.enum(["full", "half"]).optional(),
    infrastructure: z.enum(["full", "half"]).optional(),
    monitoring: z.enum(["full", "half"]).optional(),
    updates: z.enum(["full", "half"]).optional(),
    faqs: z.enum(["full", "half"]).optional(),
    subprocessors: z.enum(["full", "half"]).optional(),
    contacts: z.enum(["full", "half"]).optional(),
  })
  .optional();

const sectionKeyEnum = z.enum([
  "documents",
  "compliance",
  "policies",
  "infrastructure",
  "monitoring",
  "updates",
  "faqs",
  "subprocessors",
  "contacts",
]);

export const trustCenterSchema = z.object({
  theme: z.enum(["light", "dark"]).default("light"),
  subprocessorsLink: z.string().url().optional(),
  contactEmail: z.string().email().optional(),
  layout: layoutSchema,
  sections: z.array(sectionKeyEnum).optional(),
  company: z.object({
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
    website: z.string().optional(),
    logo: z.string().optional(),
    headquarters: z.string().optional(),
    trustLead: z.string().optional(),
  }),
  hero: z
    .object({
      statusMessage: z.string().optional(),
      lastUpdate: z.string().optional(),
      commitments: z.array(z.string()).default([]),
    })
    .optional()
    .default({
      commitments: [],
    }),
  metrics: z.array(metricSchema).optional(),
  compliance: z.array(complianceSchema).optional(),
  documents: z.array(documentSchema).optional(),
  policies: z.array(policySchema).optional(),
  infrastructure: z
    .object({
      hosting: z.string().optional(),
      dataResidency: z.array(z.string()).default([]),
      dataCenters: z.array(z.string()).default([]),
      encryption: z.string().optional(),
      retention: z.string().optional(),
      backups: z.string().optional(),
    })
    .optional(),
  monitoring: z
    .object({
      statusPage: z.string().optional(),
      incidentHistory: z
        .array(
          z.object({
            date: z.string(),
            summary: z.string(),
            impact: z.string(),
          })
        )
        .default([]),
    })
    .optional(),
  contacts: z
    .object({
      email: z.string().email(),
      sla: z.string(),
      phone: z.string().optional(),
      officeHours: z.string().optional(),
    })
    .optional(),
  faqs: z.array(faqSchema).optional(),
  subprocessors: z
    .array(
      z.object({
        name: z.string(),
        category: z.string(),
        location: z.string(),
        logo: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .optional(),
  updates: z.array(updateSchema).optional(),
});

export type TrustCenterConfig = z.infer<typeof trustCenterSchema>;

export type SafeParseResult =
  | { ok: true; data: TrustCenterConfig }
  | { ok: false; error: string };

export function safeParseTrustCenter(yamlString: string): SafeParseResult {
  try {
    const raw =
      yaml.load(yamlString, { schema: yaml.JSON_SCHEMA }) ?? {};
    const data = trustCenterSchema.parse(raw);
    return { ok: true, data };
  } catch (error) {
    const message =
      error instanceof ZodError
        ? error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join(" | ")
        : error instanceof Error
          ? error.message
          : "Unable to read the YAML.";
    return { ok: false, error: message };
  }
}
