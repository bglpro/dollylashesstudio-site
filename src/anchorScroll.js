/**
 * Défilement vers une ancre, avec hauteur d'arrêt réglable.
 *
 * scrollIntoView aligne le haut de la cible sur le haut de la fenêtre et
 * ne sait pas viser autre chose. On calcule donc la position absolue,
 * puis on retire le décalage voulu.
 *
 * Un décalage négatif fait dépasser le haut de la section : c'est ce qu'il
 * faut pour les scènes collantes, dont l'animation doit être engagée.
 */

/** "/#prestations" → "#prestations" ; "#faq" → "#faq" ; "/contact" → "" */
export function hashOf(href) {
  const value = String(href || "");
  const index = value.indexOf("#");
  return index === -1 ? "" : value.slice(index);
}

export function scrollToAnchor(href, offset = 0) {
  if (typeof window === "undefined") return false;

  const hash = hashOf(href);
  if (!hash || hash.length < 2) return false;

  const target = document.querySelector(hash);
  if (!target) return false; // pas sur cette page : on laisse le lien agir

  const reduced =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const value = typeof offset === "function" ? offset() : offset;
  const top = target.getBoundingClientRect().top + window.scrollY - value;

  window.scrollTo({
    top: Math.max(0, Math.round(top)),
    behavior: reduced ? "auto" : "smooth",
  });
  return true;
}
