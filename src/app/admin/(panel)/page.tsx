import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";

function formatNumber(n: number | null | undefined) {
  return new Intl.NumberFormat("fr-FR").format(n ?? 0);
}

function formatCurrency(n: number | null | undefined) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n ?? 0);
}

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const [allCount, publishedCount, draftCount, aggregates, sectorsCount] =
    await Promise.all([
      supabase
        .from("case_studies")
        .select("id", { count: "exact", head: true }),
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
        .select("leads_count, revenue_generated, roi")
        .eq("status", "published"),
      supabase.from("sectors").select("id", { count: "exact", head: true }),
    ]);

  const rows = aggregates.data ?? [];
  const totalLeads = rows.reduce((sum, r) => sum + (r.leads_count ?? 0), 0);
  const totalRevenue = rows.reduce(
    (sum, r) => sum + Number(r.revenue_generated ?? 0),
    0,
  );
  const roiValues = rows
    .map((r) => Number(r.roi ?? 0))
    .filter((v) => v > 0);
  const avgRoi =
    roiValues.length > 0
      ? roiValues.reduce((s, v) => s + v, 0) / roiValues.length
      : 0;

  const stats = [
    { label: "Etudes publiees", value: formatNumber(publishedCount.count) },
    { label: "Etudes brouillons", value: formatNumber(draftCount.count) },
    { label: "Leads affiches", value: formatNumber(totalLeads) },
    { label: "CA cumule", value: formatCurrency(totalRevenue) },
    { label: "ROI moyen", value: `x${avgRoi.toFixed(1)}` },
    { label: "Secteurs", value: formatNumber(sectorsCount.count) },
  ];

  return (
    <div className="space-y-8 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-accent">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Vue d&apos;ensemble du contenu publie et des resultats agreges.
          </p>
        </div>
        <Link
          href="/admin/case-studies/new"
          className={buttonVariants({ variant: "default" })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle etude de cas
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-accent">
                {s.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Total des etudes : {formatNumber(allCount.count)}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Commence par creer ta premiere etude de cas ou ouvre la liste pour
          voir l&apos;existant.
          <div className="mt-4 flex gap-2">
            <Link
              href="/admin/case-studies"
              className={buttonVariants({ variant: "outline" })}
            >
              Voir la liste
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
