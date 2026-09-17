import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/* Défilement animé vers une section                                   */
/* ------------------------------------------------------------------ */

/* easeInOutQuint : départ lent, milieu rapide, arrivée qui se pose. */
const ease = (t) => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function cssPx(name) {
  if (typeof window === "undefined") return 0;
  const value = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(name)
  );
  return Number.isFinite(value) ? value : 0;
}

/** Hauteur occupée par l'en-tête collant, publiée par SiteNav. */
export function navOffset() {
  return cssPx("--nav-height") + cssPx("--banner-height") + 16;
}

let current = null;

export function cancelScroll() {
  if (!current) return;
  cancelAnimationFrame(current.raf);
  current.detach();
  current.resolve(false);
  current = null;
}

/** Fait glisser la page jusqu'à `top`. La promesse se résout à l'arrivée. */
export function animateScrollTo(top, { duration } = {}) {
  return new Promise((resolve) => {
    cancelScroll();

    const start = window.scrollY;
    const limit = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
    const target = Math.min(Math.max(top, 0), limit);
    const distance = target - start;

    if (Math.abs(distance) < 2) return resolve(true);

    if (prefersReducedMotion()) {
      window.scrollTo(0, target);
      return resolve(true);
    }

    // la durée suit la distance : un saut court ne traîne pas,
    // une traversée de page n'est pas expédiée
    const ms =
      duration ?? Math.min(1250, Math.max(620, Math.abs(distance) * 0.55));
    const t0 = performance.now();

    // le geste de l'utilisateur reprend toujours la main
    const abort = () => cancelScroll();
    const onKey = (event) => {
      if (
        ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(
          event.key
        )
      )
        abort();
    };
    const detach = () => {
      window.removeEventListener("wheel", abort);
      window.removeEventListener("touchmove", abort);
      window.removeEventListener("keydown", onKey);
    };
    window.addEventListener("wheel", abort, { passive: true });
    window.addEventListener("touchmove", abort, { passive: true });
    window.addEventListener("keydown", onKey);

    const step = (now) => {
      const t = Math.min(1, (now - t0) / ms);
      window.scrollTo(0, start + distance * ease(t));
      if (t < 1) {
        current.raf = requestAnimationFrame(step);
        return;
      }
      detach();
      current = null;
      resolve(true);
    };

    current = { raf: requestAnimationFrame(step), detach, resolve };
  });
}

