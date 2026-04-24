import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type StorageBucket =
  | "case-study-images"
  | "case-study-videos"
  | "logos"
  | "realisations";

const VIDEO_TYPES = ["video", "ugc"] as const;

export function bucketForMediaType(mediaType: string): StorageBucket {
  if ((VIDEO_TYPES as readonly string[]).includes(mediaType)) {
    return "case-study-videos";
  }
  return "case-study-images";
}

/**
 * Pick the right bucket for a given MIME type:
 *  - image/*        → case-study-images
 *  - video/*        → case-study-videos
 *  - audio/* & rest → realisations (unified, supports all)
 */
export function bucketForMimeType(mime: string): StorageBucket {
  if (mime.startsWith("image/")) return "case-study-images";
  if (mime.startsWith("video/")) return "case-study-videos";
  if (mime.startsWith("audio/")) return "realisations";
  return "realisations";
}

export async function uploadToStorage(
  bucket: StorageBucket,
  pathPrefix: string,
  file: File,
): Promise<{ url: string; path: string }> {
  const supabase = createSupabaseBrowserClient();
  const ext = file.name.split(".").pop() ?? "bin";
  const safeName = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .slice(0, 40);
  const path = `${pathPrefix}/${Date.now()}-${safeName}.${ext}`;

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

/**
 * Convenience helper: upload any file, auto-routing to the right bucket.
 */
export async function uploadFileAuto(
  file: File,
  pathPrefix = "uploads",
): Promise<{ url: string; path: string; bucket: StorageBucket }> {
  const bucket = bucketForMimeType(file.type);
  const result = await uploadToStorage(bucket, pathPrefix, file);
  return { ...result, bucket };
}
