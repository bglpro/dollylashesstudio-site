import { useEffect, useState } from "react";
import { C, EASE } from "./theme";
import { LOGO_BLANC, LOGO_ROUGE } from "./brandLogo";
import { STUDIO_IMAGES } from "./assets/images";
import { HERO_SCHEDULE } from "./heroTiming";
import AnimatedHeading, { HEADING_CSS } from "./AnimatedHeading";
import HeroCard from "./HeroCard";
import { SITE } from "./config/site";

/* ------------------------------------------------------------------ */
/* Contenu par défaut                                                  */
/* ------------------------------------------------------------------ */

const FIDELITE = STUDIO_IMAGES.find((image) => image.id === "fidelite");

/** Le titre, découpé pour que la partie en gras reste modifiable. */
const DEFAULT_PARTS = [
  { text: "Magnifier votre regard " },
  { text: "un cil à la fois", bold: true },
];

/** Bouton d'appel du hero. */
const DEFAULT_CTA = { label: "Réserver une prestation", href: SITE.booking };

const DEFAULT_SINCE = "Depuis 2019";

const DEFAULT_MAIN = {
  src: FIDELITE?.src,
  alt: FIDELITE?.alt || "Carte de fidélité DollyLashesStudio",
};

/* ------------------------------------------------------------------ */
/* Feuille de style de la scène                                        */
/* ------------------------------------------------------------------ */

