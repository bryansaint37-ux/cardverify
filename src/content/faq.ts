export type FaqEntry = {
  question: string;
  answer: string;
};

/**
 * Ordre d'affichage des entrées de la FAQ. Les textes (question / réponse)
 * vivent désormais dans messages/*.json sous la clé `faqPage.entries.<clé>`
 * et sont résolus à l'affichage via next-intl, dans la langue active.
 */
export const faqEntryKeys = [
  "real",
  "dataSent",
  "realNumber",
  "purpose",
  "networkDetection",
  "refused",
  "reuse",
  "noJs",
] as const;

export type FaqEntryKey = (typeof faqEntryKeys)[number];
