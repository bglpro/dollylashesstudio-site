/**
 * Arborescence du menu et géométrie de la tache d'encre.
 *
 * À part du composant : un fichier qui exporte autre chose que des
 * composants casse le rafraîchissement à chaud de Vite
 * (react-refresh/only-export-components).
 */

/* ------------------------------------------------------------------ */
/* Menu par défaut                                                     */
/* ------------------------------------------------------------------ */

export const DEFAULT_MENU = [
  {
    label: "Accueil",
    href: "/",
  },
  {
    label: "Formations",
    href: "/#formations",
    children: [
      { label: "Cours classique débutante", href: "/formations/cil-a-cil-debutante" },
      { label: "Les volumes", href: "/formations/volumes" },
      { label: "Cil à cil et volumes", href: "/formations/cil-a-cil-et-volumes" },
      { label: "Coaching privé", href: "/formations/coaching-prive" },
      { label: "Création de contenu", href: "/formations/creation-de-contenu" },
    ],
  },
  { label: "Prestations", href: "/#prestations" },
  { label: "A propos", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Rayon nécessaire pour couvrir le coin le plus éloigné de l'origine. */
export function coverRadius(cx, cy, width, height) {
  const dx = Math.max(cx, width - cx);
  const dy = Math.max(cy, height - cy);
  return Math.sqrt(dx * dx + dy * dy) + 20;
}
