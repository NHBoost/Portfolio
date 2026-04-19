import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NewCaseStudyForm } from "./form";

export default async function NewCaseStudyPage() {
  const supabase = await createSupabaseServerClient();
  const { data: sectors } = await supabase
    .from("sectors")
    .select("id, name")
    .order("name");

  return (
    <div className="max-w-2xl space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-accent">
            Nouvelle etude de cas
          </h1>
          <p className="text-sm text-muted-foreground">
            Cree un brouillon : tu completeras les details ensuite.
          </p>
        </div>
        <Link
          href="/admin/case-studies"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Annuler
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informations de base</CardTitle>
          <CardDescription>
            Donne un nom. Tu pourras ajouter la strategie, les resultats et les
            medias sur la page d&apos;edition.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewCaseStudyForm sectors={sectors ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
