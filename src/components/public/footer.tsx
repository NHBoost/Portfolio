import Link from "next/link";
import type { FranchiseSettings } from "@/lib/public-data";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

export function Footer({ settings }: { settings: FranchiseSettings | null }) {
  const brand = settings?.franchise_name ?? "Portfolio ROI";
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:gap-20 md:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground shadow-sm ring-1 ring-black/5">
              <span className="font-display text-[15px] font-black leading-none tracking-tight">
                {brand.charAt(0).toUpperCase()}
              </span>
            </span>
            <span className="font-display text-base font-semibold tracking-tight text-foreground">
              {brand}
            </span>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Un portfolio tourné vers la seule question qui compte : combien
            chaque euro investi rapporte à nos clients.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Explorer
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/#etudes"
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                Études de cas
              </Link>
            </li>
            <li>
              <Link
                href="/#resultats"
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                Résultats globaux
              </Link>
            </li>
            <li>
              <Link
                href="/#services"
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                Services
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Nous contacter
          </p>
          <ul className="space-y-2 text-sm">
            {settings?.email ? (
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex items-center gap-2 text-foreground/80 transition-colors hover:text-foreground"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {settings.email}
                </a>
              </li>
            ) : null}
            {settings?.phone ? (
              <li>
                <a
                  href={`tel:${settings.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 text-foreground/80 transition-colors hover:text-foreground"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {settings.phone}
                </a>
              </li>
            ) : null}
            {settings?.whatsapp_url ? (
              <li>
                <a
                  href={settings.whatsapp_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-foreground/80 transition-colors hover:text-foreground"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              </li>
            ) : null}
            {settings?.address ? (
              <li className="inline-flex items-start gap-2 text-muted-foreground">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-pre-line">{settings.address}</span>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 text-[11px] text-muted-foreground md:px-8">
          <span>
            © {year} {brand}. Tous droits réservés.
          </span>
          <span className="tracking-wide">ROI &gt; tout le reste.</span>
        </div>
      </div>
    </footer>
  );
}
