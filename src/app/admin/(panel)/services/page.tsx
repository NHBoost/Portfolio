import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/page-header";
import { TagManager } from "@/components/admin/tag-manager";
import {
  createServiceAction,
  deleteServiceAction,
  updateServiceAction,
} from "./actions";

export default async function ServicesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: services } = await supabase
    .from("services")
    .select("id, name, slug")
    .order("name");

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6 md:p-10">
      <PageHeader
        eyebrow="Bibliothèque"
        title="Services"
        description="Prestations associées aux études : Meta Ads, SEO, funnel, branding, etc."
      />
      <TagManager
        items={services ?? []}
        onCreate={createServiceAction}
        onUpdate={updateServiceAction}
        onDelete={deleteServiceAction}
        entityLabel="service"
      />
    </div>
  );
}
