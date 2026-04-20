import { getFranchiseSettings } from "@/lib/public-data";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getFranchiseSettings();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar settings={settings} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} />
    </div>
  );
}
