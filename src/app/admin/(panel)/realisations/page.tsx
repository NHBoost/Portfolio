import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/page-header";
import {
  RealisationsManager,
  type RealisationRow,
} from "./manager";

export default async function RealisationsAdminPage() {
  const supabase = await createSupabaseServerClient();

  const [{ data: realisations }, { data: cases }] = await Promise.all([
    supabase
      .from("realisations")
      .select(
        "id, type, title, description, media_url, thumbnail_url, external_url, client_name, sort_order, case_study_id",
      )
      .order("type")
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
        title="Captures Ads · Vidéos · Social · Podcasts"
        description="Gère les réalisations visuelles affichées sur la page d'accueil, triées par type. Chaque entrée accepte une URL media ou un lien externe."
      />
      <RealisationsManager
        items={(realisations ?? []) as RealisationRow[]}
        caseOptions={cases ?? []}
      />
    </div>
  );
}
