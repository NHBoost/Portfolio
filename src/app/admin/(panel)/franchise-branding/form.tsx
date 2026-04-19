"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Database } from "@/types/database";
import { updateFranchiseAction } from "./actions";

type Settings = Database["public"]["Tables"]["franchise_settings"]["Row"];

function ColorField({
  id,
  name,
  label,
  defaultValue,
  value,
  onChange,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded-md border border-input bg-transparent p-1"
          aria-label={`${label} (color picker)`}
        />
        <Input
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          defaultValue={defaultValue}
          className="font-mono"
        />
      </div>
    </div>
  );
}

export function FranchiseForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [primary, setPrimary] = useState(settings.primary_color);
  const [secondary, setSecondary] = useState(settings.secondary_color);
  const [accent, setAccent] = useState(settings.accent_color);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("primary_color", primary);
    fd.set("secondary_color", secondary);
    fd.set("accent_color", accent);
    startTransition(async () => {
      const result = await updateFranchiseAction(settings.id, fd);
      if (!result.success) {
        toast.error(result.error ?? "Echec");
        return;
      }
      toast.success("Branding enregistre");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="franchise_name">Nom commercial *</Label>
          <Input
            id="franchise_name"
            name="franchise_name"
            defaultValue={settings.franchise_name}
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="logo_url">Logo URL</Label>
          <Input
            id="logo_url"
            name="logo_url"
            defaultValue={settings.logo_url ?? ""}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <p className="mb-3 text-sm font-medium">Couleurs</p>
        <div className="grid gap-4 md:grid-cols-3">
          <ColorField
            id="primary_color_input"
            name="primary_color"
            label="Primaire"
            defaultValue={settings.primary_color}
            value={primary}
            onChange={setPrimary}
          />
          <ColorField
            id="secondary_color_input"
            name="secondary_color"
            label="Secondaire"
            defaultValue={settings.secondary_color}
            value={secondary}
            onChange={setSecondary}
          />
          <ColorField
            id="accent_color_input"
            name="accent_color"
            label="Accent"
            defaultValue={settings.accent_color}
            value={accent}
            onChange={setAccent}
          />
        </div>
        <div
          className="mt-4 grid grid-cols-3 overflow-hidden rounded-md"
          aria-label="Apercu palette"
        >
          <div
            className="h-10 flex items-center justify-center text-xs text-white font-medium"
            style={{ background: primary }}
          >
            {primary}
          </div>
          <div
            className="h-10 flex items-center justify-center text-xs text-white font-medium"
            style={{ background: secondary }}
          >
            {secondary}
          </div>
          <div
            className="h-10 flex items-center justify-center text-xs text-white font-medium"
            style={{ background: accent }}
          >
            {accent}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={settings.email ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telephone</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={settings.phone ?? ""}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="whatsapp_url">Lien WhatsApp</Label>
          <Input
            id="whatsapp_url"
            name="whatsapp_url"
            placeholder="https://wa.me/..."
            defaultValue={settings.whatsapp_url ?? ""}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Adresse</Label>
          <Textarea
            id="address"
            name="address"
            rows={2}
            defaultValue={settings.address ?? ""}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="cta_text">Texte du CTA principal</Label>
          <Input
            id="cta_text"
            name="cta_text"
            defaultValue={settings.cta_text ?? ""}
            placeholder="Prendre rendez-vous"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
