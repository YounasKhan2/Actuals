"use client";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function StudioSignOut() {
  const router = useRouter();
  return <button className="studio-signout" onClick={async () => {
    await authClient.signOut();
    router.replace("/studio-login");
    router.refresh();
  }}>Sign out</button>;
}
