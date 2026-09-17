import { useState } from "react";
import { C, FONT } from "./theme";
import { TransitionLink } from "./PageTransition";
import { isInternal } from "./navigation";
import { FORMATION_IMAGESS } from "./assets/images";

/* ------------------------------------------------------------------ */
/* Contenu par défaut                                                  */
/* ------------------------------------------------------------------ */

const DEFAULT_ITEMS = [
  {
    id: "cil-a-cil-debutante",
    title: "Cours classique débutante",
    category: "Kit offert",
    price: "550 €",
    duration: "2 jours",
    href: "/formations/cil-a-cil-debutante",
    src: `${FORMATION_IMAGESS.find((img) => img.id === "cours-classique-debutante")?.src}`,
    alt: "Kit de formation cil à cil pour débutantes",
  },
  {
    id: "volumes",
    title: "Les volumes",
    category: "Perfectionnement",
    price: "650 €",
    duration: "2 jours",
    href: "/formations/volumes",
    src: `${FORMATION_IMAGESS.find((img) => img.id === "les-volumes")?.src}`,
    alt: "Trays de cils volume alignés",
  },
  {
    id: "cil-a-cil-et-volumes",
    title: "Cil à cil et volumes",
    category: "Cours complet",
    price: "770 €",
    duration: "3 jours",
    href: "/formations/cil-a-cil-et-volumes",
    src: `${FORMATION_IMAGESS.find((img) => img.id === "livret")?.src}`,
    alt: "Cils premade en U pour un rendu wispy",
  },
  {
    id: "coaching-prive",
    title: "Coaching privé",
    category: "Sur mesure",
    price: "200 €",
    duration: "1 journée",
    href: "/formations/coaching-prive",
    src: `${FORMATION_IMAGESS.find((img) => img.id === "creation-contenu")?.src}`,
    alt: "Séance de perfectionnement en pose de cils",
  },
  {
    id: "creation-de-contenu",
    title: "Création de contenu",
    category: "Réseaux Sociaux",
    price: "260 €",
    duration: "1 journée",
    href: "/formations/creation-de-contenu",
    src: `${FORMATION_IMAGESS.find((img) => img.id === "coaching-prive")?.src}`,
    alt: "Tournage d'un contenu beauté au studio",
  },
];

/* ------------------------------------------------------------------ */
/* Styles qui ne s'expriment pas en classes Tailwind standard          */
/* ------------------------------------------------------------------ */

const GALLERY_CSS = `
.elastic-track { height: 500px; }
@media (min-width: 768px) { .elastic-track { height: 600px; } }
.elastic-panel {
  transition: flex 700ms cubic-bezier(0.25, 1, 0.5, 1),
              filter 700ms cubic-bezier(0.25, 1, 0.5, 1);
}
.elastic-vertical { writing-mode: vertical-rl; }
@media (prefers-reduced-motion: reduce) {
  .elastic-panel, .elastic-panel * { transition-duration: 1ms !important; }
}`;

const ArrowUpRight = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

function CardLink({ href, ...props }) {
  if (isInternal(href)) return <TransitionLink to={href} {...props} />;
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
}

/* ------------------------------------------------------------------ */
/* Galerie                                                             */
/* ------------------------------------------------------------------ */

