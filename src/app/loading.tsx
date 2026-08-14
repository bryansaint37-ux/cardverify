import { Container } from "@/components/ui/container";

/** Squelette affiché pendant le rendu d'une route serveur. */
export default function Loading() {
  return (
    <Container className="py-14 sm:py-20">
      <div className="animate-pulse space-y-6" aria-hidden="true">
        <div className="h-4 w-32 rounded bg-chip" />
        <div className="h-11 w-3/4 max-w-xl rounded-lg bg-chip" />
        <div className="h-5 w-full max-w-2xl rounded bg-card" />
        <div className="h-5 w-2/3 max-w-xl rounded bg-card" />

        <div className="grid gap-6 pt-8 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="h-40 rounded-2xl bg-input" />
          ))}
        </div>
      </div>

      <span className="sr-only" role="status">
        Chargement en cours…
      </span>
    </Container>
  );
}
