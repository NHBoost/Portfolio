"use client";

import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Check, Link as LinkIcon, UploadCloud, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { uploadFileAuto } from "@/lib/upload";

type Props = {
  name: string;
  id?: string;
  value: string;
  onChange: (v: string) => void;
  accept?: Record<string, string[]>;
  pathPrefix?: string;
  placeholder?: string;
  previewHint?: "image" | "video" | "audio" | "auto";
  disabled?: boolean;
};

const DEFAULT_ACCEPT = {
  "image/*": [],
  "video/*": [],
  "audio/*": [],
};

function guessKind(url: string): "image" | "video" | "audio" | "other" {
  const lower = url.toLowerCase();
  if (/\.(jpg|jpeg|png|webp|gif|svg|avif)(\?|$)/.test(lower)) return "image";
  if (/\.(mp4|webm|mov)(\?|$)/.test(lower)) return "video";
  if (/\.(mp3|wav|ogg|m4a|aac)(\?|$)/.test(lower)) return "audio";
  return "other";
}

export function MediaUrlInput({
  name,
  id,
  value,
  onChange,
  accept = DEFAULT_ACCEPT,
  pathPrefix = "uploads",
  placeholder = "https://...",
  previewHint = "auto",
  disabled,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<"url" | "file">(() =>
    value ? "url" : "file",
  );
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: File[]) {
    const file = files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadFileAuto(file, pathPrefix);
      onChange(url);
      toast.success("Fichier uploadé");
      setMode("url");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload impossible");
    } finally {
      setUploading(false);
    }
  }

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: handleFiles,
    accept,
    multiple: false,
    disabled: disabled || uploading,
  });

  const kind =
    previewHint === "auto"
      ? value
        ? guessKind(value)
        : "other"
      : previewHint;

  return (
    <div className="space-y-2">
      {/* Mode tabs */}
      <div className="inline-flex items-center rounded-full border border-border bg-background p-0.5 text-[11px]">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium transition-colors",
            mode === "url"
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <LinkIcon className="h-3 w-3" />
          URL
        </button>
        <button
          type="button"
          onClick={() => setMode("file")}
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium transition-colors",
            mode === "file"
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <UploadCloud className="h-3 w-3" />
          Fichier
        </button>
      </div>

      {mode === "url" ? (
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            id={id ?? name}
            name={name}
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled || uploading}
            className="font-mono text-sm"
          />
          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Vider"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      ) : (
        <>
          {/* hidden input synced with value so the form submit still sends it */}
          <input type="hidden" name={name} value={value} />
          <div
            {...getRootProps()}
            className={cn(
              "flex h-24 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed text-sm transition-colors",
              isDragActive
                ? "border-brand bg-brand/5 text-brand-deep"
                : "border-border bg-background/50 text-muted-foreground hover:border-brand/40 hover:bg-brand/5 hover:text-brand-deep",
              (disabled || uploading) && "pointer-events-none opacity-60",
            )}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-3 w-3 animate-spin rounded-full border-2 border-border border-t-brand-deep"
                />
                Upload en cours…
              </span>
            ) : isDragActive ? (
              <span className="inline-flex items-center gap-2">
                <UploadCloud className="h-4 w-4" />
                Déposez le fichier ici
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <UploadCloud className="h-4 w-4" />
                Déposez ou cliquez pour choisir
              </span>
            )}
          </div>
          {value ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                open();
              }}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground"
            >
              Remplacer le fichier actuel
            </button>
          ) : null}
        </>
      )}

      {/* Preview when we have a value */}
      {value ? (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card/60 p-2">
          {kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className="h-12 w-12 shrink-0 rounded-md border border-border object-cover"
            />
          ) : kind === "video" ? (
            <video
              src={value}
              muted
              playsInline
              preload="metadata"
              className="h-12 w-12 shrink-0 rounded-md border border-border object-cover"
            />
          ) : kind === "audio" ? (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <UploadCloud className="h-4 w-4" />
            </span>
          ) : (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Check className="h-4 w-4 text-emerald-600" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-[11px] text-foreground">
              {value}
            </p>
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-brand-deep hover:underline"
            >
              Ouvrir dans un onglet
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
