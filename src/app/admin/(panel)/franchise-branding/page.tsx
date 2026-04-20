import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/page-header";
import { FranchiseForm } from "./form";

export default async function FranchiseBrandingPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("franchise_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (!data) {
    return (
      <div className="p-6 md:p-10">
        <p className="text-sm text-destructive">
          Aucune ligne franchise_settings. Relance le seed Supabase.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6 md:p-10">
      <PageHeader
        eyebrow="Paramètres"
        title="Branding franchise"
        description="Identité visuelle et coordonnées. Duplique le portfolio pour une nouvelle franchise en quelques minutes."
      />
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs md:p-8">
        <FranchiseForm settings={data} />
      </div>
    </div>
  );
}
