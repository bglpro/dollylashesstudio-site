/**
 * Calculs et utilitaires de la section « pose de cils ».
 *
 * Ils vivent à part du composant : un fichier qui exporte autre chose que
 * des composants casse le rafraîchissement à chaud de Vite
 * (react-refresh/only-export-components).
 */

/* ------------------------------------------------------------------ */
/* Découpage du défilement                                             */
/* ------------------------------------------------------------------ */

// Découpage en "écrans de défilement" (1 = une hauteur de fenêtre) :
// 1 écran collé + 2 écrans d'animation du mot. Le paragraphe n'a pas de
// phase à lui, il est indexé sur la réduction du mot.
export const BANDS_SCREENS = 2;
export const SECTION_SCREENS = 1 + BANDS_SCREENS;

// Repères du paragraphe, en fraction de la réduction du mot
// (0 = le mot commence à rétrécir, 1 = il a atteint sa taille finale).
// Tout se passe dans le dernier tiers : rien n'apparaît avant, et tout est
// terminé quand le mot est à sa taille finale — aucun défilement en plus.
export const RISE_START = 0.65;
export const RISE_END = 0.9;
export const REVEAL_START = 0.95;
export const REVEAL_END = 0.98;

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

// arrondi : évite les "scale(0.09999999999999998)" dans le style inline
const round = (value) => Math.round(value * 1000) / 1000;

/**
 * Bandes de texte.
 *
 * Entrée (le bloc monte du bas de l'écran jusqu'en haut) : arrivée latérale
 * de ±100 % à 0.
 * Puis, sur deux écrans de défilement : première moitié, les bandes 1 et 3
 * se rabattent sur la bande centrale ; seconde moitié, tout rétrécit — et
 * reste centré à l'écran.
 */
export function computeBands(sectionTop, viewportHeight, minScale) {
  const entry = clamp(1 - sectionTop / viewportHeight);
  const pin = clamp(-sectionTop / (viewportHeight * BANDS_SCREENS));

  const xOuter = 100 - entry * 100;
  const xInner = -100 + entry * 100;

  // première moitié : écartement vertical. Seconde moitié : réduction.
  const spreading = pin <= 0.5;
  const yOuter = spreading ? (pin / 0.5) * 100 : 100;
  const scale = spreading ? 1 : 1 - ((pin - 0.5) / 0.5) * (1 - minScale);

  return [
    { x: round(xOuter), y: round(yOuter), scale: round(scale) },
    { x: round(xInner), y: 0, scale: round(scale) },
    { x: round(xOuter), y: round(-yOuter), scale: round(scale) },
  ];
}

/**
 * Paragraphe.
 *
 * Il reste hors champ pendant les deux premiers tiers de la réduction, puis
 * monte et se révèle sur le dernier : quand le mot atteint sa taille finale,
 * il est déjà posé sous lui et entièrement lisible. Rien à scroller de plus.
 *
 * - `top`  : position de repos, en pixels depuis le haut de la scène
 * - `y`    : décalage vertical restant à parcourir
 * - `clip` : part encore masquée, en pourcentage
 */
export function computeParagraph(
  sectionTop,
  viewportHeight,
  bandHeight,
  minScale,
  gap = 32
) {
  const pin = clamp(-sectionTop / (viewportHeight * BANDS_SCREENS));

  // 0 au début de la réduction, 1 quand le mot a fini de rétrécir
  const progress = clamp((pin - 0.5) / 0.5);

  const rise = clamp((progress - RISE_START) / (RISE_END - RISE_START));
  const reveal = clamp((progress - REVEAL_START) / (REVEAL_END - REVEAL_START));

  // la position de repos suit la taille COURANTE du mot : le mot rétrécit
  // encore pendant la montée, s'aligner sur sa taille finale le ferait
  // chevaucher
  const scale = 1 - progress * (1 - minScale);
  const top = viewportHeight / 2 + (bandHeight * scale) / 2 + gap;
  const travel = Math.max(0, viewportHeight - top);

  return {
    top: round(top),
    y: round(travel * (1 - rise)),
    clip: round((1 - reveal) * 100),
  };
}

export const minScaleFor = (viewportWidth) => (viewportWidth <= 1000 ? 0.3 : 0.1);

/**
 * `position: sticky` cesse de fonctionner dès qu'un ancêtre découpe le
 * défilement — le cas le plus fréquent étant `overflow-x: hidden` posé sur
 * html ou body pour masquer un débordement horizontal. La panne est
 * silencieuse : la scène défile normalement et laisse deux écrans de vide.
 * On remonte donc l'arbre pour nommer le coupable.
 */
export function findStickyBreaker(element) {
  if (!element || typeof window.getComputedStyle !== "function") return null;

  const blocking = ["hidden", "auto", "scroll", "overlay"];
  let node = element.parentElement;

  while (node) {
    const style = window.getComputedStyle(node);
    if (blocking.includes(style.overflowY) || blocking.includes(style.overflowX)) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}
