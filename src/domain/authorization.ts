export type StudioRole = "owner" | "editor" | "researcher";
export type StudioCapability =
  | "research:write"
  | "article:write"
  | "article:review"
  | "article:publish"
  | "studio:manage";

const permissions: Record<StudioRole, readonly StudioCapability[]> = {
  owner: ["research:write", "article:write", "article:review", "article:publish", "studio:manage"],
  editor: ["research:write", "article:write", "article:review", "article:publish"],
  researcher: ["research:write", "article:write"],
};

export function can(role: StudioRole, capability: StudioCapability) {
  return permissions[role].includes(capability);
}

export function assertCan(role: StudioRole, capability: StudioCapability) {
  if (!can(role, capability)) throw new Error(`Role ${role} cannot perform ${capability}`);
}
