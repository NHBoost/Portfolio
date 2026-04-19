import { requireStaff } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { Toaster } from "@/components/ui/sonner";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireStaff();

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminHeader profile={profile} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
