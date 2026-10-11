import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { footerNav } from "@/config/nav";
import { siteConfig } from "@/config/site";

export async function Footer() {
  const year = new Date().getFullYear();
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-line bg-app">
      <Container>
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
          </div>

          {footerNav.map((group) => (
            <div key={group.group}>
              <h2 className="text-sm font-semibold text-ink-2">
                {t(`groups.${group.group}.title`)}
              </h2>
              <ul className="mt-4 space-y-3">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-ink-3 transition-colors hover:text-accent"
                    >
                      {t(`groups.${group.group}.items.${item.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-4">
            {t("copyright", { year, name: siteConfig.name })}
          </p>
          <p className="text-xs text-ink-4">{t("noDataNotice")}</p>
        </div>
      </Container>
    </footer>
  );
}
