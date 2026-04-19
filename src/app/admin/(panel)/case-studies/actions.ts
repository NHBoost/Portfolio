"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireStaff, requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import {
  caseStudyFormSchema,
  caseStudyStatusEnum,
} from "@/lib/zod/case-study";

async function ensureUniqueSlug(
  base: string,
  excludeId?: string,
): Promise<string> {
  const supabase = await createSupabaseServerClient();
  let candidate = base || "etude";
  let counter = 1;
  while (true) {
    const query = supabase
      .from("case_studies")
      .select("id")
      .eq("slug", candidate)
      .limit(1);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    const conflict = (data ?? []).find((r) => r.id !== excludeId);
    if (!conflict) return candidate;
    counter += 1;
    candidate = `${base}-${counter}`;
  }
}

export type ActionResult =
  | { success: true; id?: string }
  | { success: false; error: string };

export async function createCaseStudyAction(
  formData: FormData,
): Promise<ActionResult> {
  const profile = await requireStaff();

  const rawName = String(formData.get("project_name") ?? "").trim();
  if (!rawName) {
    return { success: false, error: "Nom du projet requis" };
  }

  const desiredSlug = String(formData.get("slug") ?? "").trim();
  const baseSlug = slugify(desiredSlug || rawName);
  if (!baseSlug) {
    return { success: false, error: "Slug invalide" };
  }
  const slug = await ensureUniqueSlug(baseSlug);

  const sectorIdRaw = String(formData.get("sector_id") ?? "").trim();
  const clientName = String(formData.get("client_name") ?? "").trim();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("case_studies")
    .insert({
      project_name: rawName,
      slug,
      client_name: clientName || null,
      sector_id: sectorIdRaw || null,
      status: "draft",
      created_by: profile.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      success: false,
      error: error?.message ?? "Creation impossible",
    };
  }

  revalidatePath("/admin/case-studies");
  redirect(`/admin/case-studies/${data.id}`);
}

export async function updateCaseStudyAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireStaff();

  const payload: Record<string, FormDataEntryValue | null> = {};
  formData.forEach((value, key) => {
    if (key === "service_ids[]") {
      const existing = payload["service_ids[]"];
      if (Array.isArray(existing)) {
        (existing as FormDataEntryValue[]).push(value);
      } else {
        payload["service_ids[]"] = value;
        payload["service_ids"] = [value] as unknown as FormDataEntryValue;
      }
    } else {
      payload[key] = value;
    }
  });

  const serviceIds = formData.getAll("service_ids[]").map(String);

  const parseInput = {
    project_name: payload.project_name,
    slug: payload.slug,
    client_name: payload.client_name,
    sector_id: payload.sector_id,
    cover_image_url: payload.cover_image_url,
    client_logo_url: payload.client_logo_url,
    status: payload.status,

    short_problem: payload.short_problem,
    initial_situation: payload.initial_situation,
    business_goal: payload.business_goal,

    strategy_angle: payload.strategy_angle,
    positioning: payload.positioning,
    offer_details: payload.offer_details,
    funnel_details: payload.funnel_details,
    targeting_details: payload.targeting_details,

    execution_details: payload.execution_details,

    leads_count: payload.leads_count,
    cost_per_lead: payload.cost_per_lead,
    clients_count: payload.clients_count,
    revenue_generated: payload.revenue_generated,
    roas: payload.roas,
    ad_budget: payload.ad_budget,
    roi: payload.roi,

    traffic_before: payload.traffic_before,
    traffic_after: payload.traffic_after,
    revenue_before: payload.revenue_before,
    revenue_after: payload.revenue_after,
    visibility_before: payload.visibility_before,
    visibility_after: payload.visibility_after,

    conclusion: payload.conclusion,
    testimonial: payload.testimonial,

    service_ids: serviceIds,
  };

  const parsed = caseStudyFormSchema.safeParse(parseInput);
  if (!parsed.success) {
    return {
      success: false,
      error:
        parsed.error.issues[0]?.message ??
        "Donnees invalides dans le formulaire",
    };
  }

  const data = parsed.data;
  const slug = await ensureUniqueSlug(slugify(data.slug), id);

  const supabase = await createSupabaseServerClient();

  const { error: updateError } = await supabase
    .from("case_studies")
    .update({
      project_name: data.project_name,
      slug,
      client_name: data.client_name,
      sector_id: data.sector_id,
      cover_image_url: data.cover_image_url,
      client_logo_url: data.client_logo_url,
      status: data.status,

      short_problem: data.short_problem,
      initial_situation: data.initial_situation,
      business_goal: data.business_goal,

      strategy_angle: data.strategy_angle,
      positioning: data.positioning,
      offer_details: data.offer_details,
      funnel_details: data.funnel_details,
      targeting_details: data.targeting_details,

      execution_details: data.execution_details,

      leads_count: data.leads_count,
      cost_per_lead: data.cost_per_lead,
      clients_count: data.clients_count,
      revenue_generated: data.revenue_generated,
      roas: data.roas,
      ad_budget: data.ad_budget,
      roi: data.roi,

      traffic_before: data.traffic_before,
      traffic_after: data.traffic_after,
      revenue_before: data.revenue_before,
      revenue_after: data.revenue_after,
      visibility_before: data.visibility_before,
      visibility_after: data.visibility_after,

      conclusion: data.conclusion,
      testimonial: data.testimonial,
    })
    .eq("id", id);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // Sync pivot: remove all then insert the new ones
  const { error: deletePivotError } = await supabase
    .from("case_study_services")
    .delete()
    .eq("case_study_id", id);
  if (deletePivotError) {
    return { success: false, error: deletePivotError.message };
  }
  if (data.service_ids.length > 0) {
    const rows = data.service_ids.map((sid) => ({
      case_study_id: id,
      service_id: sid,
    }));
    const { error: insertPivotError } = await supabase
      .from("case_study_services")
      .insert(rows);
    if (insertPivotError) {
      return { success: false, error: insertPivotError.message };
    }
  }

  revalidatePath("/admin/case-studies");
  revalidatePath(`/admin/case-studies/${id}`);
  return { success: true, id };
}

