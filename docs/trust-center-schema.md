# Trust Center YAML Schema

The trust center UI is rendered from a single YAML document. Each section is optional (except `company`). Removing a section from the YAML hides it automatically. Below is the complete schema describing all keys the app understands.

## Root structure

```yaml
company:               # required
hero:                  # optional
metrics:               # optional array
compliance:            # optional array
documents:             # optional array
policies:              # optional array
infrastructure:        # optional object
monitoring:            # optional object
updates:               # optional array
faqs:                  # optional array
contacts:              # optional object
```

## Fields

| Key | Type | Description |
| --- | --- | --- |
| `theme` | `"light"` or `"dark"` | Controls the overall palette of the public trust center and builder preview. |
| `layout.<section>` | `"full"` or `"half"` | Optional map that defines how each block should span on desktop. Sections without a layout entry fall back to sensible defaults (e.g., compliance/policies = half, documents = full). |
| `subprocessorsLink` | string (URL) | Optional external page for a full subprocessors list (shown as “View details”). |
| `company.name` | string (required) | Company name shown in hero. |
| `company.tagline` | string (required) | Short positioning sentence. |
| `company.description` | string (required) | Paragraph describing the trust program. |
| `company.website` | string | Optional URL for CTA/backlinks. |
| `company.logo` | string | Absolute URL to an image shown next to the company name. |
| `company.headquarters` | string | City/country. |
| `company.trustLead` | string | Person/role responsible. |
| `hero.statusMessage` | string | Broadcast message (e.g., audit status). |
| `hero.lastUpdate` | string | Free-form date indicator. |
| `hero.commitments` | string[] | Highlights such as “Quarterly pen-tests”. |
| `metrics` | array of `{ label, value, caption? }` | Uptime, customers, etc. |
| `compliance` | array of `{ name, status, year?, scope? }` | Certifications and attestations. |
| `documents` | array of `{ name, description, category, access, tags[], url?, updatedAt? }` | Evidence list. `access` supports `public` or `request`. |
| `policies` | array of `{ name, owner?, coverage?, cadence? }` | Top internal policies. |
| `infrastructure.hosting` | string | Where workloads run. |
| `infrastructure.dataResidency` | string[] | Regions. |
| `infrastructure.dataCenters` | string[] | Named facilities. |
| `infrastructure.encryption` | string | Encryption details. |
| `infrastructure.retention` | string | Log/data retention info. |
| `infrastructure.backups` | string | Backup cadence/testing. |
| `monitoring.statusPage` | string | Link to real-time status page. |
| `monitoring.incidentHistory` | array of `{ date, summary, impact }` | Recently disclosed incidents. |
| `updates` | array of `{ date, title, summary }` | News / change log. |
| `faqs` | array of `{ question, answer }` | External FAQ items. |
| `contacts.email` | string | Trust inbox shown in footer. |
| `contacts.sla` | string | SLA description (e.g., “1 business day”). |
| `contacts.phone` | string | Optional phone contact. |
| `contacts.officeHours` | string | Support availability (e.g., “9am – 6pm BRT”). |
| `subprocessors` | array of `{ name, category, location, logo?, description? }` | Renders the subprocessors card; delete the list to hide. |

## Minimal example

```yaml
company:
  name: Kodus
  tagline: AI-powered reviews
  description: Our trust program centralizes audits, evidence and FAQs so sales can move faster.

documents: []

contacts:
  email: trust@kodus.io
  sla: 1 business day
```

## Full example

See `DEFAULT_TRUST_YAML` in `src/lib/trust-config.ts` for a comprehensive sample that uses every section.

## Tips

1. **Hide sections** by deleting them from the YAML; the parser defaults to empty arrays/objects.
2. **Validate before saving**: the builder shows parsing errors inline, and the API also validates using Zod.
3. **Versioning**: keep copies of older YAML revisions using git or Supabase history so you can roll back quickly.
