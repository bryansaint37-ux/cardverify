# Card Verify

Démonstration pédagogique de l'algorithme de Luhn, construite avec **Next.js 15
(App Router)**, **TypeScript** et **Tailwind CSS v4**.

> **Ce site n'est pas un service de vérification bancaire.** Il n'interroge aucun
> établissement financier et ne peut pas confirmer qu'une carte existe. Tout le
> calcul s'exécute dans le navigateur : aucune saisie n'est transmise,
> journalisée ni stockée.

## Démarrage

```bash
npm install                  # génère aussi le client Prisma (postinstall)
cp .env.example .env         # ajustez les valeurs si besoin
npm run db:migrate           # crée prisma/dev.db et applique le schéma
npm run db:seed              # peuple la base avec des données fictives
npm run dev
```

Le site est servi sur http://localhost:3000.

| Script              | Rôle                                              |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Serveur de développement                          |
| `npm run build`     | Compilation de production                         |
| `npm run start`     | Sert le build de production                       |
| `npm run lint`      | ESLint (config `next/core-web-vitals`)            |
| `npm run typecheck` | Vérification TypeScript sans émission             |
| `npm run db:migrate`| Applique les migrations Prisma (SQLite)           |
| `npm run db:seed`   | Régénère le jeu de données fictif de `/admin`     |
| `npm run db:reset`  | Réinitialise la base puis la reseed               |

## Arborescence

```
card-verify/
├── next.config.ts            # en-têtes de sécurité, options du framework
├── postcss.config.mjs        # branchement de Tailwind v4
├── eslint.config.mjs         # ESLint « flat config »
├── tsconfig.json             # mode strict + alias @/*
├── public/                   # fichiers servis tels quels
└── src/
    ├── app/                  # App Router : routes et fichiers spéciaux
    │   ├── layout.tsx        # layout racine, métadonnées globales, JSON-LD
    │   ├── page.tsx          # accueil
    │   ├── globals.css       # thème Tailwind v4 (@theme) et bases
    │   ├── icon.svg          # favicon (convention de fichier)
    │   ├── manifest.ts       # manifeste PWA
    │   ├── sitemap.ts        # sitemap.xml généré
    │   ├── robots.ts         # robots.txt généré
    │   ├── opengraph-image.tsx
    │   ├── loading.tsx       # squelette de chargement
    │   ├── error.tsx         # frontière d'erreur client
    │   ├── not-found.tsx     # page 404
    │   ├── verification/     # démonstration interactive
    │   ├── algorithme/       # documentation de l'algorithme
    │   ├── faq/
    │   ├── a-propos/
    │   ├── contact/
    │   ├── mentions-legales/
    │   └── confidentialite/
    ├── components/
    │   ├── ui/               # primitives réutilisables
    │   │   ├── button.tsx    # Button, ButtonLink
    │   │   ├── card.tsx      # Card, CardHeader, CardTitle, CardBody, CardFooter
    │   │   ├── badge.tsx
    │   │   ├── alert.tsx
    │   │   ├── container.tsx
    │   │   ├── section.tsx   # Section, SectionHeading
    │   │   └── icon.tsx      # jeu d'icônes SVG interne
    │   ├── layout/
    │   │   ├── header.tsx
    │   │   ├── footer.tsx
    │   │   ├── logo.tsx
    │   │   ├── mobile-nav.tsx
    │   │   └── demo-banner.tsx
    │   ├── marketing/
    │   │   ├── hero.tsx
    │   │   ├── feature-grid.tsx
    │   │   ├── how-it-works.tsx
    │   │   ├── faq-accordion.tsx
    │   │   └── cta.tsx
    │   └── verify/
    │       ├── card-form.tsx      # seul composant client de la démo
    │       ├── card-preview.tsx
    │       ├── result-panel.tsx
    │       ├── luhn-steps.tsx
    │       └── sample-numbers.tsx
    ├── config/
    │   ├── site.ts           # identité du site, source du SEO
    │   └── nav.ts            # navigation principale et pied de page
    ├── content/
    │   ├── faq.ts
    │   └── features.ts
    ├── hooks/
    │   └── use-card-input.ts # état du champ, formatage, validation
    ├── lib/
    │   ├── luhn.ts           # algorithme + calcul de la clé de contrôle
    │   ├── card-brands.ts    # table IIN, longueurs, numéros de test
    │   ├── validate-card.ts  # orchestration des trois contrôles
    │   ├── format.ts         # regroupement des chiffres, masquage
    │   ├── seo.ts            # buildMetadata + JSON-LD
    │   └── utils.ts          # cn, onlyDigits, slugify
    └── types/
        └── index.ts          # types partagés
```

