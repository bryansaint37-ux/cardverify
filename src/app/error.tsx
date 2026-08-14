"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // En production, brancher ici un service de suivi d'erreurs.
    console.error(error);
  }, [error]);

  return (
    <Container size="sm" className="py-24 text-center sm:py-32">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-danger-border bg-danger-bg text-danger">
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3 2 20h20L12 3ZM12 9v5M12 17.5v.5" />
        </svg>
      </span>

      <h1 className="mt-6 text-balance text-3xl font-bold tracking-tight text-ink-1 sm:text-4xl">
        Une erreur est survenue
      </h1>
      <p className="mx-auto mt-4 max-w-md text-pretty leading-relaxed text-ink-3">
        Le rendu de cette page a échoué. Réessayer suffit le plus souvent ; si le
        problème persiste, revenez à l&apos;accueil.
      </p>

      {error.digest ? (
        <p className="mt-4 font-mono text-xs text-ink-4">
          Référence : {error.digest}
        </p>
      ) : null}

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Button onClick={reset}>Réessayer</Button>
        <ButtonLink href="/" variant="outline">
          Retour à l&apos;accueil
        </ButtonLink>
      </div>
    </Container>
  );
}
