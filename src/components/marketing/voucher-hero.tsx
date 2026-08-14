"use client";

import { motion, type Variants } from "framer-motion";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon, type IconName } from "@/components/ui/icon";

const trustPoints: { icon: IconName; label: string }[] = [
  { icon: "shield", label: "Simulation 100 % locale" },
  { icon: "eye", label: "Aucune donnée transmise" },
  { icon: "layers", label: "6 cartes illustrées" },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function VoucherHero() {
  return (
    <section className="relative overflow-hidden bg-app">
      {/* Halos de dégradé animés — purement décoratifs. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="animate-blob absolute -left-32 top-0 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
        <div
          className="animate-blob absolute -right-24 top-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="animate-blob absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <Container className="relative py-24 sm:py-32 lg:py-36">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.span
            variants={item}
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-ink-2"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-warning-icon" />
            Projet étudiant — maquette pédagogique, non fonctionnelle
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 text-balance text-4xl font-bold tracking-tight text-ink-1 sm:text-5xl lg:text-6xl"
          >
            L&apos;interface premium d&apos;un{" "}
            <span className="bg-gradient-to-r from-sky-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent">
              vérificateur de coupons
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-ink-3"
          >
            Une maquette réalisée dans un cadre scolaire pour illustrer à quoi
            ressemblerait un outil de contrôle de coupons prépayés. Aucun code
            n&apos;est réellement vérifié : chaque résultat affiché plus bas
            est simulé localement, sans connexion à un quelconque service.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <ButtonLink href="#verifier" size="lg">
              Voir la simulation
              <Icon name="arrow-right" size={18} />
            </ButtonLink>
            <ButtonLink href="#cartes" variant="outline" size="lg">
              Cartes illustrées
            </ButtonLink>
          </motion.div>

          <motion.dl
            variants={item}
            className="mx-auto mt-14 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3"
          >
            {trustPoints.map((point) => (
              <div
                key={point.label}
                className="glass flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm text-ink-2"
              >
                <Icon name={point.icon} size={16} className="text-accent" />
                {point.label}
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* Aperçu flottant, purement illustratif. */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="animate-float relative mx-auto mt-16 max-w-md"
        >
          <div className="glass-strong rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-widest text-ink-4">
                Aperçu de l&apos;interface
              </span>
              <span className="rounded-full bg-warning-icon-bg px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-warning">
                Fictif
              </span>
            </div>
            <div className="mt-4 h-10 rounded-lg border border-line bg-input" />
            <div className="mt-3 h-10 rounded-lg border border-line bg-input" />
            <div className="mt-4 h-10 w-32 rounded-lg bg-gradient-to-r from-sky-400 to-indigo-500 opacity-90" />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
