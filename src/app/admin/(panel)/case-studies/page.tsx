import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { formatCurrency, formatDate, formatRoi } from "@/lib/format";
import { CaseStudyRowActions } from "./row-actions";
import { CaseStudyFilters } from "./filters";

type SearchParams = Promise<{
  status?: string;
  sector?: string;
  q?: string;
}>;

const statusMeta: Record<
  "draft" | "published" | "archived",
  { label: string; dot: string; text: string }
> = {
  published: {
    label: "Publiée",
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  draft: {
    label: "Brouillon",
    dot: "bg-amber-400",
    text: "text-amber-700 dark:text-amber-300",
  },
  archived: {
    label: "Archivée",
    dot: "bg-muted-foreground/40",
    text: "text-muted-foreground",
  },
};

export default async function CaseStudiesListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status, sector, q } = await searchParams;
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("case_studies")
    .select(
      "id, project_name, slug, client_name, status, ad_budget, revenue_generated, roi, created_at, sector:sectors(id, name, slug)",
    )
    .order("created_at", { ascending: false });

  if (status && ["draft", "published", "archived"].includes(status)) {
    query = query.eq("status", status as "draft" | "published" | "archived");
  }
  if (sector) {
    query = query.eq("sector_id", sector);
  }
  if (q) {
    query = query.ilike("project_name", `%${q}%`);
  }

  const [{ data: rows, error }, { data: sectors }] = await Promise.all([
    query,
    supabase.from("sectors").select("id, name").order("name"),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6 md:p-10">
      <PageHeader
        eyebrow="Bibliothèque"
        title="Études de cas"
        description="Créez, modifiez et publiez les études qui alimentent le site public. Chaque entrée reflète une transformation business mesurable."
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

      <CaseStudyFilters
        sectors={sectors ?? []}
        initial={{ status, sector, q }}
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-b-border hover:bg-transparent">
              <TableHead className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Projet
              </TableHead>
              <TableHead className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Client
              </TableHead>
              <TableHead className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Secteur
              </TableHead>
              <TableHead className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Statut
              </TableHead>
              <TableHead className="text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Budget
              </TableHead>
              <TableHead className="text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                CA généré
              </TableHead>
              <TableHead className="text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                ROI
              </TableHead>
              <TableHead className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Créée
              </TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={9} className="text-destructive">
                  {error.message}
                </TableCell>
              </TableRow>
            ) : (rows ?? []).length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={9} className="py-16 text-center">
                  <p className="font-display text-lg font-semibold text-foreground">
                    Rien à afficher pour l&apos;instant
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Ajuste les filtres ou crée une nouvelle étude.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              (rows ?? []).map((row) => {
                const meta = statusMeta[row.status];
                return (
                  <TableRow
                    key={row.id}
                    className="group border-b-border/60 transition-colors hover:bg-surface-muted"
                  >
                    <TableCell className="py-4">
                      <Link
                        href={`/admin/case-studies/${row.id}`}
                        className="font-medium text-foreground transition-colors hover:text-brand-deep"
                      >
                        {row.project_name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.client_name ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.sector?.name ?? "—"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium ${meta.text}`}
                      >
                        <span
                          aria-hidden
                          className={`h-1.5 w-1.5 rounded-full ${meta.dot}`}
                        />
                        {meta.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {formatCurrency(row.ad_budget)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(row.revenue_generated)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-display text-base font-semibold tabular-nums text-brand-deep">
                        {formatRoi(row.roi)}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(row.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                        <CaseStudyRowActions
                          id={row.id}
                          status={row.status}
                        />
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
