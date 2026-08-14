export type FaqEntry = {
  question: string;
  answer: string;
};

export const faqEntries: FaqEntry[] = [
  {
    question: "Card Verify vérifie-t-il qu'une carte est réelle ou approvisionnée ?",
    answer:
      "Non, et c'est une distinction essentielle. L'algorithme de Luhn ne teste que la cohérence mathématique d'une suite de chiffres. Il ignore totalement l'existence du compte, son solde, sa date d'expiration ou son statut. Seul un organisme bancaire, via son réseau d'autorisation, peut répondre à ces questions.",
  },
  {
    question: "Mes saisies sont-elles envoyées quelque part ?",
    answer:
      "Non. Toute la vérification s'exécute en JavaScript dans votre navigateur. Aucun numéro n'est transmis à un serveur, enregistré dans un journal ou stocké localement. Vous pouvez le constater en ouvrant l'onglet « Réseau » des outils de développement : aucune requête n'est émise pendant la saisie.",
  },
  {
    question: "Dois-je saisir un vrai numéro de carte ?",
    answer:
      "Surtout pas. Ce site est une démonstration pédagogique : utilisez les numéros de test publics fournis sur la page de démonstration. Ils sont publiés par les réseaux eux-mêmes pour les environnements de développement et ne correspondent à aucun compte.",
  },
  {
    question: "À quoi sert concrètement l'algorithme de Luhn ?",
    answer:
      "À détecter les erreurs de saisie avant tout appel réseau. Il repère la totalité des fautes sur un chiffre unique et la plupart des inversions de deux chiffres adjacents. Un formulaire qui l'implémente évite une requête inutile et affiche l'erreur immédiatement. On le retrouve aussi sur les numéros IMEI, les identifiants nationaux et certains codes-barres.",
  },
  {
    question: "Pourquoi le réseau est-il détecté avant même la fin de la saisie ?",
    answer:
      "Parce que les premiers chiffres, appelés IIN ou BIN (Issuer Identification Number), désignent l'émetteur. Un 4 initial signale Visa, la plage 51-55 et 2221-2720 Mastercard, 34 et 37 American Express. Cette table de préfixes est publique et normalisée par l'ISO/IEC 7812.",
  },
  {
    question: "Un numéro validé par Luhn peut-il être refusé par la banque ?",
    answer:
      "Constamment. Luhn est un filtre de premier niveau : il élimine les saisies incohérentes. Un numéro peut passer ce test tout en désignant une carte expirée, bloquée, plafonnée ou tout simplement jamais émise. L'inverse n'est pas vrai : un numéro qui échoue au test de Luhn est certainement erroné.",
  },
  {
    question: "Puis-je réutiliser ce code dans mon projet ?",
    answer:
      "Oui. Les fonctions de src/lib/luhn.ts et src/lib/validate-card.ts sont autonomes, sans dépendance externe, et typées. Rappelez-vous cependant qu'un formulaire de paiement en production doit passer par un prestataire certifié PCI DSS : votre application ne devrait jamais manipuler un numéro de carte en clair.",
  },
  {
    question: "Le site fonctionne-t-il sans JavaScript ?",
    answer:
      "Le contenu pédagogique — pages, explications, FAQ — est rendu côté serveur et reste entièrement lisible. Seul le formulaire interactif de la page de démonstration nécessite JavaScript, puisque le calcul se fait délibérément côté client.",
  },
];
