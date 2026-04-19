import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type StorageBucket =
  | "case-study-images"
  | "case-study-videos"
  | "logos";

const VIDEO_TYPES = ["video", "ugc"] as const;

export function bucketForMediaType(mediaType: string): StorageBucket {
  if ((VIDEO_TYPES as readonly string[]).includes(mediaType)) {
    return "case-study-videos";
  }
  return "case-study-images";
}

export async function uploadToStorage(
  bucket: StorageBucket,
  caseStudyId: string,
  file: File,
): Promise<{ url: string; path: string }> {
  const supabase = createSupabaseBrowserClient();
  const ext = file.name.split(".").pop() ?? "bin";
  const safeName = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .slice(0, 40);
  const path = `${caseStudyId}/${Date.now()}-${safeName}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, path };
}
