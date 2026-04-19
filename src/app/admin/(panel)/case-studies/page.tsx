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
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { formatCurrency, formatDate, formatRoi } from "@/lib/format";
import { CaseStudyRowActions } from "./row-actions";
import { CaseStudyFilters } from "./filters";

type SearchParams = Promise<{
  status?: string;
  sector?: string;
  q?: string;
}>;

const statusLabel: Record<string, string> = {
  draft: "Brouillon",
  published: "Publiee",
  archived: "Archivee",
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
    <div className="space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-accent">
            Etudes de cas
          </h1>
          <p className="text-sm text-muted-foreground">
            Cree, modifie et publie les etudes de cas du portfolio.
          </p>
        </div>
        <Link
          href="/admin/case-studies/new"
          className={buttonVariants({ variant: "default" })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle etude
        </Link>
      </div>

      <CaseStudyFilters
        sectors={sectors ?? []}
        initial={{ status, sector, q }}
      />

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Projet</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Secteur</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Budget</TableHead>
              <TableHead className="text-right">CA</TableHead>
              <TableHead className="text-right">ROI</TableHead>
              <TableHead>Cree</TableHead>
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
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="py-10 text-center text-muted-foreground"
                >
                  Aucune etude de cas pour le moment.
                </TableCell>
              </TableRow>
            ) : (
              (rows ?? []).map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/admin/case-studies/${row.id}`}
                      className="hover:text-primary hover:underline"
                    >
                      {row.project_name}
                    </Link>
                  </TableCell>
                  <TableCell>{row.client_name ?? "—"}</TableCell>
                  <TableCell>{row.sector?.name ?? "—"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        row.status === "published" ? "default" : "secondary"
                      }
                    >
                      {statusLabel[row.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(row.ad_budget)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(row.revenue_generated)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {formatRoi(row.roi)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(row.created_at)}
                  </TableCell>
                  <TableCell>
                    <CaseStudyRowActions
                      id={row.id}
                      status={row.status}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
