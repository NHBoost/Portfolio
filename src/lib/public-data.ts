import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type FranchiseSettings =
  Database["public"]["Tables"]["franchise_settings"]["Row"];
export type GlobalStats = Database["public"]["Tables"]["global_stats"]["Row"];

export async function getFranchiseSettings(): Promise<FranchiseSettings | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("franchise_settings")
    .select("*")
    .limit(1)
    .maybeSingle();
  return data;
}

export async function getGlobalStats(): Promise<GlobalStats | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("global_stats")
    .select("*")
    .limit(1)
    .maybeSingle();
  return data;
}

export type RealisationMedia = {
  id: string;
  media_type:
    | "image"
    | "video"
    | "screenshot"
    | "proof"
    | "ad_creative"
    | "ugc";
  file_url: string;
  case_slug: string;
  case_name: string;
};

export async function getRealisations(limit = 12): Promise<RealisationMedia[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("case_study_media")
    .select(
      "id, media_type, file_url, sort_order, case:case_studies!inner(slug, project_name, status)",
    )
    .in("media_type", ["image", "screenshot", "ad_creative", "video", "ugc"])
    .order("sort_order", { ascending: true })
    .limit(limit * 2);

  const rows = (data ?? [])
    .filter((row) => row.case && row.case.status === "published")
    .slice(0, limit)
    .map((row) => ({
      id: row.id,
      media_type: row.media_type,
      file_url: row.file_url,
      case_slug: row.case!.slug,
      case_name: row.case!.project_name,
    }));

  return rows;
}

export type ServiceRow = {
  id: string;
  slug: string;
  name: string;
};

export async function getServices(): Promise<ServiceRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("services")
    .select("id, slug, name")
    .order("name");
  return data ?? [];
}
