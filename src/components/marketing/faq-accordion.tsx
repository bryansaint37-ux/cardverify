import type { FaqEntry } from "@/content/faq";
import { slugify } from "@/lib/utils";

/**
 * Accordéon natif : <details>/<summary> fonctionne sans JavaScript et reste
 * accessible au clavier et aux lecteurs d'écran par défaut.
 */
export function FaqAccordion({ entries }: { entries: FaqEntry[] }) {
  return (
    <div className="glass divide-y divide-line rounded-2xl">
      {entries.map((entry) => (
        <details
          key={entry.question}
          id={slugify(entry.question)}
          className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-ink-1 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-app">
            {entry.question}
            <span
              aria-hidden="true"
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line-soft text-ink-3 transition-transform duration-200 group-open:rotate-45"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
          </summary>

          <p className="mt-3 text-sm leading-relaxed text-ink-3">{entry.answer}</p>
        </details>
      ))}
    </div>
  );
}
