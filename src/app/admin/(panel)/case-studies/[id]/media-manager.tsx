"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Link as LinkIcon, Plus, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/types/database";
import { addMediaAction, deleteMediaAction } from "../actions";
import { bucketForMediaType, uploadToStorage } from "@/lib/upload";

type Media = Database["public"]["Tables"]["case_study_media"]["Row"];
type MediaType = Database["public"]["Enums"]["media_type"];

const MEDIA_TYPES: { value: MediaType; label: string }[] = [
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
  { value: "screenshot", label: "Capture d'ecran" },
  { value: "proof", label: "Preuve visuelle" },
  { value: "ad_creative", label: "Ad creative" },
  { value: "ugc", label: "UGC" },
];

function isVideo(type: MediaType) {
  return type === "video" || type === "ugc";
}

export function MediaManager({
  caseStudyId,
  items,
}: {
  caseStudyId: string;
  items: Media[];
}) {
  const router = useRouter();
  const [mediaType, setMediaType] = useState<MediaType>("image");
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<"file" | "url">("file");
  const [externalUrl, setExternalUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const [, startTransition] = useTransition();

  async function handleAddByUrl() {
    const trimmed = externalUrl.trim();
    if (!trimmed) return;
    try {
      new URL(trimmed);
    } catch {
      toast.error("URL invalide");
      return;
    }
    setAdding(true);
    try {
      const result = await addMediaAction({
        caseStudyId,
        mediaType,
        fileUrl: trimmed,
        title: title || undefined,
      });
      if (!result.success) {
        toast.error(result.error ?? "Insertion impossible");
        return;
      }
      toast.success("Media ajouté");
      setExternalUrl("");
      setTitle("");
      router.refresh();
    } finally {
      setAdding(false);
    }
  }

  async function handleFiles(files: File[]) {
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const bucket = bucketForMediaType(mediaType);
        const { url } = await uploadToStorage(bucket, caseStudyId, file);
        const result = await addMediaAction({
          caseStudyId,
          mediaType,
          fileUrl: url,
          title: title || undefined,
        });
        if (!result.success) {
          toast.error(result.error ?? "Insertion impossible");
          continue;
        }
      }
      toast.success(`${files.length} media(s) ajoute(s)`);
      setTitle("");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload impossible");
    } finally {
      setUploading(false);
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFiles,
    accept: isVideo(mediaType)
      ? { "video/*": [] }
      : { "image/*": [] },
    disabled: uploading,
  });

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteMediaAction(id, caseStudyId);
      if (!result.success) {
        toast.error(result.error ?? "Suppression impossible");
        return;
      }
      toast.success("Supprime");
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-lg border border-dashed p-4">
        <div className="grid gap-3 md:grid-cols-[160px,1fr]">
          <div>
            <Label className="mb-1 block text-xs">Type</Label>
            <Select
              value={mediaType}
              onValueChange={(v) => v && setMediaType(v as MediaType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MEDIA_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1 block text-xs">Titre (optionnel)</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Creative principale"
            />
          </div>
        </div>

        {/* Mode tabs */}
        <div className="inline-flex items-center rounded-full border border-border bg-background p-0.5 text-[11px]">
          <button
            type="button"
            onClick={() => setMode("file")}
            className={
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium transition-colors " +
              (mode === "file"
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            <UploadCloud className="h-3 w-3" />
            Fichier
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium transition-colors " +
              (mode === "url"
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            <LinkIcon className="h-3 w-3" />
            URL
          </button>
        </div>

        {mode === "file" ? (
          <div
            {...getRootProps()}
            className={
              "flex h-20 cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed text-sm transition-colors " +
              (isDragActive
                ? "border-primary bg-primary/5 text-primary"
                : "border-border bg-muted hover:bg-muted/70") +
              (uploading ? " pointer-events-none opacity-60" : "")
            }
          >
            <input {...getInputProps()} />
            <UploadCloud className="h-4 w-4" />
            {uploading
              ? "Envoi…"
              : isDragActive
                ? "Déposez ici"
                : "Déposez un ou plusieurs fichiers, ou cliquez"}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://..."
              className="font-mono text-sm"
              disabled={adding}
            />
            <Button
              type="button"
              size="sm"
              onClick={handleAddByUrl}
              disabled={adding || !externalUrl.trim()}
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              {adding ? "Ajout…" : "Ajouter"}
            </Button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucun media pour le moment.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {items.map((m) => {
            const isVid = isVideo(m.media_type);
            return (
              <div
                key={m.id}
                className="group relative overflow-hidden rounded-lg border bg-card"
              >
                <div className="aspect-video bg-muted">
                  {isVid ? (
                    <video
                      src={m.file_url}
                      controls
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.file_url}
                      alt={m.title ?? ""}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 p-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium">
                      {m.title ?? m.media_type}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {m.media_type}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDelete(m.id)}
                    aria-label="Supprimer ce media"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
