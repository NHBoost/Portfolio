import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getFranchiseSettings, getGlobalStats } from "@/lib/public-data";
import { Hero } from "@/components/public/hero";
import { GlobalStatsBand } from "@/components/public/global-stats-band";
import { FinalCta } from "@/components/public/final-cta";

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

export default async function HomePage() {
  const [settings, stats, spotlight] = await Promise.all([
    getFranchiseSettings(),
    getGlobalStats(),
    getSpotlight(),
  ]);

  return (
    <>
      <Hero settings={settings} spotlight={spotlight} />
      <GlobalStatsBand stats={stats} />
      <FinalCta settings={settings} />
    </>
  );
}
