"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { slugify } from "@/lib/slug";
import { createCaseStudyAction } from "../actions";

const NONE = "__none__";

export function NewCaseStudyForm({
  sectors,
}: {
  sectors: { id: string; name: string }[];
}) {
  const [projectName, setProjectName] = useState("");
  const [slug, setSlug] = useState("");
  const [sectorId, setSectorId] = useState<string>(NONE);
  const [slugTouched, setSlugTouched] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleNameChange(value: string) {
    setProjectName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    if (sectorId && sectorId !== NONE) fd.set("sector_id", sectorId);
    else fd.delete("sector_id");

    startTransition(async () => {
      const result = await createCaseStudyAction(fd);
      if (result && !result.success) {
        toast.error(result.error ?? "Creation impossible");
        return;
      }
      // On success, server action redirects — but guard in case.
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="project_name" className="text-xs font-medium">
          Nom du projet *
        </Label>
        <Input
          id="project_name"
          name="project_name"
          value={projectName}
          onChange={(e) => handleNameChange(e.target.value)}
          required
          autoFocus
          placeholder="Ex: Restaurant Le Colibri"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="slug" className="text-xs font-medium">
          Slug
        </Label>
        <Input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlug(slugify(e.target.value));
            setSlugTouched(true);
          }}
          placeholder="mon-projet"
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground/80">
          Utilisé dans l&apos;URL publique. Créé depuis le nom si vide.
        </p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="client_name" className="text-xs font-medium">
          Client
        </Label>
        <Input
          id="client_name"
          name="client_name"
          placeholder="Nom commercial du client"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="sector_id" className="text-xs font-medium">
          Secteur
        </Label>
        <Select
          value={sectorId}
          onValueChange={(v) => setSectorId(v ?? NONE)}
        >
          <SelectTrigger id="sector_id">
            {sectorId !== NONE ? (
              <SelectValue />
            ) : (
              <span className="text-muted-foreground">— Aucun —</span>
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE}>— Aucun —</SelectItem>
            {sectors.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Création..." : "Créer le brouillon"}
        </Button>
      </div>
    </form>
  );
}
