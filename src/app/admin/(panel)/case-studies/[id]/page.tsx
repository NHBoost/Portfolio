import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CaseStudyEditForm } from "./edit-form";
import { MediaManager } from "./media-manager";
import { ProofsManager } from "./proofs-manager";

type Params = Promise<{ id: string }>;

export default async function EditCaseStudyPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const [
    caseStudyResult,
    sectorsResult,
    servicesResult,
    mediaResult,
    proofsResult,
    pivotResult,
  ] = await Promise.all([
    supabase.from("case_studies").select("*").eq("id", id).single(),
    supabase.from("sectors").select("id, name").order("name"),
    supabase.from("services").select("id, name").order("name"),
    supabase
      .from("case_study_media")
      .select("*")
      .eq("case_study_id", id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("case_study_proofs")
      .select("*")
      .eq("case_study_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("case_study_services")
      .select("service_id")
      .eq("case_study_id", id),
  ]);

  if (caseStudyResult.error || !caseStudyResult.data) {
    notFound();
  }

  const caseStudy = caseStudyResult.data;
  const selectedServiceIds = (pivotResult.data ?? []).map((r) => r.service_id);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-6 md:p-10">
      <PageHeader
        breadcrumbs={[
          { href: "/admin/case-studies", label: "Études de cas" },
          { href: `/admin/case-studies/${caseStudy.id}`, label: "Édition" },
        ]}
        title={caseStudy.project_name}
        description={
          <>
            <span className="font-mono text-xs text-muted-foreground">
              /{caseStudy.slug}
            </span>
            {caseStudy.client_name ? (
              <>
                <span className="mx-2 text-muted-foreground/50">·</span>
                <span>{caseStudy.client_name}</span>
              </>
            ) : null}
          </>
        }
      />

      <CaseStudyEditForm
        caseStudy={caseStudy}
        sectors={sectorsResult.data ?? []}
        services={servicesResult.data ?? []}
        selectedServiceIds={selectedServiceIds}
      />

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="font-display text-base">Médias</CardTitle>
          <CardDescription>
            Cover, visuels, ads, UGC. Utilisés pour le hero et la galerie du
            site public.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MediaManager caseStudyId={id} items={mediaResult.data ?? []} />
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="font-display text-base">Preuves</CardTitle>
          <CardDescription>
            Captures Ads Manager, CRM, formulaires de lead, dashboards,
            témoignages. Chaque preuve renforce la crédibilité en rendez-vous.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProofsManager caseStudyId={id} items={proofsResult.data ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
