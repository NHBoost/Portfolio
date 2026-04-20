import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getFranchiseSettings, getGlobalStats } from "@/lib/public-data";
import { Hero } from "@/components/public/hero";
import { GlobalStatsBand } from "@/components/public/global-stats-band";
import { FinalCta } from "@/components/public/final-cta";
import { CaseStudiesSection } from "@/components/public/case-studies-section";
import type { CaseStudyCardData } from "@/components/public/case-study-card";

export const revalidate = 60;

async function getSpotlight() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("case_studies")
    .select(
      "slug, project_name, client_name, roi, ad_budget, revenue_generated, sector:sectors(name)",
    )
    .eq("status", "published")
    .order("roi", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;
  return {
    slug: data.slug,
    project_name: data.project_name,
    client_name: data.client_name,
    sector: data.sector?.name ?? null,
    roi: data.roi ? Number(data.roi) : null,
    ad_budget: data.ad_budget ? Number(data.ad_budget) : null,
    revenue_generated: data.revenue_generated
      ? Number(data.revenue_generated)
      : null,
  };
}

async function getTopCaseStudies(): Promise<CaseStudyCardData[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("case_studies")
    .select(
      "slug, project_name, client_name, short_problem, cover_image_url, ad_budget, revenue_generated, leads_count, roi, sector:sectors(name)",
    )
    .eq("status", "published")
    .order("roi", { ascending: false, nullsFirst: false })
    .limit(5);

  return (data ?? []).map((row) => ({
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
}

export default async function HomePage() {
  const [settings, stats, spotlight, topStudies] = await Promise.all([
    getFranchiseSettings(),
    getGlobalStats(),
    getSpotlight(),
    getTopCaseStudies(),
  ]);

  return (
    <>
      <Hero settings={settings} spotlight={spotlight} />
      <GlobalStatsBand stats={stats} />
      <CaseStudiesSection items={topStudies} />
      <FinalCta settings={settings} />
    </>
  );
}
