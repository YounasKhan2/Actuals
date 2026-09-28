"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function StudioSetupPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    const data = new FormData(event.currentTarget);
    const result = await authClient.signUp.email({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
    });
    setPending(false);
    if (result.error) {
      setMessage("Setup was rejected. Only the configured Studio owner can bootstrap an account.");
      return;
    }
    router.replace("/studio");
    router.refresh();
  }

  return (
    <main className="studio-auth">
      <form className="studio-auth-form" onSubmit={submit}>
        <p className="eyebrow">Actuals Studio</p>
        <h1>Owner setup</h1>
        <p className="studio-muted">This endpoint only accepts the email configured as STUDIO_OWNER_EMAIL.</p>
        <label>Name<input name="name" autoComplete="name" required /></label>
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Password<input name="password" type="password" autoComplete="new-password" minLength={12} required /></label>
        {message ? <p className="studio-error" role="alert">{message}</p> : null}
        <button type="submit" disabled={pending}>{pending ? "Creating owner…" : "Create owner"}</button>
      </form>
    </main>
  );
}
