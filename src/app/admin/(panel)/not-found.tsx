import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-start gap-4 px-6 py-16 md:px-10 md:py-24">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-deep">
        404 · Admin
      </p>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        Cette ressource n&apos;existe plus.
      </h1>
      <p className="max-w-xl text-sm text-muted-foreground">
        L&apos;élément recherché a peut-être été supprimé ou archivé. Reviens au
        dashboard pour reprendre le pilotage.
      </p>
      <Link
        href="/admin"
        className={buttonVariants({ variant: "default", size: "sm" })}
      >
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
        Retour au dashboard
      </Link>
    </div>
  );
}
