import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/page-header";
import { GlobalStatsForm } from "./form";

export default async function GlobalStatsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("global_stats")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (!data) {
    return (
      <div className="p-6 md:p-10">
        <p className="text-sm text-destructive">
          Aucune ligne global_stats. Relance le seed Supabase.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6 md:p-10">
      <PageHeader
        eyebrow="Paramètres"
        title="Stats globales"
        description="Les cinq chiffres affichés sur le bandeau « Résultats globaux » du site public, pour créer crédibilité et effet de masse."
      />
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs md:p-8">
        <GlobalStatsForm stats={data} />
      </div>
    </div>
  );
}
