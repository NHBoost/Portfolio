import { createSupabaseServerClient } from "@/lib/supabase/server";
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
    <div className="space-y-6 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-accent">
          Services
        </h1>
        <p className="text-sm text-muted-foreground">
          Categories de prestations associees aux etudes de cas (Meta Ads, SEO,
          funnel, etc.).
        </p>
      </div>

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
