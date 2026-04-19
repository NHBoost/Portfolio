import { createSupabaseServerClient } from "@/lib/supabase/server";
import { FranchiseForm } from "./form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function FranchiseBrandingPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("franchise_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (!data) {
    return (
      <div className="p-6 md:p-8">
        <p className="text-sm text-destructive">
          Aucune ligne franchise_settings. Relance le seed Supabase.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-accent">
          Branding franchise
        </h1>
        <p className="text-sm text-muted-foreground">
          Identite du site (logo, couleurs, coordonnees). Permet de dupliquer
          le portfolio pour une nouvelle franchise en quelques minutes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Parametres</CardTitle>
          <CardDescription>
            Reserve au role admin. Les couleurs reprennent les variables CSS
            du site public.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FranchiseForm settings={data} />
        </CardContent>
      </Card>
    </div>
  );
}
