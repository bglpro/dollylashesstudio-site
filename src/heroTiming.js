/**
 * Minutage de l'entrée du hero.
 *
 * À part du composant : un fichier qui exporte autre chose que des
 * composants casse le rafraîchissement à chaud de Vite
 * (react-refresh/only-export-components).
 */

export const TIMING = {
  start: 500, // délai avant le premier mouvement
  duration: 1000, // durée d'une phase
  imageStagger: 100, // décalage entre deux médias
  copyStagger: 50, // décalage entre deux lignes de légende
};

/**
 * Instants de bascule des trois phases, en millisecondes.
 * Phase 1 : le logo monte derrière son cache.
 * Phase 2 : l'image s'ouvre au centre.
 * Phase 3 : elle occupe tout le cadre, le logo passe à sa taille pleine.
 */
export function computeSchedule(steps = 0, timing = TIMING) {
  const firstEnd =
    timing.start + timing.duration + timing.imageStagger * Math.max(0, steps - 1);
  return {
    phase1: timing.start,
    phase2: firstEnd,
    phase3: firstEnd + timing.duration,
    total: firstEnd + timing.duration * 2,
  };
}

/** Minutage partagé avec App : la navigation descend sur la phase 3. */
export const HERO_SCHEDULE = computeSchedule(0);
