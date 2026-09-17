import { C, alpha } from "./theme";
import { useInView } from "./useInView";
import { NavLink } from "./SiteNav";
import { LOGO_BLANC } from "./brandLogo";
import { SITE } from "./config/site";

const FOOTER_CSS = `
/* Le décalage vaut exactement deux fois la largeur d'un motif (10 px) :
   à la fin du cycle, le dessin retombe sur lui-même et la boucle est
   invisible. Un déplacement en pourcentage, lui, dépend de la largeur de
   l'écran et produit un saut au raccord. */
@keyframes footer-hatch {
  from { background-position-x: 0px; }
  to   { background-position-x: 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .footer-hatch { animation: none !important; }
}`;

const InstagramIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

const TikTokIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M16.5 3c.3 1.9 1.4 3.3 3.5 3.6v2.4c-1.3.1-2.6-.2-3.7-.9v5.6c0 4.6-4.4 7.3-8 5.2-2.5-1.5-3.1-5-1.2-7.3 1.2-1.5 3.1-2.1 5-1.7v2.6c-.4-.1-.8-.2-1.2-.1-1.3.1-2.2 1.3-2 2.6.2 1.2 1.4 2 2.6 1.8 1.1-.2 1.9-1.2 1.9-2.3V3h3.1z" />
  </svg>
);


const F = {
  text: C.surface,
  soft: alpha(C.surface, 0.72),
  border: alpha(C.surface, 0.28),
};

const DEFAULT_LINKS = [
  { label: "Formations", href: "/#formations" },
  { label: "Prestations", href: "/#prestations" },
  { label: "Ebook", href: "/#ebook" },
  { label: "FAQ", href: "/#faq" },
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Confidentialité", href: "/politique-de-confidentialite" },
  { label: "CGV", href: "/conditions-generales-de-vente" },
];

const DEFAULT_SOCIALS = [
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/dollylashesstudio/", Icon: InstagramIcon },
  { id: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@dollylashestudio", Icon: TikTokIcon },
];

function Reveal({ inView, delay = 0, className = "", children }) {
  return (
    <div
      className={`transition-all duration-500 ease-out motion-reduce:transition-none ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transitionDelay: inView ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}

export default function Footer({
  brand = SITE.name,
  logo = LOGO_BLANC,
  logoHeight = 44,
  links = DEFAULT_LINKS,
  socials = DEFAULT_SOCIALS,
}) {
  const [ref, inView] = useInView();

  return (
    // fond bordeaux : tout ce qui s'y pose passe en clair
    <footer
      className="w-full overflow-hidden py-12"
      style={{ backgroundColor: C.accent, color: F.text }}
    >
      <style>{FOOTER_CSS}</style>

      <div
        ref={ref}
        className="mx-auto mb-12 flex max-w-6xl flex-col items-center gap-10 px-4"
      >
        <Reveal inView={inView}>
          <NavLink
            href="/"
            aria-label={brand}
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ color: F.text }}
          >
            {logo ? (
              <img src={logo} alt={brand} className="w-auto" style={{ height: logoHeight }} />
            ) : (
              <span className="text-2xl font-semibold tracking-tight">{brand}</span>
            )}
          </NavLink>
        </Reveal>

        <Reveal inView={inView} delay={100}>
          <nav aria-label="Pied de page">
            <ul className="flex list-none flex-wrap justify-center gap-x-6 gap-y-3 text-base font-medium">
              {links.map((link) => (
                <li key={link.label}>
                  <NavLink
                    href={link.href}
                    className="rounded-md px-2 py-1 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
                    style={{ color: F.soft }}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>

        <Reveal inView={inView} delay={200}>
          <ul className="flex list-none items-center gap-3">
            {socials.map(({ id, label, href, Icon }) => (
              <li key={id}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
                  style={{ borderColor: F.border, color: F.text }}
                >
                  <Icon width="20" height="20" />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* bande hachurée */}
      <div
        aria-hidden="true"
        className="footer-hatch h-12 w-full border-y"
        style={{
          borderColor: F.border,
          opacity: 0.4,
          color: F.soft,
          backgroundImage:
            "repeating-linear-gradient(315deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)",
          backgroundSize: "10px 10px",
          // en boucle, et non une seule passe de 20 s au bout de laquelle
          // la bande se figeait
          animation: inView ? "footer-hatch 0.3s linear infinite" : "none",
        }}
      />

      <div
        className="mx-auto mt-8 max-w-6xl px-4 text-center text-sm"
        style={{ color: F.soft }}
      >
        <p>
          © {new Date().getFullYear()} {brand}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
