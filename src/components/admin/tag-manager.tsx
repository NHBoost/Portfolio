"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type TagItem = {
  id: string;
  name: string;
  slug: string;
};

type ActionResult = { success: true } | { success: false; error: string };

type Props = {
  items: TagItem[];
  onCreate: (name: string) => Promise<ActionResult>;
  onUpdate: (id: string, name: string) => Promise<ActionResult>;
  onDelete: (id: string) => Promise<ActionResult>;
  entityLabel: string;
};

export function TagManager({
  items,
  onCreate,
  onUpdate,
  onDelete,
  entityLabel,
}: Props) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isPending, startTransition] = useTransition();

  function run(fn: () => Promise<ActionResult>, onSuccess?: () => void) {
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

  function submitCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newName.trim()) return;
    run(
      () => onCreate(newName),
      () => {
        setNewName("");
        toast.success("Ajoute");
      },
    );
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={submitCreate}
        className="flex items-end gap-3 rounded-lg border bg-card p-4"
      >
        <div className="flex-1 space-y-1">
          <Label htmlFor="new-name">Nouveau {entityLabel}</Label>
          <Input
            id="new-name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={`Nom du ${entityLabel}`}
          />
        </div>
        <Button type="submit" disabled={isPending}>
          Ajouter
        </Button>
      </form>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="w-32 text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-8 text-center text-muted-foreground"
                >
                  Aucun element pour le moment.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const isEditing = editingId === item.id;
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {isEditing ? (
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              run(
                                () => onUpdate(item.id, editValue),
                                () => {
                                  setEditingId(null);
                                  toast.success("Modifie");
                                },
                              );
                            } else if (e.key === "Escape") {
                              setEditingId(null);
                            }
                          }}
                        />
                      ) : (
                        item.name
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {item.slug}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {isEditing ? (
                          <>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              disabled={isPending}
                              onClick={() =>
                                run(
                                  () => onUpdate(item.id, editValue),
                                  () => {
                                    setEditingId(null);
                                    toast.success("Modifie");
                                  },
                                )
                              }
                              aria-label="Enregistrer"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setEditingId(null)}
                              aria-label="Annuler"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => {
                                setEditingId(item.id);
                                setEditValue(item.name);
                              }}
                              aria-label="Renommer"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              disabled={isPending}
                              onClick={() => {
                                if (
                                  !confirm(
                                    `Supprimer ${entityLabel} "${item.name}" ?`,
                                  )
                                )
                                  return;
                                run(() => onDelete(item.id), () =>
                                  toast.success("Supprime"),
                                );
                              }}
                              aria-label="Supprimer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