const HERO_CSS = `
.hero {
  --hero-duration: 1000ms;
  --hero-ease: ${EASE.out};
  /* le logo garde la même taille du début à la fin : c'est sa position
     qui change, pas son échelle */
  --hero-logo-w: 15vw;
  --hero-logo-top: 62%;
  /* le bloc central remonte un peu : la signature reprend la place que le
     logo occupait avant de partir en haut */
  --hero-center-top: 46%;
  --hero-logo-top-end: calc(var(--nav-height, 72px) + 3vh);
    --hero-fade: var(--hero-duration);
  /* le rectangle est centré sur --hero-main-top, au-dessus du logo :
     sa base doit rester plus haute que le haut du bloc titre */
  --hero-main-w: 260px;
  --hero-main-h: clamp(220px, 38svh, 360px);
  --hero-main-top: 36%;
  /* zoom lent une fois l'image déployée */
  --hero-zoom: 1.08;
  --hero-zoom-duration: 6000ms;
}

.hero-logo,
.hero-title,
.hero-main,
.hero-main-media {
  transition-duration: var(--hero-duration);
  transition-timing-function: var(--hero-ease);
}

/* --- logo du titre ---
   Le cache reprend le geste des lettres : le logo monte depuis le bas.
   Le déplacement latéral des deux mots n'a plus lieu d'être, il ne reste
   que la montée puis la mise à l'échelle. */
.hero-title {
  position: absolute;
  z-index: 3; /* toujours au-dessus de l'image, à toutes les phases */
  top: var(--hero-logo-top);
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  /* deux propriétés, deux rythmes : le bloc remonte d'abord, le fondu
     ne commence qu'une fois arrivé en haut */
    transition-property: top, opacity;
    transition-duration: var(--hero-duration), var(--hero-fade);
    transition-delay: 0ms, 0ms;
  opacity: 1;
  overflow: hidden;
}
/* en phase 3, il rejoint le haut du cadre puis disparaît en fondu */
.hero[data-stage="3"] .hero-title {
  top: var(--hero-logo-top-end);
  opacity: 0;
}

.hero-logo {
  display: block;
  width: var(--hero-logo-w);
  height: auto;
  transform: translateY(110%);
  transition-property: transform;
}
.hero[data-stage="1"] .hero-logo,
.hero[data-stage="2"] .hero-logo,
.hero[data-stage="3"] .hero-logo { transform: translateY(0); }

/* bascule du logo noir au logo blanc, quand l'image occupe l'écran */
.hero-logo-dark, .hero-logo-light {
  display: block;
  width: 100%;
  height: auto;
  transition: opacity var(--hero-duration) var(--hero-ease);
}
.hero-logo-light { position: absolute; inset: 0; opacity: 0; }
/* la bascule vers le blanc se joue pendant la montée, tant que le logo
   est encore visible sur l'image */
.hero[data-stage="3"] .hero-logo-dark { opacity: 0; }
.hero[data-stage="3"] .hero-logo-light { opacity: 1; }

/* --- titre de la page ---
   Il arrive en même temps que l'image plein écran, donc en blanc sur la
   photo. Police à empattements : le contraste avec le sans-serif du reste
   du site donne au hero son caractère. */
/* --- bloc central : titre puis bouton --- */
.hero-center {
  position: absolute;
  z-index: 2;
  top: var(--hero-center-top);
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(90vw, 60rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(1.25rem, 3.5vh, 2.25rem);
  text-align: center;
}

/* Police à empattements : le contraste avec le sans-serif du reste du site
   donne au hero son caractère. */
.hero-heading,
.hero-since {
  margin: 0;
  color: #fff;
  font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  font-weight: 400;
  text-shadow: 0 2px 24px rgba(15, 13, 12, 0.35);
}

.hero-heading {
  width: 100%;
  line-height: 1.08;
  letter-spacing: -0.01em;
  font-size: clamp(1.9rem, 5vw, 4.25rem);
  pointer-events: none;
}

/* --- bas du cadre : signature puis indicateur de défilement --- */
.hero-bottom {
  position: absolute;
  z-index: 2;
  left: 0;
  right: 0;
  bottom: clamp(1rem, 3vh, 2.5rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.6rem, 1.6vh, 1rem);
  opacity: 0;
  transform: translateY(14px);
  transition: opacity var(--hero-duration) var(--hero-ease),
              transform var(--hero-duration) var(--hero-ease);
}
.hero[data-stage="3"] .hero-bottom {
  opacity: 1;
  transform: none;
  transition-delay: 700ms;
}

.hero-since {
  font-size: clamp(1rem, 1.6vw, 1.35rem);
  letter-spacing: 0.04em;
}

/* --- indicateur : deux chevrons qui descendent l'un après l'autre --- */
.hero-scroll {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  line-height: 0;
}
.hero-scroll:hover { opacity: 0.75; }
.hero-chevron {
  display: block;
  animation: hero-chevron 1.9s cubic-bezier(0.45, 0, 0.2, 1) infinite;
}
.hero-chevron + .hero-chevron { margin-top: -5px; animation-delay: 0.22s; }

@keyframes hero-chevron {
  0%   { opacity: 0; transform: translateY(-5px); }
  35%  { opacity: 1; }
  70%  { opacity: 1; transform: translateY(5px); }
  100% { opacity: 0; transform: translateY(9px); }
}

/* --- apparition du bouton, avec le reste --- */
.hero-cta {
  opacity: 0;
  transform: translateY(14px);
  transition: opacity var(--hero-duration) var(--hero-ease),
              transform var(--hero-duration) var(--hero-ease);
}
.hero[data-stage="3"] .hero-cta { opacity: 1; transform: none; transition-delay: 550ms; }

/* --- carte du studio ---
   Sous 1024 px, elle reste dans le flux du bloc bas : elle se pose entre
   le titre et la signature, centrée, et pousse le reste vers le bas.
   Au-delà, elle se détache et retourne dans l'angle inférieur gauche. */
.hero-card {
  z-index: 2;
  width: min(92vw, 23rem);
  opacity: 0;
  transform: translateY(18px);
  transition: opacity var(--hero-duration) var(--hero-ease),
              transform var(--hero-duration) var(--hero-ease);
  transition-delay: 400ms;
}
.hero[data-stage="3"] .hero-card { opacity: 1; transform: none; }

/* sur téléphone, la carte doit rester compacte : la vidéo rétrécit et les
   étiquettes disparaissent, sinon le bloc bas remonte sur le titre */
@media (max-width: 1023px) {
  .hero-card { padding: 0.625rem; border-radius: 16px; }
  .hero-card video { width: 4.5rem; height: 4.5rem; }
  .hero-card ul { display: none; }
  .hero-card p { font-size: 11px; }
}

@media (min-width: 1024px) {
  .hero-card {
    position: absolute;
    left: 2rem;
    bottom: 2rem;
  }
}

/* --- image ---/* --- image ---
   Petit rectangle centré à l'ouverture, plein écran en phase 3.
   On anime la largeur et la hauteur : le centrage par translate reste
   valable à toutes les tailles, sans recalcul. */
.hero-main {
  position: absolute;
  z-index: 1;
  top: var(--hero-main-top);
  left: 50%;
  width: var(--hero-main-w);
  height: var(--hero-main-h);
  transform: translate(-50%, -50%);
  overflow: hidden;
  transition-property: width, height, top;
}
/* plein écran : le rectangle reprend le centre exact du cadre */
.hero[data-stage="3"] .hero-main { top: 50%; width: 101%; height: 101%; }

.hero-main-media {
  transform: scale(0.5);
  clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%);
  transition-property: clip-path, transform;
}
.hero[data-stage="2"] .hero-main-media {
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  transform: scale(1);
}

/* Phase 3 : l'image continue de grandir lentement, bien après que le
   rectangle a fini de s'ouvrir. Les deux propriétés n'ont donc pas la même
   durée — l'ordre des valeurs suit celui de transition-property. */
.hero[data-stage="3"] .hero-main-media {
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  transform: scale(var(--hero-zoom));
  transition-duration: var(--hero-duration), var(--hero-zoom-duration);
  transition-timing-function: var(--hero-ease), linear;
}

/* --- tablette --- */
@media (max-width: 1024px) {
  .hero {
    --hero-logo-w: 26vw;
    --hero-logo-top: 58%;
    --hero-center-top: 44%;
    --hero-main-h: clamp(200px, 34svh, 320px);
    --hero-main-top: 32%;
  }
}

.hero-overlay {
  opacity: 0;
  transition: opacity var(--hero-duration) var(--hero-ease);
}

.hero[data-stage="3"] .hero-overlay {
  opacity: 1;
}

/* --- mobile --- */
@media (max-width: 767px) {
  .hero {
    --hero-logo-w: 42vw;
    --hero-logo-top: 58%;
    --hero-center-top: 42%;
    --hero-main-w: min(70vw, 260px);
    --hero-main-h: clamp(170px, 28svh, 260px);
    --hero-main-top: 28%;
  }
}

/* --- accessibilité : pas d'animation d'entrée --- */
@media (prefers-reduced-motion: reduce) {
  .hero *, .hero *::before, .hero *::after {
    transition-duration: 1ms !important;
    transition-delay: 0ms !important;
  }
  .hero-chevron { animation: none !important; opacity: 1 !important; }
  /* pas de zoom permanent non plus */
  .hero { --hero-zoom: 1; }
}`;

