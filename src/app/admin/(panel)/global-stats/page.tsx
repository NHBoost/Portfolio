import { createSupabaseServerClient } from "@/lib/supabase/server";
import { GlobalStatsForm } from "./form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function GlobalStatsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("global_stats")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (!data) {
    return (
      <div className="p-6 md:p-8">
        <p className="text-sm text-destructive">
          Aucune ligne global_stats. Relance le seed Supabase.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-accent">
          Stats globales
        </h1>
        <p className="text-sm text-muted-foreground">
          Chiffres affiches sur la bandeau &laquo;&nbsp;Resultats
          globaux&nbsp;&raquo; du site public.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Ces chiffres sont pousses en header / hero du site public
          </CardTitle>
          <CardDescription>
            Ils servent a creer un effet de masse. Mets-les a jour quand tu
            publies de nouvelles etudes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GlobalStatsForm stats={data} />
        </CardContent>
      </Card>
    </div>
  );
}
