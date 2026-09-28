"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function StudioSignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const data = new FormData(event.currentTarget);
    const result = await authClient.signIn.email({
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
    });
    setPending(false);
    if (result.error) {
      setError("Could not sign in with those credentials.");
      return;
    }
    router.replace("/studio");
    router.refresh();
  }

  return (
    <main className="studio-auth">
      <form className="studio-auth-form" onSubmit={submit}>
        <p className="eyebrow">Actuals Studio</p>
        <h1>Editorial access</h1>
        <p className="studio-muted">Research, evidence, revisions and publishing live behind this workspace.</p>
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" minLength={12} required /></label>
        {error ? <p className="studio-error" role="alert">{error}</p> : null}
        <button type="submit" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}
