"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireStaff, requireAdmin } from "@/lib/auth";

export type ActionResult =
  | { success: true; id?: string }
  | { success: false; error: string };

function normalizeUrl(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  try {
    const withScheme = s.match(/^https?:\/\//i) ? s : `https://${s}`;
    const u = new URL(withScheme);
    return u.toString();
  } catch {
    return null;
  }
}

export async function createWebsiteAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireStaff();
  const title = String(formData.get("title") ?? "").trim();
  const activity = String(formData.get("activity") ?? "").trim();
  const rawUrl = String(formData.get("url") ?? "").trim();
  const caseStudyId = String(formData.get("case_study_id") ?? "").trim();

  if (!title) return { success: false, error: "Titre requis" };
  const url = normalizeUrl(rawUrl);
  if (!url) return { success: false, error: "URL invalide" };

  const supabase = await createSupabaseServerClient();

  // Append at the end
  const { data: last } = await supabase
    .from("websites")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (last?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("websites")
    .insert({
      title,
      url,
      activity: activity || null,
      sort_order: nextOrder,
      case_study_id: caseStudyId || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { success: false, error: error?.message ?? "Création impossible" };
  }
  revalidatePath("/admin/websites");
  revalidatePath("/");
  return { success: true, id: data.id };
}

export async function updateWebsiteAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireStaff();
  const title = String(formData.get("title") ?? "").trim();
  const activity = String(formData.get("activity") ?? "").trim();
  const rawUrl = String(formData.get("url") ?? "").trim();
  const caseStudyId = String(formData.get("case_study_id") ?? "").trim();

  if (!title) return { success: false, error: "Titre requis" };
  const url = normalizeUrl(rawUrl);
  if (!url) return { success: false, error: "URL invalide" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("websites")
    .update({
      title,
      url,
      activity: activity || null,
      case_study_id: caseStudyId || null,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/websites");
  revalidatePath("/");
  return { success: true, id };
}

export async function deleteWebsiteAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("websites").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/websites");
  revalidatePath("/");
  return { success: true };
}

export async function reorderWebsiteAction(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createSupabaseServerClient();
  const { data: all } = await supabase
    .from("websites")
    .select("id, sort_order")
    .order("sort_order", { ascending: true });
  if (!all) return { success: false, error: "Liste inaccessible" };

  const idx = all.findIndex((r) => r.id === id);
  if (idx === -1) return { success: false, error: "Élément introuvable" };

  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= all.length) return { success: true, id };

  const a = all[idx];
  const b = all[swapIdx];

  await supabase
    .from("websites")
    .update({ sort_order: b.sort_order })
    .eq("id", a.id);
  await supabase
    .from("websites")
    .update({ sort_order: a.sort_order })
    .eq("id", b.id);

  revalidatePath("/admin/websites");
  revalidatePath("/");
  return { success: true, id };
}
