import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

const title = "Railway vs Render";
const description = "A source-backed comparison of Railway and Render. Research page scaffold — production findings will be added only after evidence review.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/compare/railway-vs-render" },
  openGraph: { type: "article", title, description },
};

export default function RailwayVsRenderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: { "@type": "Organization", name: "Actuals" },
    publisher: { "@type": "Organization", name: "Actuals" },
    mainEntityOfPage: `${siteConfig.url}/compare/railway-vs-render`,
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="shell" style={{ padding: "72px 0 120px" }}>
        <p className="eyebrow">Comparison · Research scaffold</p>
        <h1 style={{ fontSize: "clamp(52px, 8vw, 92px)", lineHeight: .96, letterSpacing: "-.06em", margin: "18px 0 24px" }}>
          Railway <span style={{ color: "var(--muted)" }}>vs</span> Render
        </h1>
        <p style={{ maxWidth: 720, fontSize: 21, lineHeight: 1.55, color: "var(--muted)" }}>
          Which platform fits which workload? This route intentionally contains no fabricated review counts, quotes, scores, or verdicts. Real findings will be published from the evidence corpus.
        </p>
        <section className="rule" style={{ marginTop: 64, paddingTop: 28 }}>
          <p className="eyebrow">Evidence model</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12, marginTop: 20 }}>
            {["Verified facts", "Vendor claims", "User experiences", "Corroborated findings"].map((item) => (
              <div key={item} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", padding: 22 }}>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
