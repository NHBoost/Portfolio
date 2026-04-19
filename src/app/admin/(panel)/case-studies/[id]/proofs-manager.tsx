"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Trash2, UploadCloud } from "lucide-react";
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
import type { Database } from "@/types/database";
import { addProofAction, deleteProofAction } from "../actions";
import { uploadToStorage } from "@/lib/upload";

type Proof = Database["public"]["Tables"]["case_study_proofs"]["Row"];
type ProofType = Database["public"]["Enums"]["proof_type"];

const PROOF_TYPES: { value: ProofType; label: string }[] = [
  { value: "ads_manager", label: "Ads Manager" },
  { value: "crm", label: "CRM" },
  { value: "lead_form", label: "Formulaire lead" },
  { value: "analytics", label: "Analytics" },
  { value: "testimonial", label: "Temoignage" },
];

export function ProofsManager({
  caseStudyId,
  items,
}: {
  caseStudyId: string;
  items: Proof[];
}) {
  const router = useRouter();
  const [proofType, setProofType] = useState<ProofType>("ads_manager");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [, startTransition] = useTransition();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      if (files[0]) setPendingFile(files[0]);
    },
    accept: { "image/*": [] },
    maxFiles: 1,
    disabled: uploading,
  });

  async function handleAdd() {
    if (!proofType) return;
    setUploading(true);
    try {
      let fileUrl: string | undefined;
      if (pendingFile) {
        const { url } = await uploadToStorage(
          "case-study-images",
          caseStudyId,
          pendingFile,
        );
        fileUrl = url;
      }
      const result = await addProofAction({
        caseStudyId,
        proofType,
        title: title || undefined,
        note: note || undefined,
        fileUrl,
      });
      if (!result.success) {
        toast.error(result.error ?? "Ajout impossible");
        return;
      }
      toast.success("Preuve ajoutee");
      setTitle("");
      setNote("");
      setPendingFile(null);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload impossible");
    } finally {
      setUploading(false);
    }
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteProofAction(id, caseStudyId);
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
      <div className="grid gap-3 rounded-lg border border-dashed p-4 md:grid-cols-2">
        <div>
          <Label className="mb-1 block text-xs">Type de preuve</Label>
          <Select
            value={proofType}
            onValueChange={(v) => v && setProofType(v as ProofType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROOF_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1 block text-xs">Titre</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Capture Ads Manager J+30"
          />
        </div>
        <div className="md:col-span-2">
          <Label className="mb-1 block text-xs">Note</Label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
          />
        </div>
        <div className="md:col-span-2">
          <div
            {...getRootProps()}
            className={
              "flex h-20 cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed text-sm transition-colors " +
              (isDragActive
                ? "border-primary bg-primary/5 text-primary"
                : "border-border bg-muted text-muted-foreground hover:bg-muted/70") +
              (uploading ? " pointer-events-none opacity-60" : "")
            }
          >
            <input {...getInputProps()} />
            <UploadCloud className="h-4 w-4" />
            {pendingFile
              ? `Fichier pret : ${pendingFile.name}`
              : isDragActive
                ? "Depose l'image ici"
                : "Deposer / choisir une image (optionnel)"}
          </div>
        </div>
        <div className="md:col-span-2 flex justify-end">
          <Button
            type="button"
            onClick={handleAdd}
            disabled={uploading}
          >
            {uploading ? "Envoi..." : "Ajouter la preuve"}
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucune preuve pour le moment.
        </p>
      ) : (
        <ul className="divide-y rounded-lg border bg-card">
          {items.map((p) => (
            <li
              key={p.id}
              className="flex items-start justify-between gap-4 p-3"
            >
              <div className="flex gap-3">
                {p.file_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.file_url}
                    alt={p.title ?? ""}
                    className="h-16 w-16 shrink-0 rounded object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 shrink-0 rounded bg-muted" />
                )}
                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    {p.proof_type}
                  </p>
                  <p className="text-sm font-medium">{p.title ?? "—"}</p>
                  {p.note ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {p.note}
                    </p>
                  ) : null}
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => handleDelete(p.id)}
                aria-label="Supprimer la preuve"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
