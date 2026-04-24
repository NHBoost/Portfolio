"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireStaff, requireAdmin } from "@/lib/auth";

export type RealisationType = "ads" | "video" | "social" | "podcast";
export type ActionResult =
  | { success: true; id?: string }
  | { success: false; error: string };

const ALLOWED: RealisationType[] = ["ads", "video", "social", "podcast"];

function normalizeUrl(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  try {
    const withScheme = s.match(/^https?:\/\//i) ? s : `https://${s}`;
    return new URL(withScheme).toString();
  } catch {
    return null;
  }
}

function readForm(formData: FormData) {
  const type = String(formData.get("type") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const clientName = String(formData.get("client_name") ?? "").trim();
  const mediaUrlRaw = String(formData.get("media_url") ?? "").trim();
  const thumbRaw = String(formData.get("thumbnail_url") ?? "").trim();
  const externalRaw = String(formData.get("external_url") ?? "").trim();
  const caseStudyId = String(formData.get("case_study_id") ?? "").trim();

  return {
    type,
    title,
    description,
    clientName,
    mediaUrl: mediaUrlRaw ? normalizeUrl(mediaUrlRaw) : null,
    thumbnailUrl: thumbRaw ? normalizeUrl(thumbRaw) : null,
    externalUrl: externalRaw ? normalizeUrl(externalRaw) : null,
    caseStudyId: caseStudyId || null,
  };
}

export async function createRealisationAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireStaff();
  const f = readForm(formData);

  if (!ALLOWED.includes(f.type as RealisationType)) {
    return { success: false, error: "Type invalide" };
  }
  if (!f.mediaUrl && !f.externalUrl) {
    return {
      success: false,
      error: "Fournis au moins une URL (media ou lien externe)",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data: last } = await supabase
    .from("realisations")
    .select("sort_order")
    .eq("type", f.type as RealisationType)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (last?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("realisations")
    .insert({
      type: f.type as RealisationType,
      title: f.title || null,
      description: f.description || null,
      media_url: f.mediaUrl,
      thumbnail_url: f.thumbnailUrl,
      external_url: f.externalUrl,
      client_name: f.clientName || null,
      case_study_id: f.caseStudyId,
      sort_order: nextOrder,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { success: false, error: error?.message ?? "Création impossible" };
  }
  revalidatePath("/admin/realisations");
  revalidatePath("/");
  return { success: true, id: data.id };
}

export async function updateRealisationAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireStaff();
  const f = readForm(formData);

  if (!ALLOWED.includes(f.type as RealisationType)) {
    return { success: false, error: "Type invalide" };
  }
  if (!f.mediaUrl && !f.externalUrl) {
    return {
      success: false,
      error: "Fournis au moins une URL (media ou lien externe)",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("realisations")
    .update({
      type: f.type as RealisationType,
      title: f.title || null,
      description: f.description || null,
      media_url: f.mediaUrl,
      thumbnail_url: f.thumbnailUrl,
      external_url: f.externalUrl,
      client_name: f.clientName || null,
      case_study_id: f.caseStudyId,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/realisations");
  revalidatePath("/");
  return { success: true, id };
}

export async function deleteRealisationAction(
  id: string,
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("realisations").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/realisations");
  revalidatePath("/");
  return { success: true };
}

export async function reorderRealisationAction(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createSupabaseServerClient();

  // Get current item to know its type
  const { data: current } = await supabase
    .from("realisations")
    .select("id, type, sort_order")
    .eq("id", id)
    .maybeSingle();
  if (!current) return { success: false, error: "Introuvable" };

  const { data: all } = await supabase
    .from("realisations")
    .select("id, sort_order")
    .eq("type", current.type)
    .order("sort_order", { ascending: true });
  if (!all) return { success: false, error: "Liste inaccessible" };

  const idx = all.findIndex((r) => r.id === id);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= all.length) return { success: true, id };

  const a = all[idx];
  const b = all[swapIdx];

  await supabase
    .from("realisations")
    .update({ sort_order: b.sort_order })
    .eq("id", a.id);
  await supabase
    .from("realisations")
    .update({ sort_order: a.sort_order })
    .eq("id", b.id);

  revalidatePath("/admin/realisations");
  revalidatePath("/");
  return { success: true, id };
}
