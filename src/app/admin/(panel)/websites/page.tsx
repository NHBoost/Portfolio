import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/page-header";
import { WebsitesManager, type WebsiteRow } from "./manager";

export default async function WebsitesAdminPage() {
  const supabase = await createSupabaseServerClient();

  const [{ data: websites }, { data: cases }] = await Promise.all([
    supabase
      .from("websites")
      .select("id, url, title, activity, sort_order, case_study_id")
      .order("sort_order", { ascending: true }),
    supabase
      .from("case_studies")
      .select("id, project_name")
      .order("project_name"),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6 md:p-10">
      <PageHeader
        eyebrow="Réalisations"
        title="Sites web"
        description="Ajoutez ici les sites livrés aux clients. Ils s'affichent automatiquement dans le carrousel mockup sur la page d'accueil."
      />
      <WebsitesManager
        items={(websites ?? []) as WebsiteRow[]}
        caseOptions={cases ?? []}
      />
    </div>
  );
}
