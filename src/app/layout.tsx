import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: "Actuals", template: "%s — Actuals" },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "Actuals", title: "Actuals", description: siteConfig.description },
};

export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){
 return <html lang="en"><body>
  <header className="site-header"><div className="shell site-header-inner">
    <Link href="/" className="site-brand">actuals.</Link>
    <nav aria-label="Primary"><Link href="/search">Search</Link><Link href="/guides">Guides</Link><Link href="/methodology">Methodology</Link><Link href="/about">About</Link></nav>
  </div></header>
  {children}
  <footer className="site-footer"><div className="shell"><Link href="/" className="site-brand">actuals.</Link><p>Independent technology research backed by traceable sources.</p><nav><Link href="/methodology">Methodology</Link><Link href="/about">About</Link><Link href="/search">Search</Link></nav></div></footer>
 </body></html>;
}
