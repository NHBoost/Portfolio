import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getFeaturedTestimonial,
  getFranchiseSettings,
  getGlobalStats,
  getRealisations,
  getServices,
  getTrustLogos,
} from "@/lib/public-data";
import { Hero, type HeroTrustStats } from "@/components/public/hero";
import { LogosStrip } from "@/components/public/logos-strip";
import { GlobalStatsBand } from "@/components/public/global-stats-band";
import { ProcessSection } from "@/components/public/process-section";
import { FeaturedTestimonial } from "@/components/public/featured-testimonial";
import { CaseStudiesSection } from "@/components/public/case-studies-section";
import { RealisationsGallery } from "@/components/public/realisations-gallery";
import { ServicesGrid } from "@/components/public/services-grid";
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

async function getPublishedCount(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { count } = await supabase
    .from("case_studies")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");
  return count ?? 0;
}

export default async function HomePage() {
  const [
    settings,
    stats,
    spotlight,
    topStudies,
    realisations,
    services,
    logos,
    testimonial,
    publishedCount,
  ] = await Promise.all([
    getFranchiseSettings(),
    getGlobalStats(),
    getSpotlight(),
    getTopCaseStudies(),
    getRealisations(12),
    getServices(),
    getTrustLogos(8),
    getFeaturedTestimonial(),
    getPublishedCount(),
  ]);

  const trustStats: HeroTrustStats = {
    publishedCount,
    averageRoas: stats?.average_roas ? Number(stats.average_roas) : null,
    totalRevenue: stats?.total_revenue ? Number(stats.total_revenue) : null,
  };

  return (
    <>
      <Hero
        settings={settings}
        spotlight={spotlight}
        trustStats={trustStats}
      />
      <LogosStrip items={logos} />
      <GlobalStatsBand stats={stats} />
      <ProcessSection />
      <CaseStudiesSection items={topStudies} />
      <FeaturedTestimonial entry={testimonial} />
      <ServicesGrid items={services} />
      <RealisationsGallery items={realisations} />
    </>
  );
}
