import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export default function NotFoundPublic() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 mesh-grid [mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.9),transparent_70%)]"
      />
      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-start gap-6 px-4 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-deep">
          Erreur 404
        </p>
        <h1 className="font-display text-[clamp(40px,6vw,72px)] font-semibold leading-[1] tracking-[-0.02em] text-foreground text-balance">
          Cette page ne rapporte rien.
        </h1>
        <p className="max-w-xl text-pretty text-base text-muted-foreground">
          L&apos;URL demandée n&apos;existe pas ou l&apos;étude a été archivée.
          On vous renvoie vers le contenu qui a encore de la valeur.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/etudes-de-cas"
            className={buttonVariants({ variant: "default", size: "lg" })}
          >
            Voir les études
            <ArrowUpRight className="ml-1.5 h-4 w-4" />
          </Link>
          <Link
            href="/"
            className={buttonVariants({ variant: "ghost", size: "lg" })}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </section>
  );
}
