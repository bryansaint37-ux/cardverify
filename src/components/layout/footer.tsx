import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { footerNav } from "@/config/nav";
import { siteConfig } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-app">
      <Container>
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-3">
              {siteConfig.tagline}. Un outil pédagogique open source pour
              comprendre l&apos;algorithme de Luhn — sans jamais envoyer la
              moindre donnée sur un serveur.
            </p>
          </div>

          {footerNav.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold text-ink-2">{group.title}</h2>
              <ul className="mt-4 space-y-3">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-ink-3 transition-colors hover:text-accent"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-4">
            © {year} {siteConfig.name}. Projet de démonstration.
          </p>
          <p className="text-xs text-ink-4">
            Aucun numéro saisi n&apos;est transmis, journalisé ou stocké.
          </p>
        </div>
      </Container>
    </footer>
  );
}
