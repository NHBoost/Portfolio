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
