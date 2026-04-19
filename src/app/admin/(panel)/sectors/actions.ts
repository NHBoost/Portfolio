"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireStaff, requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function createSectorAction(
  name: string,
): Promise<ActionResult> {
  await requireStaff();
  const trimmed = name.trim();
  if (!trimmed) return { success: false, error: "Nom requis" };
  const slug = slugify(trimmed);
  if (!slug) return { success: false, error: "Slug invalide" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("sectors")
    .insert({ name: trimmed, slug });
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/sectors");
  return { success: true };
}

export async function updateSectorAction(
  id: string,
  name: string,
): Promise<ActionResult> {
  await requireStaff();
  const trimmed = name.trim();
  if (!trimmed) return { success: false, error: "Nom requis" };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("sectors")
    .update({ name: trimmed, slug: slugify(trimmed) })
    .eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/sectors");
  return { success: true };
}

export async function deleteSectorAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("sectors").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/sectors");
  return { success: true };
}
