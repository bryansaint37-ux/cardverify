"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { InputCode } from "@/components/ui/input-code";
import { Loading } from "@/components/ui/loading";

export function AdminLoginForm() {
  const router = useRouter();
  const t = useTranslations("dashboardPage.login");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.message ?? t("accessDenied"));
        setStatus("error");
        return;
      }

      // Le cookie de session est posé par l'API : on redéclenche le rendu
      // serveur de la page, qui affichera désormais le tableau de bord.
      router.refresh();
    } catch {
      setError(t("serverUnreachable"));
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="glass rounded-2xl p-8">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-chip text-accent">
          <Icon name="shield" size={22} />
        </span>

        <h1 className="mt-5 text-center text-xl font-semibold text-ink-1">
          {t("title")}
        </h1>
        <p className="mt-2 text-center text-sm leading-relaxed text-ink-3">
          {t("description")}
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <InputCode
            label={t("passwordLabel")}
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (status === "error") setStatus("idle");
            }}
            state={status === "error" ? "error" : "default"}
          />

          {error ? (
            <Alert tone="danger" className="text-left">
              {error}
            </Alert>
          ) : null}

          <Button type="submit" className="w-full" disabled={!password || status === "loading"}>
            {status === "loading" ? (
              <Loading size="sm" tone="inverted" label={t("connecting")} />
            ) : (
              t("submit")
            )}
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-ink-4">
        {t("footnote")}
      </p>
    </div>
  );
}
