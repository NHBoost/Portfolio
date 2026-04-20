import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/page-header";
import { GlobalStatsForm } from "./form";
import {
  ReconciliationCard,
  type ReconciliationCardProps,
} from "./reconciliation-card";
import {
  ContributionChart,
  type ContributionRow,
} from "./contribution-chart";
import { buttonVariants } from "@/components/ui/button";
import {
  Briefcase,
  Euro,
  Eye,
  MousePointerClick,
  Percent,
  UserCheck,
} from "lucide-react";
import Link from "next/link";

type AggregateResult = {
  totalLeads: number;
  totalClients: number;
  totalRevenue: number;
  averageRoas: number | null;
  publishedCount: number;
};

export default async function GlobalStatsPage() {
  const supabase = await createSupabaseServerClient();

  const [{ data: statsRow }, { data: published }] = await Promise.all([
    supabase.from("global_stats").select("*").limit(1).maybeSingle(),
    supabase
      .from("case_studies")
      .select(
        "id, slug, project_name, client_name, leads_count, clients_count, revenue_generated, roas, roi, sector:sectors(name)",
      )
      .eq("status", "published"),
  ]);

  if (!statsRow) {
    return (
      <div className="p-6 md:p-10">
        <p className="text-sm text-destructive">
          Aucune ligne global_stats. Relance le seed Supabase.
        </p>
      </div>
    );
  }

  const rows = published ?? [];
  const roasValues = rows
    .map((r) => Number(r.roas ?? 0))
    .filter((v) => v > 0);

  const aggregates: AggregateResult = {
    totalLeads: rows.reduce((s, r) => s + Number(r.leads_count ?? 0), 0),
    totalClients: rows.reduce((s, r) => s + Number(r.clients_count ?? 0), 0),
    totalRevenue: rows.reduce(
      (s, r) => s + Number(r.revenue_generated ?? 0),
      0,
    ),
    averageRoas:
      roasValues.length > 0
        ? roasValues.reduce((s, v) => s + v, 0) / roasValues.length
        : null,
    publishedCount: rows.length,
  };

  const contributionRows: ContributionRow[] = rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    project_name: r.project_name,
    client_name: r.client_name,
    sector: r.sector?.name ?? null,
    leads: r.leads_count,
    clients: r.clients_count,
    revenue: r.revenue_generated ? Number(r.revenue_generated) : null,
    roi: r.roi ? Number(r.roi) : null,
  }));

  const iconClass = "h-3.5 w-3.5";
  const cards: (Omit<ReconciliationCardProps, "index"> & { key: string })[] = [
    {
      key: "views",
      label: "Vues générées",
      manual: Number(statsRow.total_views ?? 0),
      computed: null,
      format: "number",
      icon: <Eye className={iconClass} />,
      helper: "Pas de source automatique — à saisir manuellement.",
    },
    {
      key: "leads",
      label: "Leads qualifiés",
      manual: Number(statsRow.total_leads ?? 0),
      computed: aggregates.totalLeads,
      format: "number",
      icon: <MousePointerClick className={iconClass} />,
      accent: "brand",
    },
    {
      key: "clients",
      label: "Clients générés",
      manual: Number(statsRow.total_clients ?? 0),
      computed: aggregates.totalClients,
      format: "number",
      icon: <UserCheck className={iconClass} />,
      accent: "brand",
    },
    {
      key: "roas",
      label: "ROAS moyen",
      manual: Number(statsRow.average_roas ?? 0),
      computed: aggregates.averageRoas,
      format: "roas",
      icon: <Percent className={iconClass} />,
      accent: "brand",
    },
    {
      key: "revenue",
      label: "CA généré",
      manual: Number(statsRow.total_revenue ?? 0),
      computed: aggregates.totalRevenue,
      format: "currency",
      icon: <Euro className={iconClass} />,
      accent: "brand",
    },
  ];

  const computed = {
    total_views: null,
    total_leads: aggregates.totalLeads,
    total_clients: aggregates.totalClients,
    average_roas: aggregates.averageRoas,
    total_revenue: aggregates.totalRevenue,
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 p-6 md:p-10">
      <PageHeader
        eyebrow="Paramètres"
        title="Stats globales"
        description="Les cinq chiffres diffusés sur le bandeau public. Comparaison avec les agrégats calculés sur les études publiées pour rester honnête côté vitrine."
        actions={
          <Link
            href="/admin/case-studies"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Briefcase className="mr-1.5 h-3.5 w-3.5" />
            Voir les études
          </Link>
        }
      />

      <section aria-labelledby="stats-overview-title" className="space-y-4">
        <header className="flex items-end justify-between gap-4">
          <div>
            <h2
              id="stats-overview-title"
              className="font-display text-base font-semibold tracking-tight text-foreground"
            >
              Vue d&apos;ensemble
            </h2>
            <p className="text-[13px] text-muted-foreground">
              {aggregates.publishedCount} étude
              {aggregates.publishedCount > 1 ? "s" : ""} publiée
              {aggregates.publishedCount > 1 ? "s" : ""} · écarts
              mis en évidence.
            </p>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {cards.map((c, i) => (
            <ReconciliationCard
              key={c.key}
              index={i}
              label={c.label}
              manual={c.manual}
              computed={c.computed}
              format={c.format}
              icon={c.icon}
              accent={c.accent}
              helper={c.helper}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="contribution-title" className="space-y-4">
        <header>
          <h2
            id="contribution-title"
            className="font-display text-base font-semibold tracking-tight text-foreground"
          >
            Contribution par étude
          </h2>
          <p className="text-[13px] text-muted-foreground">
            Qui tire les chiffres cumulés vers le haut.
          </p>
        </header>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs md:p-6">
          <ContributionChart rows={contributionRows} />
        </div>
      </section>

      <section aria-labelledby="edit-title" className="space-y-4">
        <header>
          <h2
            id="edit-title"
            className="font-display text-base font-semibold tracking-tight text-foreground"
          >
            Mise à jour des valeurs publiques
          </h2>
          <p className="text-[13px] text-muted-foreground">
            Chaque champ expose la valeur calculée et permet de l&apos;appliquer
            en un clic.
          </p>
        </header>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs md:p-8">
          <GlobalStatsForm stats={statsRow} computed={computed} />
        </div>
      </section>
    </div>
  );
}
