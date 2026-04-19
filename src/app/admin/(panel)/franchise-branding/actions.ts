"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

function textOrNull(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s || null;
}

function required(v: FormDataEntryValue | null, fallback: string): string {
  const s = String(v ?? "").trim();
  return s || fallback;
}

export async function updateFranchiseAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("franchise_settings")
    .update({
      franchise_name: required(
        formData.get("franchise_name"),
        "Portfolio ROI",
      ),
      logo_url: textOrNull(formData.get("logo_url")),
      primary_color: required(formData.get("primary_color"), "#5694bd"),
      secondary_color: required(formData.get("secondary_color"), "#3e6493"),
      accent_color: required(formData.get("accent_color"), "#2a2e5e"),
      email: textOrNull(formData.get("email")),
      phone: textOrNull(formData.get("phone")),
      whatsapp_url: textOrNull(formData.get("whatsapp_url")),
      address: textOrNull(formData.get("address")),
      cta_text: textOrNull(formData.get("cta_text")),
    })
    .eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/franchise-branding");
  revalidatePath("/");
  return { success: true };
}