/**
 * Hauteur d'arrêt de la section suivante, mesurée sur le site.
 *
 * Valeur négative = on dépasse le haut de la section, ce qui est voulu :
 * la section « pose de cils » est une scène collante de trois écrans, il
 * faut entrer un peu dedans pour que son animation démarre. Sur téléphone,
 * elle tient déjà à l'écran, on s'arrête donc pile sur son bord.
 *
 *   téléphone  → 0    (mesuré : -2)
 *   ordinateur → -90  (mesuré : -90)
 */
export const SCROLL_STOP = { mobile: 0, desktop: -90, breakpoint: 768 };

export function navOffset(stop = SCROLL_STOP) {
  if (typeof window === "undefined") return 0;
  return window.innerWidth < stop.breakpoint ? stop.mobile : stop.desktop;
}

/** Chevron de l'indicateur de défilement. */
const Chevron = () => (
  <svg
    className="hero-chevron"
    width="26"
    height="14"
    viewBox="0 0 26 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="2 3 13 11 24 3" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export default function Hero({
  brand = SITE.name,
  logo = LOGO_ROUGE,
  logoLight = LOGO_BLANC,
  parts = DEFAULT_PARTS,
  cta = DEFAULT_CTA,
  since = DEFAULT_SINCE,
  nextAnchor = "#pose-de-cils",
  // Hauteur à laquelle la section suivante doit s'arrêter, en pixels
  // comptés depuis le haut de l'écran. Un nombre, ou une fonction si la
  // valeur dépend de l'écran. Par défaut : juste sous l'en-tête collant.
  nextOffset = navOffset,
  main = DEFAULT_MAIN,
  // undefined = carte par défaut, un objet pour la régler, null pour la retirer
  card,
}) {
  const [stage, setStage] = useState(0);

  // l'indicateur fait glisser jusqu'à la section suivante
  const goNext = (event) => {
    const target = document.querySelector(nextAnchor);
    if (!target) return; // sans cible, l'ancre agit normalement
    event.preventDefault();

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // scrollIntoView ne sait pas viser une hauteur : on calcule la
    // position absolue de la cible, puis on retire le décalage voulu
    const offset = typeof nextOffset === "function" ? nextOffset() : nextOffset;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: Math.max(0, Math.round(top)),
      behavior: reduced ? "auto" : "smooth",
    });
  };

  useEffect(() => {
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      const id = window.setTimeout(() => setStage(3), 0);
      return () => window.clearTimeout(id);
    }

    const timers = [
      window.setTimeout(() => setStage(1), HERO_SCHEDULE.phase1),
      window.setTimeout(() => setStage(2), HERO_SCHEDULE.phase2),
      window.setTimeout(() => setStage(3), HERO_SCHEDULE.phase3),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, []);

  // La navigation flotte sur le hero : elle doit passer en blanc au moment
  // précis où l'image sombre arrive derrière elle, pas avant — le fond est
  // blanc pendant les deux premières phases.
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("hero-cover", { detail: { covered: stage === 3 } })
    );
    return () => {
      window.dispatchEvent(
        new CustomEvent("hero-cover", { detail: { covered: false } })
      );
    };
  }, [stage]);

  return (
    <header
      className="hero relative w-full overflow-hidden"
      data-stage={stage}
      style={{
        // le hero se glisse SOUS l'en-tête : marge négative de sa hauteur,
        // et on ne retranche plus que la bannière. L'image passe donc
        // derrière la navigation au lieu de commencer en dessous.
        height: "calc(100lvh - var(--banner-height, 0px))",
        marginTop: "calc(-1 * var(--nav-height, 0px))",
        minHeight: 540,
        backgroundColor: C.surface,
      }}
    >
      <style>{`${HEADING_CSS}\n${HERO_CSS}`}</style>

      {/* --- image : rectangle centré, puis plein écran --- */}
      <div className="hero-main">
        <img
          className="hero-main-media h-full w-full object-cover"
          src={main.src || main.poster}
          alt={main.alt}
          // plus grande image de la page une fois déployée : elle ne doit pas
          // être différée, c'est elle qui fixe le temps d'affichage perçu
          fetchPriority="high"
          decoding="async"
        />
        <div className="hero-overlay absolute inset-0 bg-black/60" /> //Overlay pour assombrir l'image et faire ressortir le texte
      </div>

      {/* --- bloc central : titre révélé lettre par lettre, puis bouton --- */}
      <div className="hero-center">
        <AnimatedHeading
          parts={parts}
          className="hero-heading"
          play={stage === 3}
          delay={200}
          // la seconde ligne n'entre qu'une fois la première posée
          sequential
          lineGap={220}
        />

        {cta ? (
          <a
            href={cta.href}
            target={cta.href.startsWith("http") ? "_blank" : undefined}
            rel={cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="hero-cta inline-flex items-center rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ backgroundColor: "#fff", color: "#171412" }}
          >
            {cta.label}
          </a>
        ) : null}
      </div>

      {/* --- bas du cadre : signature puis indicateur de défilement --- */}
      <div className="hero-bottom">
        {card === null ? null : (
          <HeroCard card={card} className="hero-card" anchorOffset={-40} />
        )}

        {since ? <p className="hero-since">{since}</p> : null}

        {nextAnchor ? (
          <a
            href={nextAnchor}
            onClick={goNext}
            aria-label="Aller à la section suivante"
            className="hero-scroll transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
          >
            <Chevron />
            <Chevron />
          </a>
        ) : null}
      </div>

      {/* --- marque : le logo, monté derrière son cache --- */}
      <div className="hero-title m-0">
        {logo ? (
          <span className="hero-logo relative block">
            <img src={logo} alt={brand} className="hero-logo-dark" />
            {/* même logo en clair : il prend le relais une fois l'image
                déployée, sinon le noir devient illisible sur la photo */}
            {logoLight ? (
              <img src={logoLight} alt="" aria-hidden="true" className="hero-logo-light" />
            ) : null}
          </span>
        ) : (
          <span className="hero-logo text-center text-[12vw] font-light leading-none">
            {brand}
          </span>
        )}
      </div>

    </header>
  );
}
