import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/page-header";
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
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6 md:p-10">
      <PageHeader
        eyebrow="Bibliothèque"
        title="Secteurs"
        description="Catégories d'activités utilisées pour taguer et filtrer les études de cas."
      />
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
