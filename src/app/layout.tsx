import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: "Actuals", template: "%s — Actuals" },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Actuals",
    title: "Actuals",
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header style={{ borderBottom: "1px solid var(--line)", background: "var(--paper)" }}>
          <div className="shell" style={{ minHeight: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
            <Link href="/" style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.04em" }}>actuals.</Link>
            <nav aria-label="Primary" style={{ display: "flex", gap: 24, fontSize: 14 }}>
              <Link href="/compare">Compare</Link>
              <Link href="/reviews">Reviews</Link>
              <Link href="/open-source">Open source</Link>
              <Link href="/methodology">Methodology</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
