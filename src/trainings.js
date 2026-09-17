import { FORMATION_IMAGESS } from "./assets/images.js";
/**
 * Contenu des formations. Chaque entrée alimente le gabarit TrainingPage.
 * Ajouter une formation = ajouter un objet ici, la route et le menu suivent.
 */
export const TRAININGS = [
  {
    slug: "cil-a-cil-debutante",
    title: "Cours classique débutante",
    tagline: "Les bases de la pose cil à cil, du geste technique au lancement d'activité.",
    duration: "2 jours",
    image: FORMATION_IMAGESS.find((image) => image.id === "cours-classique-debutante").src,
    level: "Débutante",
    audience:
      "La formation Cil à Cil Débutante s'adresse à toute personne souhaitant se former aux bases essentielles de la pose d'extensions de cils selon la méthode cil à cil classique. Elle convient aussi bien aux débutantes qu'aux personnes en reconversion professionnelle désirant acquérir un savoir-faire technique et apprendre à lancer et structurer leur activité dans le domaine de la beauté du regard.",
    objectives: [
      "Comprendre l'anatomie de l'œil et des cils naturels",
      "Appliquer les règles d'hygiène et de sécurité professionnelles",
      "Identifier et utiliser le matériel nécessaire à la pose d'extensions de cils",
      "Maîtriser la théorie et la technique du cil à cil : isolation, positionnement, travail des rangées, encollement",
      "Adapter la pose à chaque cliente : analyse, morphologie, mapping",
      "Réaliser une dépose d'extensions de cils en toute sécurité",
      "Évaluer et améliorer la qualité de son travail (dépose / repose)",
      "Mettre en valeur ses prestations grâce à des photos professionnelles",
      "Comprendre les bases de la gestion d'entreprise",
      "Apprendre à gérer sa clientèle et développer sa visibilité",
    ],
    included: ["Kit professionnel offert — valeur 100 €"],
  },
  {
    slug: "volumes",
    title: "Les volumes",
    subtitle: "Wispy, wet set, volume russe",
    tagline: "Enrichir ses prestations avec des poses plus intenses, sans perdre en précision.",
    duration: "2 jours",
    image: FORMATION_IMAGESS.find((image) => image.id === "les-volumes").src,
    level: "Perfectionnement",
    audience:
      "La formation Volume Russe s'adresse à toute personne ayant déjà acquis les bases essentielles de la technique cil à cil classique et souhaitant approfondir ses compétences en apprenant la technique du volume russe. Elle est idéale pour les techniciennes souhaitant enrichir leurs prestations et offrir des poses plus intenses, tout en conservant précision et élégance. Pour celles qui souhaitent revoir ou renforcer les bases du cil à cil, le cours complet cil à cil et les volumes est recommandé.",
    objectives: [
      "Découvrir et maîtriser le matériel spécifique aux volumes",
      "Comprendre la théorie et appliquer la technique des volumes : création de bouquets, isolation, travail des rangées, encollement",
      "Évaluer et améliorer la qualité de son travail (dépose / repose)",
      "Mettre en valeur ses prestations grâce à des photos professionnelles adaptées aux volumes",
    ],
    included: ["Kit professionnel offert — valeur 100 €"],
  },
  {
    slug: "cil-a-cil-et-volumes",
    title: "Cours complet cil à cil et les volumes",
    tagline: "Revoir les fondamentaux et perfectionner la technique du volume russe.",
    duration: "3 jours",
    image: FORMATION_IMAGESS.find((image) => image.id === "livret").src,
    level: "Complet",
    audience:
      "Cette formation est idéale pour toutes celles qui souhaitent revoir les fondamentaux et perfectionner la technique du volume russe.",
    objectives: [
      "Découverte et maîtrise du matériel dédié aux volumes",
      "Apprentissage de la théorie et de la technique des volumes : création de bouquets, encollement, travail structuré des rangées",
      "Adaptation de la pose à chaque cliente grâce à l'analyse et au mapping personnalisé",
      "Réalisation de poses naturelles et équilibrées : choix des longueurs, épaisseurs et couleurs adaptées",
      "Révision et perfectionnement de la technique cil à cil : positionnement, isolation, encollement",
      "Analyse des bases essentielles : colle, rétention, produits utilisés, erreurs courantes",
      "Évaluation et amélioration du travail réalisé (dépose / repose)",
      "Mise en valeur des prestations grâce à des photos professionnelles",
    ],
    included: ["Kit professionnel offert — valeur 100 €"],
  },
  {
    slug: "coaching-prive",
    title: "Coaching privé",
    tagline: "Corriger ses gestes, gagner en précision et reprendre confiance.",
    duration: "1 journée ou demi-journée",
    image: FORMATION_IMAGESS.find((image) => image.id === "creation-contenu").src,
    level: "Perfectionnement",
    audience:
      "Le perfectionnement en extension de cils s'adresse aux techniciennes déjà formées souhaitant approfondir leurs compétences, corriger leurs gestes techniques et gagner en précision. Cette formation est idéale pour celles qui veulent améliorer la tenue, la qualité de leur travail et retrouver confiance dans leur pratique afin d'offrir des prestations toujours plus professionnelles à leur clientèle.",
    objectives: [
      "Revoir et consolider les bases techniques de l'extension de cils",
      "Corriger les gestes et les mauvaises habitudes",
      "Améliorer la précision, la régularité et la symétrie des poses",
      "Perfectionner la tenue et la durabilité des extensions",
      "Gagner en rapidité tout en conservant un travail de qualité",
      "Renforcer la confiance en soi et l'assurance professionnelle",
      "Élever le niveau de prestation pour satisfaire et fidéliser la clientèle",
    ],
    included: ["Livret de formation", "Certificat"],
  },
  {
    slug: "creation-de-contenu",
    title: "Création de contenu & stratégie social média",
    tagline: "Créer des vidéos qui donnent envie, et les monter depuis son téléphone.",
    duration: "1 journée",
    image: FORMATION_IMAGESS.find((image) => image.id === "coaching-prive").src,
    level: "Business",
    audience:
      "Cette formation s'adresse aux professionnels de la beauté qui souhaitent apprendre à créer des vidéos et contenus impactants pour les réseaux sociaux. Elle est idéale pour celles et ceux qui veulent améliorer la qualité de leur image, gagner en visibilité en ligne et développer leur activité grâce à des stratégies simples, efficaces et adaptées à leur entreprise.",
    intro:
      "Découvrez les bases de la création de contenu et les stratégies efficaces pour développer votre visibilité sur les réseaux sociaux. Repartez avec des compétences concrètes en création et montage de contenu pour développer l'image et la visibilité de votre entreprise.",
    steps: [
      "Assistez à une démonstration en direct avec Dolly, qui vous guide sur le choix du matériel, les angles idéaux et les positions à adopter pour un rendu professionnel.",
      "Suivez pas à pas les démonstrations sur grand écran et apprenez à monter vos contenus directement depuis votre téléphone.",
      "Passez à la pratique en temps réel avec votre partenaire d'atelier, accompagnée des conseils personnalisés de Dolly.",
      "Session questions-réponses : posez toutes vos questions et bénéficiez de démonstrations complémentaires adaptées à vos besoins.",
    ],
    included: ["Livret de formation", "Certificat"],
    certification: false,
  },
];

/** Blocs communs à toutes les formations, pour ne pas les répéter cinq fois. */
export const COMMON = {
  scheduleNote: "Les horaires détaillés sont communiqués dans le programme de formation.",
  certification: [
    "Une évaluation des connaissances est réalisée en fin de formation",
    "Un certificat d'aptitude est délivré après validation des acquis",
    "Un suivi personnalisé après la formation est assuré par la formatrice",
  ],
  payment: [
    "Paiement échelonné : possibilité de régler en plusieurs fois entre la date d'inscription et le jour de la formation, selon vos possibilités.",
    "En cas d'annulation, le montant versé est remboursé sous forme d’avoir, valable 12 mois à compter de sa date d’émission.",
  ],
};

export const findTraining = (slug) =>
  TRAININGS.find((training) => training.slug === slug) || null;
