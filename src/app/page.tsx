import Link from "next/link";

export default function HomePage() {
  return (
    <main className="shell" style={{ padding: "88px 0 120px" }}>
      <p className="eyebrow">Independent technology research</p>
      <h1 style={{ maxWidth: 860, fontSize: "clamp(48px, 8vw, 96px)", lineHeight: .94, letterSpacing: "-.065em", margin: "20px 0 28px" }}>
        What software is actually like to use.
      </h1>
      <p style={{ maxWidth: 680, fontSize: 20, lineHeight: 1.55, color: "var(--muted)" }}>
        Actuals researches official facts, product claims, and traceable user experiences so technology decisions are not based on marketing pages alone.
      </p>
      <div className="rule" style={{ marginTop: 72, paddingTop: 28 }}>
        <p className="eyebrow">First research track</p>
        <Link href="/compare/railway-vs-render" style={{ display: "inline-block", marginTop: 14, fontSize: 30, fontWeight: 700, letterSpacing: "-.035em" }}>
          Railway vs Render →
        </Link>
      </div>
    </main>
  );
}
