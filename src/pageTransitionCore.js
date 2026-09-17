import { createContext, useContext } from "react";
import { C, EASE, DUR } from "./theme";

/**
 * Contexte, réglages et utilitaires de la transition de page.
 *
 * À part du composant : un fichier qui exporte autre chose que des
 * composants casse le rafraîchissement à chaud de Vite
 * (react-refresh/only-export-components). Le contexte doit vivre ici pour
 * que le hook et le fournisseur partagent la même instance.
 */

/* ------------------------------------------------------------------ */
/* Réglages                                                            */
/* ------------------------------------------------------------------ */

export const TRANSITION = {
  expand: 800, // la tache recouvre l'écran
  hold: 700, // temps d'affichage du mot-symbole
  settle: 180, // la page d'arrivée se monte, encore cachée
  contract: 1100, // la tache se retire sur la nouvelle page
  // l'ouverture accélère puis freine, le retrait part vite et se pose :
  // c'est ce qui rend la fin lisible plutôt qu'expédiée
  ease: EASE.inOut,
  easeOut: "cubic-bezier(0.22, 1, 0.36, 1)",
  color: C.accent,
  ink: C.onAccent, // crème, pour le mot sur le bordeaux
};

/** Conservé pour compatibilité : durée de la phase de couverture. */
export const coverDuration = (config = TRANSITION) => config.expand;

export const TransitionContext = createContext(null);

/**
 * Rayon nécessaire pour couvrir le coin le plus éloigné de l'origine.
 * Volontairement recopié depuis SiteNav plutôt qu'importé : SiteNav importe
 * déjà TransitionLink d'ici, et un import croisé entre les deux fichiers est
 * une source d'ennuis pour quatre lignes de calcul.
 */
export function coverRadius(cx, cy) {
  if (typeof window === "undefined") return 0;
  const dx = Math.max(cx, window.innerWidth - cx);
  const dy = Math.max(cy, window.innerHeight - cy);
  return Math.sqrt(dx * dx + dy * dy) + 20;
}

export const viewportCenter = () => ({
  x: typeof window === "undefined" ? 0 : window.innerWidth / 2,
  y: typeof window === "undefined" ? 0 : window.innerHeight / 2,
});

/**
 * Remonte en haut de la page.
 *
 * Les ancres ne sont pas traitées ici : la glissade animée de navigation.js
 * s'en charge une fois la page d'arrivée montée.
 */
export function scrollToTarget() {
  if (typeof window === "undefined") return;
  try {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  } catch {
    window.scrollTo(0, 0); // navigateurs sans l'option behavior
  }
}

/** Permet à n'importe quel composant de déclencher la transition. */
export const usePageTransition = () => useContext(TransitionContext);

export const TRANSITION_CSS = `
@keyframes pt-letter-in {
  from { opacity: 0; transform: translateY(90%); }
  to   { opacity: 1; transform: translateY(0); }
}
.pt-logo { animation: pt-letter-in ${DUR.base}ms cubic-bezier(0.215,0.61,0.355,1) both; }
.pt-letter { display: inline-block; animation: pt-letter-in ${DUR.base}ms cubic-bezier(0.215,0.61,0.355,1) both; }
.pt-ink { will-change: clip-path; }
@media (prefers-reduced-motion: reduce) {
  .pt-letter { animation-duration: 1ms !important; }
  .pt-ink { transition-duration: 1ms !important; }
}`;

/** "/#prestations" → "/" : la transition ne se décide que sur le chemin. */
export const pathOf = (to) => String(to || "").split("#")[0] || "/";
