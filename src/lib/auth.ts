import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Role = Database["public"]["Enums"]["user_role"];

const STAFF_ROLES: Role[] = ["super_admin", "admin", "editor"];
const ADMIN_ROLES: Role[] = ["super_admin", "admin"];

export async function getSessionUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return profile;
}

export async function requireStaff(): Promise<Profile> {
  const profile = await getProfile();
  if (!profile || !STAFF_ROLES.includes(profile.role)) {
    redirect("/admin/login");
  }
  return profile;
}

export async function requireAdmin(): Promise<Profile> {
  const profile = await getProfile();
  if (!profile || !ADMIN_ROLES.includes(profile.role)) {
    redirect("/admin/login");
  }
  return profile;
}

export function isStaffRole(role: Role | null | undefined): boolean {
  return !!role && STAFF_ROLES.includes(role);
}

export function isAdminRole(role: Role | null | undefined): boolean {
  return !!role && ADMIN_ROLES.includes(role);
}
