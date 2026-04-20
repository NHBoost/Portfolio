import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/page-header";
import { NewCaseStudyForm } from "./form";

export default async function NewCaseStudyPage() {
  const supabase = await createSupabaseServerClient();
  const { data: sectors } = await supabase
    .from("sectors")
    .select("id, name")
    .order("name");

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 p-6 md:p-10">
      <PageHeader
        breadcrumbs={[
          { href: "/admin/case-studies", label: "Études de cas" },
          { href: "/admin/case-studies/new", label: "Nouvelle" },
        ]}
        title="Nouvelle étude de cas"
        description="On crée un brouillon minimaliste. Tu complèteras la stratégie, les résultats et les médias juste après."
      />

      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs md:p-8">
        <NewCaseStudyForm sectors={sectors ?? []} />
      </div>
    </div>
  );
}
