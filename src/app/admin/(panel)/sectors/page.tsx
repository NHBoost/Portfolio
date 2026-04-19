import { createSupabaseServerClient } from "@/lib/supabase/server";
import { TagManager } from "@/components/admin/tag-manager";
import {
  createSectorAction,
  deleteSectorAction,
  updateSectorAction,
} from "./actions";

export default async function SectorsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: sectors } = await supabase
    .from("sectors")
    .select("id, name, slug")
    .order("name");

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-accent">
          Secteurs
        </h1>
        <p className="text-sm text-muted-foreground">
          Categories d&apos;activites utilisees pour classer les etudes de cas.
        </p>
      </div>

      <TagManager
        items={sectors ?? []}
        onCreate={createSectorAction}
        onUpdate={updateSectorAction}
        onDelete={deleteSectorAction}
        entityLabel="secteur"
      />
    </div>
  );
}
