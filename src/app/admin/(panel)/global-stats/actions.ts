"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

function toInt(v: FormDataEntryValue | null): number {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
}

function toFloat(v: FormDataEntryValue | null): number {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

export async function updateGlobalStatsAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("global_stats")
    .update({
      total_views: toInt(formData.get("total_views")),
      total_leads: toInt(formData.get("total_leads")),
      total_clients: toInt(formData.get("total_clients")),
      average_roas: toFloat(formData.get("average_roas")),
      total_revenue: toFloat(formData.get("total_revenue")),
    })
    .eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/global-stats");
  revalidatePath("/");
  return { success: true };
}
