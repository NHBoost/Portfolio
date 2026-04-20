import Link from "next/link";
import { signOutAction } from "@/app/admin/login/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Plus, Search } from "lucide-react";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

function initials(profile: Profile) {
  const source = profile.full_name || profile.email || "?";
  return source
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function roleLabel(role: Profile["role"]): string {
  switch (role) {
    case "super_admin":
      return "Super admin";
    case "admin":
      return "Admin";
    case "editor":
      return "Éditeur";
    default:
      return role;
  }
}

export function AdminHeader({ profile }: { profile: Profile }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur">
      <div className="relative hidden max-w-xs flex-1 md:block">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          placeholder="Rechercher"
          className="h-9 w-full rounded-lg border border-border bg-surface-muted pl-9 pr-14 text-sm placeholder:text-muted-foreground/70 focus:border-ring focus:bg-card focus:outline-none focus:ring-2 focus:ring-ring/40"
          aria-label="Recherche globale"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <div className="flex-1 md:hidden" />

      <div className="flex items-center gap-2">
        <Link
          href="/admin/case-studies/new"
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Nouvelle étude
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex h-9 items-center gap-2 rounded-full border border-border bg-card pl-1 pr-3 text-left text-sm transition-colors hover:bg-surface-muted"
                aria-label="Profil utilisateur"
              />
            }
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-accent-foreground">
              {initials(profile)}
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-xs font-medium">
                {profile.full_name ?? profile.email}
              </span>
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {roleLabel(profile.role)}
              </span>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              {profile.email}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={
                <Link href="/admin/franchise-branding">
                  <span>Paramètres franchise</span>
                </Link>
              }
            />
            <DropdownMenuSeparator />
            <form action={signOutAction}>
              <DropdownMenuItem
                render={
                  <button
                    type="submit"
                    className="w-full"
                  />
                }
                variant="destructive"
              >
                <LogOut className="h-3.5 w-3.5" />
                Déconnexion
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* fallback button (server form) is rendered by the dropdown item */}
        {profile ? null : <Button type="submit">—</Button>}
      </div>
    </header>
  );
}
