import Link from "next/link";
import { redirect } from "next/navigation";
import { requireStudioActor } from "@/lib/studio-session";

const navigation = [
  ["Overview", "/studio"],
  ["Research", "/studio/research"],
  ["Evidence", "/studio/evidence"],
  ["Products", "/studio/products"],
  ["Articles", "/studio/articles"],
  ["Sources", "/studio/sources"],
  ["Changes", "/studio/changes"],
  ["SEO", "/studio/seo"],
  ["Publishing", "/studio/publishing"],
] as const;

export default async function StudioLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let actor;
  try {
    actor = await requireStudioActor();
  } catch {
    redirect("/studio/sign-in");
  }

  return (
    <div className="studio-shell">
      <aside className="studio-sidebar">
        <div><Link className="studio-brand" href="/studio">Actuals <span>Studio</span></Link><p>{actor.email}</p></div>
        <nav>{navigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav>
        <small>{actor.role}</small>
      </aside>
      <main className="studio-main">{children}</main>
    </div>
  );
}
