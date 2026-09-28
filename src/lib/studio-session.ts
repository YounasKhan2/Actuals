import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import type { StudioRole } from "@/domain/authorization";

const roles = new Set<StudioRole>(["owner", "editor", "researcher"]);

export async function getStudioActor() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const role = session.user.role;
  if (typeof role !== "string" || !roles.has(role as StudioRole)) {
    throw new Error("Authenticated Studio user has an invalid role");
  }
  return {
    userId: session.user.id,
    email: session.user.email,
    role: role as StudioRole,
  };
}

export async function requireStudioActor() {
  const actor = await getStudioActor();
  if (!actor) throw new Error("Authentication required");
  return actor;
}
