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

export type TrustEntry = {
  slug: string;
  client_name: string;
  logo_url: string | null;
};

export async function getTrustLogos(limit = 10): Promise<TrustEntry[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("case_studies")
    .select("slug, client_name, client_logo_url")
    .eq("status", "published")
    .not("client_name", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? [])
    .filter((row) => row.client_name)
    .map((row) => ({
      slug: row.slug,
      client_name: row.client_name as string,
      logo_url: row.client_logo_url,
    }));
}

export type FeaturedTestimonialEntry = {
  slug: string;
  project_name: string;
  client_name: string | null;
  sector: string | null;
  testimonial: string;
  roi: number | null;
};

export type ShowcaseWebsite = {
  id: string;
  url: string;
  title: string;
  activity: string | null;
  caseSlug: string | null;
};

export async function getWebsites(): Promise<ShowcaseWebsite[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("websites")
    .select(
      "id, url, title, activity, sort_order, case_study:case_studies(slug, status)",
    )
    .order("sort_order", { ascending: true });

  return (data ?? []).map((row) => ({
    id: row.id,
    url: row.url,
    title: row.title,
    activity: row.activity,
    caseSlug:
      row.case_study && row.case_study.status === "published"
        ? row.case_study.slug
        : null,
  }));
}

export type RealisationPublic = {
  id: string;
  type: "ads" | "video" | "social" | "podcast";
  title: string | null;
  description: string | null;
  media_url: string | null;
  thumbnail_url: string | null;
  external_url: string | null;
  client_name: string | null;
  caseSlug: string | null;
};

export async function getRealisationsByType(): Promise<
  Record<"ads" | "video" | "social" | "podcast", RealisationPublic[]>
> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("realisations")
    .select(
      "id, type, title, description, media_url, thumbnail_url, external_url, client_name, sort_order, case_study:case_studies(slug, status)",
    )
    .order("sort_order", { ascending: true });

  const initial = {
    ads: [] as RealisationPublic[],
    video: [] as RealisationPublic[],
    social: [] as RealisationPublic[],
    podcast: [] as RealisationPublic[],
  };

  for (const row of data ?? []) {
    initial[row.type].push({
      id: row.id,
      type: row.type,
      title: row.title,
      description: row.description,
      media_url: row.media_url,
      thumbnail_url: row.thumbnail_url,
      external_url: row.external_url,
      client_name: row.client_name,
      caseSlug:
        row.case_study && row.case_study.status === "published"
          ? row.case_study.slug
          : null,
    });
  }
  return initial;
}

export async function getFeaturedTestimonial(): Promise<FeaturedTestimonialEntry | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("case_studies")
    .select(
      "slug, project_name, client_name, testimonial, roi, sector:sectors(name)",
    )
    .eq("status", "published")
    .not("testimonial", "is", null)
    .order("roi", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (!data || !data.testimonial) return null;

  return {
    slug: data.slug,
    project_name: data.project_name,
    client_name: data.client_name,
    sector: data.sector?.name ?? null,
    testimonial: data.testimonial,
    roi: data.roi ? Number(data.roi) : null,
  };
}
