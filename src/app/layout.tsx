import type { Metadata } from "next";
import { Inter, Archivo } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800", "900"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: "Portfolio ROI — Études de cas orientées résultats",
    template: "%s · Portfolio ROI",
  },
  description:
    "Bibliothèque d'études de cas business mesurées. Stratégie, exécution, chiffres réellement encaissés. Pour savoir ce que votre marketing peut vraiment vous rapporter.",
  applicationName: "Portfolio ROI",
  keywords: [
    "études de cas",
    "ROI",
    "Meta Ads",
    "tunnel de conversion",
    "marketing de performance",
    "UGC",
    "acquisition clients",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Portfolio ROI",
    title: "Portfolio ROI — Études de cas orientées résultats",
    description:
      "Bibliothèque d'études de cas mesurées : stratégie, exécution, ROI encaissé.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio ROI — Études de cas orientées résultats",
    description:
      "Bibliothèque d'études de cas mesurées : stratégie, exécution, ROI encaissé.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Aller au contenu principal
        </a>
        {children}
      </body>
    </html>
  );
}