export async function togglePublishAction(
  id: string,
  publish: boolean,
): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createSupabaseServerClient();
  const target = caseStudyStatusEnum.parse(publish ? "published" : "draft");
  const { error } = await supabase
    .from("case_studies")
    .update({ status: target })
    .eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/case-studies");
  revalidatePath(`/admin/case-studies/${id}`);
  return { success: true, id };
}

export async function archiveCaseStudyAction(
  id: string,
): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("case_studies")
    .update({ status: "archived" })
    .eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/case-studies");
  return { success: true, id };
}

export async function deleteCaseStudyAction(
  id: string,
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("case_studies").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/case-studies");
  return { success: true };
}

export async function duplicateCaseStudyAction(
  id: string,
): Promise<ActionResult> {
  const profile = await requireStaff();
  const supabase = await createSupabaseServerClient();

  const { data: source, error: readError } = await supabase
    .from("case_studies")
    .select("*")
    .eq("id", id)
    .single();
  if (readError || !source) {
    return {
      success: false,
      error: readError?.message ?? "Etude introuvable",
    };
  }

  const { data: services } = await supabase
    .from("case_study_services")
    .select("service_id")
    .eq("case_study_id", id);

  const newSlug = await ensureUniqueSlug(`${source.slug}-copy`);

  const {
    id: _omitId,
    created_at: _omitCreatedAt,
    updated_at: _omitUpdatedAt,
    slug: _omitSlug,
    status: _omitStatus,
    ...rest
  } = source;
  void _omitId;
  void _omitCreatedAt;
  void _omitUpdatedAt;
  void _omitSlug;
  void _omitStatus;

  const { data: inserted, error: insertError } = await supabase
    .from("case_studies")
    .insert({
      ...rest,
      slug: newSlug,
      status: "draft",
      created_by: profile.id,
      project_name: `${source.project_name} (copie)`,
    })
    .select("id")
    .single();
  if (insertError || !inserted) {
    return {
      success: false,
      error: insertError?.message ?? "Duplication impossible",
    };
  }

  if (services && services.length > 0) {
    await supabase.from("case_study_services").insert(
      services.map((row) => ({
        case_study_id: inserted.id,
        service_id: row.service_id,
      })),
    );
  }

  revalidatePath("/admin/case-studies");
  return { success: true, id: inserted.id };
}

const mediaTypeEnum = [
  "image",
  "video",
  "screenshot",
  "proof",
  "ad_creative",
  "ugc",
] as const;
const proofTypeEnum = [
  "ads_manager",
  "crm",
  "lead_form",
  "analytics",
  "testimonial",
] as const;

export async function addMediaAction(input: {
  caseStudyId: string;
  mediaType: (typeof mediaTypeEnum)[number];
  fileUrl: string;
  title?: string;
  description?: string;
}): Promise<ActionResult> {
  await requireStaff();
  if (!mediaTypeEnum.includes(input.mediaType)) {
    return { success: false, error: "Type de media invalide" };
  }
  if (!input.fileUrl) {
    return { success: false, error: "URL manquante" };
  }
  const supabase = await createSupabaseServerClient();
  const { data: last } = await supabase
    .from("case_study_media")
    .select("sort_order")
    .eq("case_study_id", input.caseStudyId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (last?.sort_order ?? -1) + 1;
  const { data, error } = await supabase
    .from("case_study_media")
    .insert({
      case_study_id: input.caseStudyId,
      media_type: input.mediaType,
      file_url: input.fileUrl,
      title: input.title ?? null,
      description: input.description ?? null,
      sort_order: nextOrder,
    })
    .select("id")
    .single();
  if (error || !data) {
    return { success: false, error: error?.message ?? "Insertion impossible" };
  }
  revalidatePath(`/admin/case-studies/${input.caseStudyId}`);
  return { success: true, id: data.id };
}

export async function addProofAction(input: {
  caseStudyId: string;
  proofType: (typeof proofTypeEnum)[number];
  title?: string;
  fileUrl?: string;
  note?: string;
}): Promise<ActionResult> {
  await requireStaff();
  if (!proofTypeEnum.includes(input.proofType)) {
    return { success: false, error: "Type de preuve invalide" };
  }
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("case_study_proofs")
    .insert({
      case_study_id: input.caseStudyId,
      proof_type: input.proofType,
      title: input.title ?? null,
      file_url: input.fileUrl ?? null,
      note: input.note ?? null,
    })
    .select("id")
    .single();
  if (error || !data) {
    return { success: false, error: error?.message ?? "Insertion impossible" };
  }
  revalidatePath(`/admin/case-studies/${input.caseStudyId}`);
  return { success: true, id: data.id };
}

export async function deleteMediaAction(
  mediaId: string,
  caseStudyId: string,
): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("case_study_media")
    .delete()
    .eq("id", mediaId);
  if (error) return { success: false, error: error.message };
  revalidatePath(`/admin/case-studies/${caseStudyId}`);
  return { success: true };
}

export async function deleteProofAction(
  proofId: string,
  caseStudyId: string,
): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("case_study_proofs")
    .delete()
    .eq("id", proofId);
  if (error) return { success: false, error: error.message };
  revalidatePath(`/admin/case-studies/${caseStudyId}`);
  return { success: true };
}
