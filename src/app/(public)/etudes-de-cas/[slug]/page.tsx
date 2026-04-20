import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getFranchiseSettings } from "@/lib/public-data";
import { FinalCta } from "@/components/public/final-cta";
import { CaseHero } from "@/components/public/case-study/hero";
import {
  PresentationSection,
  StrategySection,
  ExecutionSection,
  ResultsSection,
  BeforeAfterSection,
  ConclusionSection,
} from "@/components/public/case-study/sections";
import { RoiBlock } from "@/components/public/case-study/roi-block";
import { RelatedCases } from "@/components/public/case-study/related";
import type { CaseStudyCardData } from "@/components/public/case-study-card";

export const revalidate = 60;
export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("case_studies")
    .select("project_name, client_name, short_problem, cover_image_url")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (!data) return { title: "Étude de cas introuvable" };
  return {
    title: `${data.project_name} · Étude de cas`,
    description:
      data.short_problem ??
      `Stratégie, exécution et ROI pour ${data.client_name ?? data.project_name}.`,
    openGraph: data.cover_image_url
      ? { images: [{ url: data.cover_image_url }] }
      : undefined,
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  const [{ data: study, error }, settings] = await Promise.all([
    supabase
      .from("case_studies")
      .select(
        "*, sector:sectors(id, name, slug), services:case_study_services(service:services(slug, name)), media:case_study_media(id, media_type, file_url, title, description, sort_order), proofs:case_study_proofs(id, proof_type, title, file_url, note)",
      )
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle(),
    getFranchiseSettings(),
  ]);

  if (error || !study) {
    notFound();
  }

  const services = (study.services ?? [])
    .map((row) => row.service)
    .filter(Boolean) as { slug: string; name: string }[];

  const media = [...(study.media ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );

  const proofs = study.proofs ?? [];

  // Related: same sector, published, excluding current
  let related: CaseStudyCardData[] = [];
  if (study.sector_id) {
    const { data: others } = await supabase
      .from("case_studies")
      .select(
        "slug, project_name, client_name, short_problem, cover_image_url, ad_budget, revenue_generated, leads_count, roi, sector:sectors(name)",
      )
      .eq("status", "published")
      .eq("sector_id", study.sector_id)
      .neq("id", study.id)
      .order("roi", { ascending: false, nullsFirst: false })
      .limit(3);
    related = (others ?? []).map((r) => ({
      slug: r.slug,
      project_name: r.project_name,
      client_name: r.client_name,
      sector: r.sector?.name ?? null,
      short_problem: r.short_problem,
      cover_image_url: r.cover_image_url,
      ad_budget: r.ad_budget ? Number(r.ad_budget) : null,
      revenue_generated: r.revenue_generated ? Number(r.revenue_generated) : null,
      leads_count: r.leads_count,
      roi: r.roi ? Number(r.roi) : null,
    }));
  }

  // Fallback: if no same-sector others, pull top other studies
  if (related.length === 0) {
    const { data: others } = await supabase
      .from("case_studies")
      .select(
        "slug, project_name, client_name, short_problem, cover_image_url, ad_budget, revenue_generated, leads_count, roi, sector:sectors(name)",
      )
      .eq("status", "published")
      .neq("id", study.id)
      .order("roi", { ascending: false, nullsFirst: false })
      .limit(3);
    related = (others ?? []).map((r) => ({
      slug: r.slug,
      project_name: r.project_name,
      client_name: r.client_name,
      sector: r.sector?.name ?? null,
      short_problem: r.short_problem,
      cover_image_url: r.cover_image_url,
      ad_budget: r.ad_budget ? Number(r.ad_budget) : null,
      revenue_generated: r.revenue_generated ? Number(r.revenue_generated) : null,
      leads_count: r.leads_count,
      roi: r.roi ? Number(r.roi) : null,
    }));
  }

  return (
    <article>
      <CaseHero study={study} services={services} />

      <PresentationSection
        initialSituation={study.initial_situation}
        shortProblem={study.short_problem}
        businessGoal={study.business_goal}
      />

      <StrategySection
        angle={study.strategy_angle}
        positioning={study.positioning}
        offer={study.offer_details}
        funnel={study.funnel_details}
        targeting={study.targeting_details}
      />

      <ExecutionSection
        execution={study.execution_details}
        media={media}
      />

      <ResultsSection
        leads={study.leads_count}
        costPerLead={study.cost_per_lead ? Number(study.cost_per_lead) : null}
        clients={study.clients_count}
        revenue={study.revenue_generated ? Number(study.revenue_generated) : null}
        roas={study.roas ? Number(study.roas) : null}
        proofs={proofs}
      />

      <RoiBlock
        adBudget={study.ad_budget ? Number(study.ad_budget) : null}
        revenueGenerated={
          study.revenue_generated ? Number(study.revenue_generated) : null
        }
        roi={study.roi ? Number(study.roi) : null}
      />

      <BeforeAfterSection
        trafficBefore={study.traffic_before}
        trafficAfter={study.traffic_after}
        revenueBefore={study.revenue_before}
        revenueAfter={study.revenue_after}
        visibilityBefore={study.visibility_before}
        visibilityAfter={study.visibility_after}
      />

      <ConclusionSection
        conclusion={study.conclusion}
        testimonial={study.testimonial}
        clientName={study.client_name}
      />

      <RelatedCases items={related} />

      <FinalCta
        settings={settings}
        eyebrow="Votre projet"
        title="On peut obtenir ce même résultat pour vous."
        description="Un diagnostic en 20 minutes pour évaluer le ROI réaliste de votre marketing. Aucun engagement."
      />
    </article>
  );
}