## Logique métier

Trois contrôles indépendants, du plus général au plus spécifique
([`src/lib/validate-card.ts`](src/lib/validate-card.ts)) :

1. **Format** — chiffres uniquement, longueur de 12 à 19 (ISO/IEC 7812) ;
2. **Réseau** — le préfixe IIN correspond-il à une plage connue, et la longueur
   est-elle autorisée par ce réseau ;
3. **Somme de contrôle** — le calcul de Luhn est-il un multiple de 10.

```ts
import { validateCard } from "@/lib/validate-card";

const result = validateCard("4242 4242 4242 4242");
result.valid; // true
result.brand.label; // "Visa"
result.luhn.sum; // 60
result.luhn.steps; // détail chiffre par chiffre
```

Ces fonctions sont pures et sans dépendance : elles se réutilisent telles quelles
dans un autre projet.

## SEO

- Métadonnées par page via `buildMetadata()` — titre, description, canonique,
  Open Graph et Twitter Card dérivés de `src/config/site.ts` ;
- `sitemap.xml`, `robots.txt` et `manifest.webmanifest` générés par le framework ;
- données structurées JSON-LD : `WebSite`, `BreadcrumbList` et `FAQPage` ;
- image de partage générée à la compilation par `opengraph-image.tsx` ;
- rendu serveur par défaut : seul le formulaire de démonstration est un
  composant client.

## Accessibilité et responsive

- Navigation clavier complète, anneaux de focus visibles, lien d'évitement ;
- accordéon FAQ en `<details>`/`<summary>` natif, fonctionnel sans JavaScript ;
- résultats annoncés via `aria-live`, états d'erreur via `aria-invalid` ;
- `prefers-reduced-motion` respecté ;
- disposition fluide de 320 px aux grands écrans, sans point de rupture figé.

## Panneau /admin

Page protégée par mot de passe (`ADMIN_PASSWORD`, `Le-king` par défaut) qui
affiche, recherche, filtre par type et supprime des enregistrements SQLite
(Prisma). **Ces enregistrements sont entièrement fictifs**, générés une fois
par [prisma/seed.mjs](prisma/seed.mjs) — le formulaire public
[/verifier](src/app/verifier/page.tsx) et la route
[/api/verify](src/app/api/verify/route.ts) n'écrivent jamais dans cette base,
volontairement : aucune saisie d'un visiteur n'y transite. Route exclue du
`robots.txt` et non indexée.

## Avant une mise en production

- Renseignez `NEXT_PUBLIC_SITE_URL` avec le domaine réel.
- Changez `ADMIN_PASSWORD` et `ADMIN_SESSION_SECRET` — les valeurs par défaut
  sont publiques (présentes dans ce dépôt) et ne protègent rien de réel.
- Complétez [mentions-legales](src/app/mentions-legales/page.tsx) (éditeur,
  hébergeur, directeur de publication).
- Le formulaire de contact est une maquette : branchez-y un service d'envoi.
- Pour un vrai formulaire de paiement, passez par un prestataire certifié
  **PCI DSS** avec champs hébergés ou tokenisation. Une application ne devrait
  jamais manipuler un numéro de carte en clair.

## Licence

Projet de démonstration, fourni à des fins pédagogiques.
# cardverify
# cardverify
# cardverify
