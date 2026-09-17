import { C, alpha } from "./theme";
import { scrollToAnchor } from "./anchorScroll";
import { SITE } from "./config/site";

const DEFAULT_CARD = {
  title: `Studio privé à ${SITE.city}`,
  text: "Extension de cil - Formations professionnelles - Ebooks",
  badges: [`Depuis ${SITE.since}`, SITE.region],
  video: "/videos/extension-cil-meaux.mp4",
  poster:
    "",
  videoLabel: "Aperçu d'une pose au studio",
  primary: { label: "Réserver", href: SITE.booking },
  secondary: { label: "Les prestations", href: "/#prestations" },
};

const Action = ({ link, filled, offset = 0 }) => {
  const external = link.href.startsWith("http");

  // ancre présente sur la page : on défile à la hauteur voulue au lieu de
  // laisser le navigateur sauter au ras de la section
  const onClick = (event) => {
    if (external || event.metaKey || event.ctrlKey || event.shiftKey) return;
    if (scrollToAnchor(link.href, link.offset ?? offset)) event.preventDefault();
  };

  return (
    <a
      href={link.href}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="inline-flex items-center rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
      style={
        filled
          ? { backgroundColor: C.accent, color: C.surface }
          : {
              color: C.surface,
              backgroundColor: alpha(C.surface, 0.12),
              boxShadow: `inset 0 0 0 1px ${alpha(C.surface, 0.2)}`,
            }
      }
    >
      {link.label}
    </a>
  );
};

export default function HeroCard({
  card = DEFAULT_CARD,
  // hauteur d'arrêt des liens d'ancre de la carte, en pixels depuis le haut
  // de l'écran ; négatif = on entre dans la section
  anchorOffset = 0,
  className = "",
  style,
}) {
  if (!card) return null;

  return (
    <aside
      aria-label="Le studio en bref"
      className={`flex items-start gap-3 p-3 ${className}`}
      style={{
        width: "23rem",
        borderRadius: 18,
        backgroundColor: "rgba(15,13,12,0.55)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${alpha(C.surface, 0.16)}`,
        ...style,
      }}
    >
      <video
        className="h-24 w-20 shrink-0 object-cover"
        style={{ borderRadius: 12 }}
        src={card.video}
        poster={card.poster}
        autoPlay
        muted
        loop
        playsInline
        aria-label={card.videoLabel}
      />

      <div className="min-w-0 flex-1">
        {/* h2 : le h1 du hero reste le message principal */}
        <h2 className="text-sm font-semibold leading-tight text-white">
          {card.title}
        </h2>

        <p className="mt-1 text-[11px] leading-snug text-white/65">{card.text}</p>

        {/*{card.badges?.length ? (
          <ul className="mt-2 flex list-none flex-wrap gap-1.5">
            {card.badges.map((badge) => (
              <li
                key={badge}
                className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white/75"
                style={{ backgroundColor: alpha(C.surface, 0.1) }}
              >
                {badge}
              </li>
            ))}
          </ul>
        ) : null}*/}

        <div className="mt-3 flex flex-wrap gap-2">
          {card.primary ? (
            <Action link={card.primary} offset={anchorOffset} filled />
          ) : null}
          {card.secondary ? (
            <Action link={card.secondary} offset={anchorOffset} />
          ) : null}
        </div>
      </div>
    </aside>
  );
}
