export const C = {
  /* --- texte et fonds --- */
  ink: "#191512", // texte principal, fonds pleins
  muted: "#767068", // texte secondaire
  line: "#ece8e3", // bordures de cartes
  edge: "#d8d3cb", // bordures de boutons

  surface: "#fff", // fond des pages et des cartes
  cream: "#ece8e3", // surface claire posée sur l'encre, texte du menu
  onInk: "#ece8e3", // texte sur fond encre — menu plein écran
  onAccent: "#e3e4d8", // texte sur fond bordeaux — rideau de transition

  /* --- accent de marque --- */
  accent: "#5a1220", // le bordeaux du logo, des sacs, du coffret
  accentDeep: "#420d18", // survol et états pressés
  accentSoft: "#f6eef0", // aplats très clairs, fonds de puces

  /* --- messages d'erreur --- */
  danger: "#9b2c3b",
  dangerSoft: "#fff5f5",
};

export function alpha(hex, opacity) {
  const value = String(hex).replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/* ------------------------------------------------------------------ */
/* Mouvement                                                           */
/* ------------------------------------------------------------------ */

/** Une seule famille de courbes pour tout le site : c'est ce qui donne
 *  l'impression que les animations viennent de la même main. */
export const EASE = {
  out: "cubic-bezier(0.215, 0.61, 0.355, 1)", // entrées, hero
  soft: "cubic-bezier(0.16, 1, 0.3, 1)", // arrivées, révélations
  inOut: "cubic-bezier(0.76, 0, 0.24, 1)", // tache d'encre, rideau, ancres
};

export const DUR = {
  fast: 200,
  base: 500,
  slow: 800,
  scene: 1000, // phases du hero et du rideau de transition
};

/* ------------------------------------------------------------------ */
/* Formes                                                              */
/* ------------------------------------------------------------------ */

export const RADIUS = {
  field: 16, // champs de formulaire
  card: 28, // cartes
  panel: 36, // grands blocs, page contact
  pill: 9999, // boutons
};

/* ------------------------------------------------------------------ */
/* Fonts                                                             */
/* ------------------------------------------------------------------ */
export const FONT = {
  display: '"Melodrama", "Playfair Display", Georgia, serif',
  read: '"PlayfairDisplay", Georgia, "Times New Roman", serif',
};


export default { C, alpha, EASE, DUR, RADIUS, FONT };
