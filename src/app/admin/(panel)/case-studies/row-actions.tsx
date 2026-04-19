"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  archiveCaseStudyAction,
  deleteCaseStudyAction,
  duplicateCaseStudyAction,
  togglePublishAction,
} from "./actions";

type Status = "draft" | "published" | "archived";

export function CaseStudyRowActions({
  id,
  status,
}: {
  id: string;
  status: Status;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handle(fn: () => Promise<{ success: boolean; error?: string }>) {
    startTransition(async () => {
      const result = await fn();
      if (!result.success) {
        toast.error(result.error ?? "Action impossible");
      } else {
        toast.success("OK");
        router.refresh();
      }
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" disabled={isPending} />}
      >
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          render={
            <Link href={`/admin/case-studies/${id}`}>
              <span>Modifier</span>
            </Link>
          }
        />
        {status === "published" ? (
          <DropdownMenuItem
            onClick={() => handle(() => togglePublishAction(id, false))}
          >
            Depublier
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => handle(() => togglePublishAction(id, true))}
          >
            Publier
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => handle(() => duplicateCaseStudyAction(id))}
        >
          Dupliquer
        </DropdownMenuItem>
        {status !== "archived" ? (
          <DropdownMenuItem
            onClick={() => handle(() => archiveCaseStudyAction(id))}
          >
            Archiver
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => {
            if (
              !confirm(
                "Supprimer definitivement cette etude de cas ? (reserve admin)",
              )
            ) {
              return;
            }
            handle(() => deleteCaseStudyAction(id));
          }}
        >
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
