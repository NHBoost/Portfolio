import { signOutAction } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function AdminHeader({ profile }: { profile: Profile }) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-6">
      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          {profile.role.replace("_", " ")}
        </span>
        <span className="text-sm font-medium">
          {profile.full_name ?? profile.email}
        </span>
      </div>
      <form action={signOutAction}>
        <Button type="submit" variant="ghost" size="sm">
          <LogOut className="mr-2 h-4 w-4" />
          Deconnexion
        </Button>
      </form>
    </header>
  );
}
