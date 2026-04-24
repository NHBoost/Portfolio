"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ExternalLink,
  Headphones,
  Image as ImageIcon,
  Share2,
  Megaphone,
  Pencil,
  Plus,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MediaUrlInput } from "@/components/admin/media-url-input";
import { cn } from "@/lib/utils";
import {
  createRealisationAction,
  deleteRealisationAction,
  reorderRealisationAction,
  updateRealisationAction,
  type RealisationType,
} from "./actions";

export type RealisationRow = {
  id: string;
  type: RealisationType;
  title: string | null;
  description: string | null;
  media_url: string | null;
  thumbnail_url: string | null;
  external_url: string | null;
  client_name: string | null;
  sort_order: number;
  case_study_id: string | null;
};

type CaseOption = { id: string; project_name: string };

const NONE = "__none__";

const TYPE_META: Record<
  RealisationType,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    helper: string;
  }
> = {
  ads: {
    label: "Captures Ads",
    icon: Megaphone,
    helper: "Screenshots d'ads performantes (image)",
  },
  video: {
    label: "Vidéos clients",
    icon: Video,
    helper: "Vidéos en MP4/WebM ou lien YouTube",
  },
  social: {
    label: "Réseaux sociaux",
    icon: Share2,
    helper: "Captures de posts / vidéo + lien plateforme",
  },
  podcast: {
    label: "Podcasts",
    icon: Headphones,
    helper: "Lien Spotify/Apple Podcasts + vignette",
  },
};

const ORDER: RealisationType[] = ["ads", "video", "social", "podcast"];