export default function ElasticGallery({
  items = DEFAULT_ITEMS,
  title = "Nos formations",
  subtitle = "Des techniques filmées en gros plan, à suivre à votre rythme.",
  cta = "Voir la formation",
}) {
  const [selectedId, setActiveId] = useState(null);

  // le panneau central sert de valeur par défaut, et de repli si la liste
  // change et que la sélection courante n'existe plus
  const fallbackId = items[Math.floor(items.length / 2)]?.id ?? null;
  const activeId = items.some((item) => item.id === selectedId)
    ? selectedId
    : fallbackId;

  return (
    <section className="w-full py-12 md:py-24" aria-labelledby="formations-title">
      <style>{GALLERY_CSS}</style>

      <div className="mx-auto mb-8 max-w-6xl px-4 md:mb-12">
        <h2
          id="formations-title"
          className="text-4xl font-semibold"
          style={{ color: C.accent, fontFamily: FONT.display, fontWeight: 500 }}
        >
          {title}
        </h2>
        <p className="mt-4 text-lg" style={{ color: C.muted }}>
          {subtitle}
        </p>
      </div>

      <ul className="elastic-track mx-auto flex w-full max-w-6xl list-none flex-col gap-2 px-4 md:flex-row md:gap-4">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              className="elastic-panel relative overflow-hidden border"
              style={{
                flex: isActive ? "4 1 0%" : "1 1 0%",
                filter: isActive ? "brightness(1)" : "brightness(0.55)",
                borderRadius: 22,
                borderColor: C.line,
                backgroundColor: C.ink,
              }}
            >
              {/* --- couches visuelles, non cliquables --- */}
              <div className="pointer-events-none absolute inset-0">
                <img
                  src={item.src}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-1000 ease-out motion-reduce:transition-none"
                  style={{ transform: isActive ? "scale(1)" : "scale(1.1)" }}
                />
                <div
                  className="absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none"
                  style={{
                    opacity: isActive ? 1 : 0,
                    backgroundImage:
                      "linear-gradient(to top, rgba(25,21,18,0.85) 0%, rgba(25,21,18,0.25) 45%, rgba(25,21,18,0) 100%)",
                  }}
                />
              </div>

              {/* le padding bas réserve la place du lien posé par-dessus */}
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-end px-4 pb-16 pt-4 md:px-8 md:pb-24 md:pt-8">
                {/* contenu déplié */}
                <div
                  className="flex flex-col items-start gap-2 transition-all duration-500 motion-reduce:transition-none"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(48px)",
                    transitionDelay: isActive ? "200ms" : "0ms",
                  }}
                >
                  <span
                    className="rounded-full border px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-white md:px-3"
                    style={{
                      borderColor: "rgba(255,255,255,0.3)",
                      backgroundColor: "rgba(255,255,255,0.12)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {item.category}
                  </span>

                  <h3 className="text-2xl font-semibold leading-tight tracking-tight text-white md:text-4xl">
                    {item.title}
                  </h3>

                  <p className="text-sm text-white/80">
                    {item.price}
                    {item.duration ? ` · ${item.duration}` : ""}
                  </p>
                </div>

              </div>

              {/* Titre du panneau replié.
                  Calque à part, enfant direct du panneau : il ne dépend plus
                  du conteneur au padding de 64 px qui servait à réserver la
                  place du lien, et se centre donc dans tout le rectangle. */}
              <div
                className="pointer-events-none absolute inset-0 grid place-items-center px-3 transition-opacity duration-500 motion-reduce:transition-none"
                style={{
                  opacity: isActive ? 0 : 1,
                  transitionDelay: isActive ? "0ms" : "400ms",
                }}
              >
                <span className="elastic-vertical hidden whitespace-nowrap text-lg font-semibold tracking-wide text-white md:block">
                  {item.title}
                </span>

                {/* sur mobile les vignettes repliées sont de fines bandes :
                    un voile garantit le contraste sur photo claire */}
                <span
                  className="rounded-full px-3 py-1 text-center text-sm font-semibold text-white md:hidden"
                  style={{ backgroundColor: "rgba(25,21,18,0.55)" }}
                >
                  {item.title}
                </span>
              </div>

              {/* --- zone de sélection : survol, focus clavier, tap --- */}
              <button
                type="button"
                aria-expanded={isActive}
                onMouseEnter={() => setActiveId(item.id)}
                onFocus={() => setActiveId(item.id)}
                onClick={() => setActiveId(item.id)}
                className="absolute inset-0 z-10 h-full w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
                style={{ borderRadius: 22 }}
              >
                <span className="sr-only">
                  {`Afficher la formation ${item.title} — ${item.category}, ${item.price}`}
                </span>
              </button>

              {/* --- lien réel, au-dessus de la zone de sélection --- */}
              <CardLink
                href={item.href}
                tabIndex={isActive ? 0 : -1}
                aria-hidden={!isActive}
                className="absolute bottom-4 left-4 z-20 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-opacity duration-500 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none md:bottom-8 md:left-8"
                style={{
                  backgroundColor: "#ffffff",
                  color: C.ink,
                  opacity: isActive ? 1 : 0,
                  pointerEvents: isActive ? "auto" : "none",
                  transitionDelay: isActive ? "300ms" : "0ms",
                }}
              >
                {cta}
                <ArrowUpRight className="h-4 w-4" />
              </CardLink>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
