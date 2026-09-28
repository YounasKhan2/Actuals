import Link from "next/link";
import { redirect } from "next/navigation";
import { requireStudioActor } from "@/lib/studio-session";
import { StudioSignOut } from "@/components/studio/sign-out";

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
    redirect("/studio-login");
  }

  return (
    <div className="studio-shell">
      <aside className="studio-sidebar">
        <div><Link className="studio-brand" href="/studio">Actuals <span>Studio</span></Link><p>{actor.email}</p></div>
        <nav>{navigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav>
        <div className="studio-sidebar-foot"><small>{actor.role}</small><StudioSignOut /></div>
      </aside>
      <main className="studio-main">{children}</main>
    </div>
  );
}