function displayHost(url: string | null) {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function previewImage(row: RealisationRow): string | null {
  if (row.thumbnail_url) return row.thumbnail_url;
  if (row.type === "ads" || row.type === "social") return row.media_url;
  return null;
}

export function RealisationsManager({
  items,
  caseOptions,
}: {
  items: RealisationRow[];
  caseOptions: CaseOption[];
}) {
  const router = useRouter();
  const [activeType, setActiveType] = useState<RealisationType>("ads");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const grouped = ORDER.reduce(
    (acc, t) => {
      acc[t] = items.filter((i) => i.type === t);
      return acc;
    },
    {} as Record<RealisationType, RealisationRow[]>,
  );

  const activeItems = grouped[activeType] ?? [];

  function run(
    fn: () => Promise<{ success: boolean; error?: string }>,
    onSuccess?: () => void,
  ) {
    startTransition(async () => {
      const result = await fn();
      if (!result.success) {
        toast.error(result.error ?? "Action impossible");
        return;
      }
      onSuccess?.();
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {/* Type tabs */}
      <div className="flex flex-wrap gap-1.5 rounded-2xl border border-border bg-card p-1.5">
        {ORDER.map((t) => {
          const TypeIcon = TYPE_META[t].icon;
          const count = grouped[t]?.length ?? 0;
          const active = activeType === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => {
                setActiveType(t);
                setEditingId(null);
                setShowForm(false);
              }}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
              )}
            >
              <TypeIcon className="h-3.5 w-3.5" />
              {TYPE_META[t].label}
              {count > 0 ? (
                <span
                  className={cn(
                    "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                    active
                      ? "bg-white/20 text-accent-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <p className="text-[12px] text-muted-foreground">
        {TYPE_META[activeType].helper}
      </p>

      {!showForm && !editingId ? (
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            onClick={() => setShowForm(true)}
            disabled={isPending}
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Ajouter
          </Button>
        </div>
      ) : null}

      {showForm ? (
        <RealisationForm
          type={activeType}
          caseOptions={caseOptions}
          onCancel={() => setShowForm(false)}
          onSubmit={(fd) =>
            run(
              () => createRealisationAction(fd),
              () => {
                toast.success("Réalisation ajoutée");
                setShowForm(false);
              },
            )
          }
          submitLabel="Ajouter"
          isPending={isPending}
        />
      ) : null}

      {activeItems.length === 0 && !showForm ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 py-12 text-center">
          <p className="font-display text-base font-semibold text-foreground">
            Aucune réalisation {TYPE_META[activeType].label.toLowerCase()}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Ajoute-en une pour qu&apos;elle apparaisse sur la page d&apos;accueil.
          </p>
        </div>
      ) : null}

      <ul className="space-y-3">
        {activeItems.map((r, i) => {
          const isEditing = editingId === r.id;
          const TypeIcon = TYPE_META[r.type].icon;
          const preview = previewImage(r);
          return (
            <li
              key={r.id}
              className={cn(
                "rounded-xl border border-border bg-card transition-shadow",
                isEditing ? "shadow-sm" : "hover:shadow-xs",
              )}
            >
              {isEditing ? (
                <div className="p-5">
                  <RealisationForm
                    type={r.type}
                    initial={r}
                    caseOptions={caseOptions}
                    onCancel={() => setEditingId(null)}
                    onSubmit={(fd) =>
                      run(
                        () => updateRealisationAction(r.id, fd),
                        () => {
                          toast.success("Mis à jour");
                          setEditingId(null);
                        },
                      )
                    }
                    submitLabel="Enregistrer"
                    isPending={isPending}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:gap-4">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground">
                    {preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={preview}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : r.type === "video" ? (
                      <Video className="h-6 w-6" />
                    ) : r.type === "podcast" ? (
                      <Headphones className="h-6 w-6" />
                    ) : (
                      <ImageIcon className="h-6 w-6" />
                    )}
                    <span className="absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-deep/90 text-[9px] font-bold text-white">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 truncate font-medium text-foreground">
                      <TypeIcon
                        aria-hidden
                        className="h-3.5 w-3.5 shrink-0 text-brand-deep"
                      />
                      {r.title ?? "Sans titre"}
                    </p>
                    <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      {r.client_name ? <span>{r.client_name}</span> : null}
                      {r.client_name && (r.media_url || r.external_url) ? (
                        <span className="text-muted-foreground/40">·</span>
                      ) : null}
                      {r.external_url ?? r.media_url ? (
                        <a
                          href={r.external_url ?? r.media_url ?? "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 hover:text-foreground"
                        >
                          {displayHost(r.external_url ?? r.media_url)}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : null}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Monter"
                      disabled={i === 0 || isPending}
                      onClick={() =>
                        run(() => reorderRealisationAction(r.id, "up"))
                      }
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Descendre"
                      disabled={i === activeItems.length - 1 || isPending}
                      onClick={() =>
                        run(() => reorderRealisationAction(r.id, "down"))
                      }
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Modifier"
                      onClick={() => setEditingId(r.id)}
                      disabled={isPending}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Supprimer"
                      disabled={isPending}
                      onClick={() => {
                        if (
                          !confirm(
                            `Supprimer « ${r.title ?? "cette réalisation"} » ?`,
                          )
                        )
                          return;
                        run(
                          () => deleteRealisationAction(r.id),
                          () => toast.success("Supprimé"),
                        );
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function RealisationForm({
  type,
  initial,
  caseOptions,
  onSubmit,
  onCancel,
  submitLabel,
  isPending,
}: {
  type: RealisationType;
  initial?: RealisationRow;
  caseOptions: CaseOption[];
  onSubmit: (fd: FormData) => void;
  onCancel: () => void;
  submitLabel: string;
  isPending: boolean;
}) {
  const [caseStudyId, setCaseStudyId] = useState<string>(
    initial?.case_study_id ?? NONE,
  );
  const [mediaUrl, setMediaUrl] = useState<string>(initial?.media_url ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(
    initial?.thumbnail_url ?? "",
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("type", type);
    fd.set("case_study_id", caseStudyId === NONE ? "" : caseStudyId);
    fd.set("media_url", mediaUrl);
    fd.set("thumbnail_url", thumbnailUrl);
    onSubmit(fd);
  }

  const isPodcastOrSocial = type === "podcast" || type === "social";
  const mediaLabel =
    type === "ads"
      ? "Image"
      : type === "video"
        ? "Vidéo (MP4/WebM ou lien YouTube)"
        : type === "podcast"
          ? "Audio (MP3) — optionnel"
          : "Vignette (image/vidéo) — optionnel";

  const mediaAccept: Record<string, string[]> =
    type === "ads"
      ? { "image/*": [] }
      : type === "video"
        ? { "video/*": [] }
        : type === "podcast"
          ? { "audio/*": [] }
          : { "image/*": [], "video/*": [] };

  const mediaHint: "image" | "video" | "audio" | "auto" =
    type === "ads"
      ? "image"
      : type === "video"
        ? "video"
        : type === "podcast"
          ? "audio"
          : "auto";

  const pathPrefix = `realisations/${type}`;

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "space-y-4 rounded-2xl",
        initial ? "" : "border border-border bg-card p-5 md:p-6",
      )}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="title" className="text-xs font-medium">
            Titre
          </Label>
          <Input
            id="title"
            name="title"
            defaultValue={initial?.title ?? ""}
            placeholder={
              type === "podcast"
                ? "Ex: Interview Le Colibri · S2E04"
                : "Ex: Creative ads · Clinique Lumière"
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="client_name" className="text-xs font-medium">
            Client (optionnel)
          </Label>
          <Input
            id="client_name"
            name="client_name"
            defaultValue={initial?.client_name ?? ""}
            placeholder="Ex: Le Colibri"
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="media_url" className="text-xs font-medium">
            {mediaLabel}
          </Label>
          <MediaUrlInput
            id="media_url"
            name="media_url"
            value={mediaUrl}
            onChange={setMediaUrl}
            accept={mediaAccept}
            pathPrefix={pathPrefix}
            previewHint={mediaHint}
            disabled={isPending}
          />
        </div>
        {(type === "video" || isPodcastOrSocial) && (
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="thumbnail_url" className="text-xs font-medium">
              Vignette (optionnel)
            </Label>
            <MediaUrlInput
              id="thumbnail_url"
              name="thumbnail_url"
              value={thumbnailUrl}
              onChange={setThumbnailUrl}
              accept={{ "image/*": [] }}
              pathPrefix={`${pathPrefix}/thumbnails`}
              previewHint="image"
              disabled={isPending}
            />
          </div>
        )}
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="external_url" className="text-xs font-medium">
            Lien externe (vers la plateforme d&apos;origine — optionnel)
          </Label>
          <Input
            id="external_url"
            name="external_url"
            type="url"
            defaultValue={initial?.external_url ?? ""}
            placeholder={
              type === "podcast"
                ? "https://open.spotify.com/episode/..."
                : type === "social"
                  ? "https://instagram.com/p/..."
                  : "https://..."
            }
            className="font-mono text-sm"
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="description" className="text-xs font-medium">
            Description (optionnel)
          </Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={initial?.description ?? ""}
            rows={2}
            placeholder="Court contexte, ROI, angle marketing..."
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="case_study_id" className="text-xs font-medium">
            Étude de cas associée (optionnel)
          </Label>
          <Select
            value={caseStudyId}
            onValueChange={(v) => setCaseStudyId(v ?? NONE)}
          >
            <SelectTrigger id="case_study_id">
              {caseStudyId !== NONE ? (
                <SelectValue />
              ) : (
                <span className="text-muted-foreground">— Aucune —</span>
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>— Aucune —</SelectItem>
              {caseOptions.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.project_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isPending}
        >
          <X className="mr-1 h-3.5 w-3.5" />
          Annuler
        </Button>
        <Button type="submit" size="sm" disabled={isPending}>
          <Check className="mr-1 h-3.5 w-3.5" />
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
