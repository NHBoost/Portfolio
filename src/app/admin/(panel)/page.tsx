import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/page-header";
import { KpiCard } from "@/components/admin/kpi-card";
import { ArrowUpRight, Plus, Sparkles } from "lucide-react";
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatRoi,
} from "@/lib/format";

type Row = {
  id: string;
  project_name: string;
  status: "draft" | "published" | "archived";
  client_name: string | null;
  roi: number | null;
  revenue_generated: number | null;
  leads_count: number | null;
  created_at: string;
  sector: { name: string } | null;
};

const statusMeta: Record<Row["status"], { label: string; dot: string }> = {
  published: {
    label: "Publiée",
    dot: "bg-emerald-500",
  },
  draft: {
    label: "Brouillon",
    dot: "bg-amber-400",
  },
  archived: {
    label: "Archivée",
    dot: "bg-muted-foreground/40",
  },
};

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const [
    allCountResult,
    publishedCountResult,
    draftCountResult,
    aggregatesResult,
    sectorsCountResult,
    recentResult,
    globalStatsResult,
  ] = await Promise.all([
    supabase.from("case_studies").select("id", { count: "exact", head: true }),
    supabase
      .from("case_studies")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("case_studies")
      .select("id", { count: "exact", head: true })
      .eq("status", "draft"),
    supabase
      .from("case_studies")
      .select("leads_count, revenue_generated, roi, ad_budget")
      .eq("status", "published"),
    supabase.from("sectors").select("id", { count: "exact", head: true }),
    supabase
      .from("case_studies")
      .select(
        "id, project_name, client_name, status, roi, revenue_generated, leads_count, created_at, sector:sectors(name)",
      )
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("global_stats")
      .select("total_revenue, total_leads, average_roas")
      .limit(1)
      .maybeSingle(),
  ]);

  const aggregates = aggregatesResult.data ?? [];
  const totalLeads = aggregates.reduce(
    (sum, r) => sum + (r.leads_count ?? 0),
    0,
  );
  const totalRevenue = aggregates.reduce(
    (sum, r) => sum + Number(r.revenue_generated ?? 0),
    0,
  );
  const totalBudget = aggregates.reduce(
    (sum, r) => sum + Number(r.ad_budget ?? 0),
    0,
  );
  const roiValues = aggregates
    .map((r) => Number(r.roi ?? 0))
    .filter((v) => v > 0);
  const avgRoi =
    roiValues.length > 0
      ? roiValues.reduce((s, v) => s + v, 0) / roiValues.length
      : 0;
  const aggregateRoi = totalBudget > 0 ? totalRevenue / totalBudget : 0;

  const recent = (recentResult.data ?? []) as Row[];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-6 md:p-10">
      <PageHeader
        eyebrow="Tableau de bord"
        title="Vue d'ensemble du portfolio"
        description="Suivi agrégé des études publiées, du chiffre d'affaires généré et du retour sur investissement moyen."
        actions={
          <Link
            href="/admin/case-studies/new"
            className={buttonVariants({ variant: "default" })}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Nouvelle étude
          </Link>
        }
      />

      {/* HERO — ROI primary metric */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.35] mix-blend-multiply mesh-grid"
        />
        <div className="relative grid gap-10 p-8 md:grid-cols-[1.4fr_1fr] md:gap-0 md:p-12">
          <div className="flex flex-col justify-between gap-6">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-brand-deep">
              <Sparkles className="h-3.5 w-3.5" />
              Performance cumulée · études publiées
            </div>

            <div>
              <p className="font-display text-[15px] text-muted-foreground">
                ROI consolidé
              </p>
              <p className="mt-2 flex items-baseline gap-2 font-display font-black leading-[0.85] tracking-tight text-accent">
                <span className="text-5xl md:text-6xl">×</span>
                <span className="text-[128px] md:text-[160px] tabular-nums">
                  {aggregateRoi > 0 ? aggregateRoi.toFixed(1) : "—"}
                </span>
              </p>
              <p className="mt-4 max-w-md text-sm text-muted-foreground">
                Calculé à partir du CA généré et du budget ads sur l&apos;ensemble
                des études publiées. ROI individuel moyen : {formatRoi(avgRoi)}.
              </p>
            </div>
          </div>

          <div className="relative flex flex-col justify-end gap-4 border-t border-border/60 pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                CA généré cumulé
              </p>
              <p className="mt-1.5 font-display text-3xl font-semibold tabular-nums tracking-tight text-foreground">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Budget ads investi
              </p>
              <p className="mt-1.5 font-display text-3xl font-semibold tabular-nums tracking-tight text-foreground">
                {formatCurrency(totalBudget)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Leads générés
              </p>
              <p className="mt-1.5 font-display text-3xl font-semibold tabular-nums tracking-tight text-foreground">
                {formatNumber(totalLeads)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* KPI grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Études publiées"
          value={formatNumber(publishedCountResult.count)}
          caption={`${formatNumber(draftCountResult.count)} brouillon(s) en cours`}
          index={0}
        />
        <KpiCard
          label="Secteurs couverts"
          value={formatNumber(sectorsCountResult.count)}
          caption="Catégories d'activité taguées"
          index={1}
        />
        <KpiCard
          label="ROAS moyen (public)"
          value={
            globalStatsResult.data
              ? formatNumber(globalStatsResult.data.average_roas)
              : "—"
          }
          caption="Valeur affichée côté site public"
          accent="brand"
          index={2}
        />
        <KpiCard
          label="Études au total"
          value={formatNumber(allCountResult.count)}
          caption="Brouillons + publiées + archivées"
          index={3}
        />
      </section>

      {/* Recent case studies */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-base font-semibold tracking-tight">
              Études récentes
            </h2>
            <p className="text-xs text-muted-foreground">
              Les 6 dernières modifiées
            </p>
          </div>
          <Link
            href="/admin/case-studies"
            className="group flex items-center gap-1 text-xs font-medium text-brand-deep transition-colors hover:text-accent"
          >
            Tout voir
            <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="font-display text-lg font-semibold text-foreground">
              Aucune étude pour le moment
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Crée ta première étude de cas pour alimenter le tableau de bord.
            </p>
            <Link
              href="/admin/case-studies/new"
              className={`${buttonVariants({ variant: "default" })} mt-5`}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Créer une étude
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((row) => {
              const meta = statusMeta[row.status];
              return (
                <li key={row.id}>
                  <Link
                    href={`/admin/case-studies/${row.id}`}
                    className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-muted"
                  >
                    <span
                      aria-hidden
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${meta.dot}`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">
                        {row.project_name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {row.client_name ?? "Client inconnu"}
                        {row.sector ? ` · ${row.sector.name}` : ""}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="hidden border-transparent bg-transparent text-xs font-medium text-muted-foreground sm:inline-flex"
                    >
                      {meta.label}
                    </Badge>
                    <div className="hidden w-24 text-right text-xs text-muted-foreground md:block">
                      <p className="tabular-nums text-foreground">
                        {formatCurrency(row.revenue_generated)}
                      </p>
                      <p>CA</p>
                    </div>
                    <div className="w-16 text-right">
                      <p className="font-display text-base font-semibold tabular-nums text-brand-deep">
                        {formatRoi(row.roi)}
                      </p>
                    </div>
                    <span className="hidden w-20 text-right text-xs text-muted-foreground lg:block">
                      {formatDate(row.created_at)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