/** Marque la section atteinte : le CSS plus bas s'occupe du reste. */
function markArrival(el) {
  el.removeAttribute("data-arrived");
  void el.offsetWidth; // relance l'animation même sur la même cible
  el.setAttribute("data-arrived", "true");
  window.setTimeout(() => el.removeAttribute("data-arrived"), 1600);

  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

export function findSection(hash) {
  const id = String(hash || "").replace(/^.*#/, "");
  if (!id) return null;
  return (
    document.getElementById(id) ||
    document.querySelector(`[data-section="${id}"]`) ||
    null
  );
}

/* Dernière ancre réellement rejointe, sous la forme "/chemin#ancre".
   Elle empêche la surveillance globale de rejouer une glissade déjà faite. */
let lastResolved = "";
let lastPathSeen = null;

/** Glisse jusqu'à `#id`. Renvoie false si la section n'existe pas ici. */
export function scrollToHash(hash, options = {}) {
  const el = findSection(hash);
  if (!el) return Promise.resolve(false);

  const id = String(hash).replace(/^.*#/, "");
  const top = window.scrollY + el.getBoundingClientRect().top - navOffset();
  lastResolved = `${cleanPath(window.location.pathname)}#${id}`;

  return animateScrollTo(top, options).then((reached) => {
    if (reached) markArrival(el);
    // l'URL reflète la section, sans casser l'état du routeur
    window.history.replaceState(window.history.state, "", `#${id}`);
    lastResolved = `${cleanPath(window.location.pathname)}#${id}`;
    return true;
  });
}

/* ------------------------------------------------------------------ */
/* Surveillance globale du hash                                        */
/* ------------------------------------------------------------------ */

/**
 * Monté une seule fois par SiteNav, donc actif sur toutes les pages.
 *
 * Le point délicat : en arrivant depuis une autre page, la section n'existe
 * pas encore au moment où l'URL change — la transition de page est en cours.
 * On réessaie donc toutes les 60 ms pendant 3 s, jusqu'à ce que l'élément
 * apparaisse dans le document.
 */
export function useHashScroll() {
  useEffect(() => {
    patchHistory();

    let timer = null;
    let stopped = false;

    const attempt = (tries) => {
      if (stopped) return;
      const hash = window.location.hash;
      if (!hash) return;

      const key = `${cleanPath(window.location.pathname)}${hash}`;
      if (key === lastResolved) return; // déjà rejointe

      if (!findSection(hash)) {
        if (tries < 50) timer = window.setTimeout(() => attempt(tries + 1), 60);
        return;
      }
      scrollToHash(hash, { duration: 950 });
    };

    const start = () => {
      // en changeant de page, une ancre déjà rejointe redevient à rejoindre
      const path = cleanPath(window.location.pathname);
      if (path !== lastPathSeen) {
        lastPathSeen = path;
        lastResolved = "";
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => attempt(0), 60);
    };

    start();
    window.addEventListener("locationchange", start);
    window.addEventListener("hashchange", start);
    if (document.fonts?.ready) document.fonts.ready.then(() => attempt(0));

    return () => {
      stopped = true;
      window.clearTimeout(timer);
      window.removeEventListener("locationchange", start);
      window.removeEventListener("hashchange", start);
    };
  }, []);
}

/* Alias : les pages n'ont plus rien à appeler, SiteNav suffit. */
export const useGlobalHashScroll = useHashScroll;

/* ------------------------------------------------------------------ */
/* Suivi du chemin courant                                             */
/* ------------------------------------------------------------------ */

/* La nav est souvent montée hors des Routes : elle ne se rerend pas
   quand le routeur change de page. On écoute donc l'historique. */
let patched = false;
function patchHistory() {
  if (patched || typeof window === "undefined") return;
  patched = true;
  for (const key of ["pushState", "replaceState"]) {
    const original = window.history[key];
    window.history[key] = function (...args) {
      const result = original.apply(this, args);
      window.dispatchEvent(new Event("locationchange"));
      return result;
    };
  }
  window.addEventListener("popstate", () =>
    window.dispatchEvent(new Event("locationchange"))
  );
}

export const cleanPath = (value) =>
  String(value || "/").split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";

export function usePathname() {
  const [path, setPath] = useState(() =>
    typeof window === "undefined" ? "/" : cleanPath(window.location.pathname)
  );

  useEffect(() => {
    patchHistory();
    const sync = () => setPath(cleanPath(window.location.pathname));
    sync();
    window.addEventListener("locationchange", sync);
    return () => window.removeEventListener("locationchange", sync);
  }, []);

  return path;
}

/* ------------------------------------------------------------------ */
/* Outils de lien                                                      */
/* ------------------------------------------------------------------ */

export const isInternal = (href) =>
  typeof href === "string" && (href.startsWith("/") || href.startsWith("#"));

/** "/#prestations" → { path: "/", hash: "#prestations" } */
export function splitHref(href) {
  const value = String(href || "");
  const index = value.indexOf("#");
  if (index === -1) return { path: cleanPath(value), hash: "" };
  const path = value.slice(0, index);
  return {
    path: path ? cleanPath(path) : null, // null = « la page courante »
    hash: value.slice(index),
  };
}

/* ------------------------------------------------------------------ */
/* CSS d'arrivée : une règle qui se trace, le contenu qui se pose      */
/* ------------------------------------------------------------------ */

export const ANCHOR_CSS = `
[data-section] { scroll-margin-top: calc(var(--nav-height, 80px) + var(--banner-height, 0px) + 16px); }
[data-section]:focus { outline: none; }

[data-section][data-arrived="true"] { position: relative; }
[data-section][data-arrived="true"]::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 1px;
  background: currentColor;
  pointer-events: none;
  transform-origin: left center;
  animation: anchor-rule 1100ms cubic-bezier(0.76, 0, 0.24, 1) both;
}
[data-section][data-arrived="true"] > * {
  animation: anchor-settle 800ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes anchor-rule {
  0%   { transform: scaleX(0); opacity: 0.35; }
  55%  { transform: scaleX(1); opacity: 0.35; }
  100% { transform: scaleX(1); opacity: 0; }
}
@keyframes anchor-settle {
  from { transform: translateY(14px); opacity: 0.55; }
  to   { transform: translateY(0); opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  [data-section][data-arrived="true"]::before,
  [data-section][data-arrived="true"] > * { animation: none !important; }
}`;
