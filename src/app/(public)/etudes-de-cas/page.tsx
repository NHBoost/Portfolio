import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CaseStudyGrid, type CaseStudyCardData } from "@/components/public/case-study-card";
import { CaseStudiesFilters } from "@/components/public/case-studies-filters";

export const revalidate = 60;
export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  sector?: string;
  service?: string;
  roi?: string;
}>;

export const metadata = {
  title: "Études de cas · ROI mesuré",
  description:
    "Études de cas business classées par impact. Budget investi, CA généré, ROI — tout est mesurable.",
};

export default async function CaseStudiesListPublicPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { sector, service, roi } = await searchParams;

  const supabase = await createSupabaseServerClient();

  const [{ data: sectors }, { data: services }] = await Promise.all([
    supabase.from("sectors").select("slug, name").order("name"),
    supabase.from("services").select("slug, name").order("name"),
  ]);

  // Resolve sector slug → id for filtering
  let sectorId: string | null = null;
  if (sector) {
    const { data: sectorRow } = await supabase
      .from("sectors")
      .select("id")
      .eq("slug", sector)
      .maybeSingle();
    sectorId = sectorRow?.id ?? null;
  }

  let serviceId: string | null = null;
  if (service) {
    const { data: serviceRow } = await supabase
      .from("services")
      .select("id")
      .eq("slug", service)
      .maybeSingle();
    serviceId = serviceRow?.id ?? null;
  }

  // For service filter we need to query the pivot first
  let caseIdsFilteredByService: string[] | null = null;
  if (serviceId) {
    const { data: pivot } = await supabase
      .from("case_study_services")
      .select("case_study_id")
      .eq("service_id", serviceId);
    caseIdsFilteredByService = (pivot ?? []).map((r) => r.case_study_id);
  }

  let query = supabase
    .from("case_studies")
    .select(
      "slug, project_name, client_name, short_problem, cover_image_url, ad_budget, revenue_generated, leads_count, roi, sector:sectors(name)",
    )
    .eq("status", "published")
    .order("roi", { ascending: false, nullsFirst: false });

  if (sectorId) {
    query = query.eq("sector_id", sectorId);
  }
  if (caseIdsFilteredByService !== null) {
    if (caseIdsFilteredByService.length === 0) {
      // No results possible
      query = query.eq("id", "00000000-0000-0000-0000-000000000000");
    } else {
      query = query.in("id", caseIdsFilteredByService);
    }
  }
  if (roi) {
    const threshold = Number(roi);
    if (Number.isFinite(threshold)) {
      query = query.gte("roi", threshold);
    }
  }

  const { data: rows } = await query;

  const items: CaseStudyCardData[] = (rows ?? []).map((row) => ({
    slug: row.slug,
    project_name: row.project_name,
    client_name: row.client_name,
    sector: row.sector?.name ?? null,
    short_problem: row.short_problem,
    cover_image_url: row.cover_image_url,
    ad_budget: row.ad_budget ? Number(row.ad_budget) : null,
    revenue_generated: row.revenue_generated
      ? Number(row.revenue_generated)
      : null,
    leads_count: row.leads_count,
    roi: row.roi ? Number(row.roi) : null,
  }));

  return (
    <>
      <section
        aria-labelledby="etudes-title"
        className="relative py-10"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[360px] opacity-40 mesh-grid [mask-image:radial-gradient(circle_at_top,rgba(0,0,0,0.85),transparent_75%)]"
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 md:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-deep">
            Bibliothèque · {items.length} étude{items.length > 1 ? "s" : ""}
          </p>
          <h1
            id="etudes-title"
            className="mt-3 max-w-3xl font-display text-[clamp(36px,5vw,64px)] font-semibold leading-[1] tracking-[-0.02em] text-foreground text-balance"
          >
            Classées par impact.{" "}
            <span className="text-muted-foreground/80">
              Celles qui ont rapporté le plus sont en haut.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground">
            Chaque étude expose la stratégie, l&apos;exécution, les chiffres
            réellement mesurés et le retour sur investissement concret.
          </p>
        </div>
      </section>

      <section
        id="etudes"
        className="mx-auto w-full max-w-6xl px-4 pb-10 md:px-8"
      >
        <div className="mb-8">
          <CaseStudiesFilters
            sectors={sectors ?? []}
            services={services ?? []}
          />
        </div>
        <CaseStudyGrid items={items} />
      </section>
    </>
  );
}
