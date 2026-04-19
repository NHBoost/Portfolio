"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
  redirectTo: z.string().optional(),
});

export type SignInResult = { error: string } | never;

export async function signInAction(formData: FormData): Promise<SignInResult> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: formData.get("redirectTo") ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Champs invalides" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Email ou mot de passe incorrect" };
  }

  const target =
    parsed.data.redirectTo && parsed.data.redirectTo.startsWith("/admin")
      ? parsed.data.redirectTo
      : "/admin";
  redirect(target);
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
