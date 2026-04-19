import { z } from "zod";

const optionalText = z
  .string()
  .optional()
  .transform((v) => (v && v.trim().length > 0 ? v.trim() : null));

const optionalNumber = z
  .union([z.string(), z.number()])
  .optional()
  .transform((v) => {
    if (v === undefined || v === null || v === "") return null;
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : null;
  });

export const caseStudyStatusEnum = z.enum(["draft", "published", "archived"]);
export type CaseStudyStatusInput = z.infer<typeof caseStudyStatusEnum>;

export const caseStudyFormSchema = z.object({
  // Block 1 — Informations generales
  project_name: z.string().min(1, "Nom du projet requis").max(160),
  slug: z
    .string()
    .min(1, "Slug requis")
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug invalide (a-z, 0-9, tirets)"),
  client_name: optionalText,
  sector_id: optionalText,
  cover_image_url: optionalText,
  client_logo_url: optionalText,
  status: caseStudyStatusEnum,

  // Block 2 — Presentation initiale
  short_problem: optionalText,
  initial_situation: optionalText,
  business_goal: optionalText,

  // Block 3 — Strategie
  strategy_angle: optionalText,
  positioning: optionalText,
  offer_details: optionalText,
  funnel_details: optionalText,
  targeting_details: optionalText,

  // Block 4 — Execution
  execution_details: optionalText,

  // Block 5 — Resultats
  leads_count: optionalNumber,
  cost_per_lead: optionalNumber,
  clients_count: optionalNumber,
  revenue_generated: optionalNumber,
  roas: optionalNumber,
  ad_budget: optionalNumber,
  roi: optionalNumber,

  // Block 6 — Avant / Apres
  traffic_before: optionalText,
  traffic_after: optionalText,
  revenue_before: optionalText,
  revenue_after: optionalText,
  visibility_before: optionalText,
  visibility_after: optionalText,

  // Block 9 — Conclusion + temoignage
  conclusion: optionalText,
  testimonial: optionalText,

  // Services (ids) — comma separated or array
  service_ids: z
    .union([z.string(), z.array(z.string()), z.undefined()])
    .transform((v) => {
      if (!v) return [] as string[];
      if (Array.isArray(v)) return v;
      return v.split(",").map((s) => s.trim()).filter(Boolean);
    }),
});

export type CaseStudyFormInput = z.input<typeof caseStudyFormSchema>;
export type CaseStudyFormOutput = z.output<typeof caseStudyFormSchema>;
