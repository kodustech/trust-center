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

export const trustCenterSchema = z.object({
  theme: z.enum(["light", "dark"]).default("light"),
  subprocessorsLink: z.string().url().optional(),
  layout: layoutSchema,
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

export const DEFAULT_TRUST_YAML = `theme: light
subprocessorsLink: https://eztrust.security/subprocessors
company:
  name: EzTrust
  tagline: Fast trust for revenue teams
  description: Centralize audits, policies, and evidence inside a single YAML-powered trust center.
  website: https://eztrust.security
  headquarters: Sao Paulo, Brazil
  trustLead: Laura Ribeiro
hero:
  statusMessage: Latest SOC 2 Type II audit completed May/2024.
  lastUpdate: 2024-06-12
  commitments:
    - Quarterly external pen-tests with Conviso
    - Daily backups with 35-day retention
metrics:
  - label: Uptime
    value: 99.98%
    caption: last 12 months
  - label: Customers
    value: 320+
    caption: scale-ups and fintechs across Brazil and the US
  - label: Security team
    value: 6 people
    caption: includes GRC, AppSec, and SecOps
compliance:
  - name: SOC 2 Type II
    status: Certified
    year: 2024
    scope: Security & Availability
  - name: ISO 27001
    status: Certified
    year: 2023
    scope: Global operations
  - name: LGPD
    status: Aligned
    scope: Data processor commitments
infrastructure:
  hosting: AWS (Control Tower hardened org)
  dataResidency:
    - us-east-1
    - sa-east-1
  dataCenters:
    - Equinix SP
    - AWS North Virginia
  encryption: AES-256 at rest + TLS 1.3 in transit
  retention: Audit logs retained for 400 days
  backups: Continuous snapshots with weekly restore tests
documents:
  - name: SOC 2 report
    description: Executive summary plus independent auditor letter.
    category: Audits
    access: request
    tags:
      - Confidential
    updatedAt: 2024-05-18
  - name: ISO 27001 SoA
    description: Statement of applicability with implemented controls.
    category: Certifications
    access: request
    tags:
      - NDA
    updatedAt: 2024-02-05
  - name: Security overview
    description: Technical control overview for prospects.
    category: Overview
    access: public
    url: https://status.eztrust/security-guide.pdf
    tags:
      - Public
policies:
  - name: Logical Access Policy
    owner: Security Ops
    coverage: SSO everywhere plus enforced MFA
    cadence: Reviewed quarterly
  - name: Incident Management
    owner: GRC
    coverage: Four severity levels with RACI defined
    cadence: Bi-monthly tabletop exercises
monitoring:
  statusPage: https://status.eztrust/security
  incidentHistory:
    - date: 2024-03-11
      summary: Partial outage on the audit webhook
      impact: No data loss. Timeout increased and workers tuned.
updates:
  - date: 2024-06-06
    title: New CAIQ questionnaire
    summary: Custom fintech-ready version now available.
  - date: 2024-05-20
    title: Expanded to sa-east-1
    summary: Brazilian customer data can stay in-country.
contacts:
  email: trust@eztrust.com
  sla: 1 business day
  phone: +55 11 99999-9999
  officeHours: 9am to 6pm BRT
faqs:
  - question: Do you sign DPAs or SCCs?
    answer: Yes, we have pre-approved templates and sign via DocuSign within 2 business days.
  - question: Do you run a bug bounty?
    answer: We have a private HackerOne program live since 2022.
subprocessors:
  - name: AWS
    category: IT infrastructure
    location: United States of America
    logo: https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg
    description: Primary cloud provider (Control Tower hardened org).
  - name: Datadog
    category: Monitoring and observability
    location: United States of America
    logo: https://upload.wikimedia.org/wikipedia/en/3/3b/Datadog_logo.svg
    description: SaaS monitoring platform for logs, metrics, and traces.
  - name: OpenAI
    category: Artificial Intelligence
    location: United States of America
    logo: https://upload.wikimedia.org/wikipedia/commons/0/04/OpenAI_Logo.svg
    description: Model inference for trust center assistant features.
`;

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
