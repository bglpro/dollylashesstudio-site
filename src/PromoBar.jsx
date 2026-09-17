import { C, alpha } from "./theme";
import { SITE } from "./config/site";

/* ------------------------------------------------------------------ */
/* Contenu par défaut                                                  */
/* ------------------------------------------------------------------ */

/** Calculé, jamais écrit en dur : le chiffre ne vieillit pas. */
export const yearsOfPractice = (since = SITE.since) =>
  Math.max(1, new Date().getFullYear() - since);

export const DEFAULT_ITEMS = [
  "L'art de l'extension de cils pensé avec précision",
  `${yearsOfPractice()} années d'expérience`,
  `Studio Privé à ${SITE.city}, sur rendez-vous`,
  "Une pose sur mesure, pensée pour chaque regard",
  "Formations certifiantes pour techniciennes",
];

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const PROMO_CSS = `
/* La piste contient deux copies de la liste : le décalage de la moitié de
   sa largeur ramène la seconde copie exactement là où la première
   commençait, et la boucle devient invisible. */
@keyframes promo-run {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.promo-track {
  display: flex;
  width: max-content;
  animation: promo-run var(--promo-duration, 42s) linear infinite;
}
.promo-bar:hover .promo-track { animation-play-state: paused; }

@media (prefers-reduced-motion: reduce) {
  .promo-track { animation: none !important; }
}`;

/** Losange fin entre deux phrases : plus discret qu'une étoile ou un point. */
const Diamond = () => (
  <span
    aria-hidden="true"
    className="mx-6 inline-block shrink-0 md:mx-10"
    style={{
      width: 6,
      height: 6,
      transform: "rotate(45deg)",
      backgroundColor: alpha(C.onAccent, 0.55),
    }}
  />
);

/* ------------------------------------------------------------------ */
/* Bande                                                               */
/* ------------------------------------------------------------------ */

export default function PromoBar({
  items = DEFAULT_ITEMS,
  duration = 42,
  background = C.accent,
  color = C.onAccent,
  label = "Le studio en quelques mots",
  className = "",
}) {
  if (!items.length) return null;

  // deux copies : la seconde n'existe que pour la continuité visuelle et
  // reste hors de l'arbre d'accessibilité
  const run = (hidden) => (
    <ul
      className="m-0 flex list-none items-center"
      aria-hidden={hidden || undefined}
    >
      {items.map((item) => (
        <li key={item} className="flex items-center">
          <span
            className="whitespace-nowrap text-[13px] font-medium uppercase tracking-[0.2em] md:text-[15px]"
            style={{ color }}
          >
            {item}
          </span>
          <Diamond />
        </li>
      ))}
    </ul>
  );

  return (
    <section
      aria-label={label}
            className={`promo-bar w-full overflow-hidden py-4 md:py-5 ${className}`}
      style={{
        backgroundColor: background,
        // deux filets très fins : la bande se détache des sections claires
        // sans prendre l'allure d'un bandeau publicitaire
        borderTop: `1px solid ${alpha(color, 0.18)}`,
        borderBottom: `1px solid ${alpha(color, 0.18)}`,
      }}
    >
      <style>{PROMO_CSS}</style>

      <div className="promo-track" style={{ "--promo-duration": `${duration}s` }}>
        {run(false)}
        {run(true)}
      </div>
    </section>
  );
}
