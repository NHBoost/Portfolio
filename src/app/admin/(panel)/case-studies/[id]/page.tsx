import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CaseStudyEditForm } from "./edit-form";
import { MediaManager } from "./media-manager";
import { ProofsManager } from "./proofs-manager";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Params = Promise<{ id: string }>;

export default async function EditCaseStudyPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const [caseStudyResult, sectorsResult, servicesResult, mediaResult, proofsResult, pivotResult] =
    await Promise.all([
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
    <div className="space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link
              href="/admin/case-studies"
              className="hover:text-foreground"
            >
              Etudes de cas
            </Link>
            <span>/</span>
            <span>{caseStudy.project_name}</span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-accent">
            {caseStudy.project_name}
          </h1>
        </div>
      </div>

      <CaseStudyEditForm
        caseStudy={caseStudy}
        sectors={sectorsResult.data ?? []}
        services={servicesResult.data ?? []}
        selectedServiceIds={selectedServiceIds}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Medias</CardTitle>
          <CardDescription>
            Cover, visuels, ads, UGC. Utilises pour la galerie et le hero.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MediaManager
            caseStudyId={id}
            items={mediaResult.data ?? []}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preuves</CardTitle>
          <CardDescription>
            Captures Ads Manager, CRM, formulaires, stats, temoignages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProofsManager
            caseStudyId={id}
            items={proofsResult.data ?? []}
          />
        </CardContent>
      </Card>
    </div>
  );
}
