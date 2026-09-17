import { useCallback, useEffect, useRef, useState } from "react";
import { TransitionLink } from "./PageTransition";
import { C, alpha, EASE, DUR } from "./theme";
import {
  ANCHOR_CSS,
  cleanPath,
  isInternal,
  scrollToHash,
  splitHref,
  useHashScroll,
  usePathname,
} from "./navigation";
import { DEFAULT_MENU, coverRadius } from "./siteNavMenu";
import { LOGO_BLANC, LOGO_ROUGE } from "./brandLogo";
import { SITE, BOOKING_CTA, SOCIAL_LINKS } from "./config/site";

/* ------------------------------------------------------------------ */
/* Lien de navigation                                                  */
/* ------------------------------------------------------------------ */

/**
 * Un seul composant décide de tout :
 *   externe            → <a target="_blank">
 *   ancre, même page   → glissade animée, sans rechargement
 *   autre page         → TransitionLink (le hash est conservé, la page
 *                        d'arrivée le rejoue via useHashScroll)
 */
export function NavLink({
  href,
  scrollDelay = 0,
  onBefore,
  children,
  ...rest
}) {
  const pathname = usePathname();

  if (!isInternal(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onBefore}
        {...rest}
      >
        {children}
      </a>
    );
  }

  const { path, hash } = splitHref(href);
  const targetPath = path ?? pathname;
  const samePage = Boolean(hash) && cleanPath(targetPath) === pathname;

  if (samePage) {
    const onClick = (event) => {
      event.preventDefault();
      if (onBefore) onBefore();
      // sur mobile, on laisse d'abord la tache d'encre se refermer
      if (scrollDelay) window.setTimeout(() => scrollToHash(hash), scrollDelay);
      else scrollToHash(hash);
    };
    return (
      <a href={hash} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  const to = `${targetPath}${hash}`;
  // Attention : TransitionLink pose son propre onClick puis répand {...rest}.
  // Un onClick passé ici l'écraserait — et le lien redeviendrait une simple
  // ancre HTML, sans rideau. On passe donc par la phase de capture.
  const extra = onBefore ? { onClickCapture: onBefore } : {};
  return (
    <TransitionLink to={to} {...extra} {...rest}>
      {children}
    </TransitionLink>
  );
}

/** Conservé pour les cartes de la page d'accueil. */
export function CardLink({ href, ...props }) {
  return <NavLink href={href} {...props} />;
}

/* ------------------------------------------------------------------ */
/* Icônes                                                              */
/* ------------------------------------------------------------------ */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const IconCaret = ({ open }) => (
  // enveloppe de taille fixe : le glyphe ne participe plus au calcul de la
  // hauteur de ligne, il ne peut donc plus décaler l'entrée qui le porte
  <span
    aria-hidden="true"
    className="inline-flex h-[7px] w-[10px] shrink-0 items-center justify-center"
  >
    <svg
      width="10"
      height="7"
      viewBox="0 0 24 15"
      className="block transition-transform duration-200 motion-reduce:transition-none"
      style={{ transform: open ? "rotate(180deg)" : "none" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 15c-.3 0-.6-.1-.8-.4l-11-13C-.2 1.2-.1.5.3.2c.4-.4 1.1-.3 1.4.1L12 12.5 22.2.4c.4-.4 1-.5 1.4-.1.4.4.5 1 .1 1.4l-11 13c-.1.2-.4.3-.7.3z"
        fill="currentColor"
      />
    </svg>
  </span>
);

const IconCalendar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.6" {...stroke}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

const IconArrow = ({ back }) => (
  <svg
    width="16"
    height="12"
    viewBox="0 0 14 10"
    aria-hidden="true"
    style={{ transform: back ? "rotate(180deg)" : "none" }}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.537.808a.5.5 0 01.817-.162l4 4a.5.5 0 010 .708l-4 4a.5.5 0 11-.708-.708L11.793 5.5H1a.5.5 0 010-1h10.793L8.646 1.354a.5.5 0 01-.109-.546z"
      fill="currentColor"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Styles du tiroir                                                    */
/* ------------------------------------------------------------------ */

const NAV_CSS = `
:root { --nav-pad: 16px; --nav-pad-sm: 12px; }
@media (min-width: 768px) { :root { --nav-pad: 26px; --nav-pad-sm: 14px; } }

@keyframes nav-fade-in { from { opacity: 0; } to { opacity: 1; } }
.nav-fade { animation: nav-fade-in 200ms linear both; }

/* --- entrées du menu horizontal ---
   toutes les entrées sont des boîtes flex de hauteur identique : plus aucune
   ne peut flotter au-dessus ou au-dessous des autres, avec ou sans chevron */
.nav-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  line-height: 1;
  font-size: 0.875rem;
  font-weight: 500;
  transition: opacity 200ms ease;
}
.nav-item:hover { opacity: 0.6; }
@media (prefers-reduced-motion: reduce) { .nav-item { transition: none; } }

/* --- bouton rond, déformation au survol --- */
.nav-toggle {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-radius 500ms ${EASE.inOut},
              background-color 500ms ${EASE.inOut},
              color 500ms ${EASE.inOut};
}
.nav-toggle:hover { border-radius: 48% 52% 42% 58% / 55% 44% 56% 45%; }
@media (min-width: 640px) { .nav-toggle { width: 52px; height: 52px; } }

.nav-toggle__lines { display: flex; flex-direction: column; align-items: center; gap: 5px; }
.nav-toggle__line {
  display: block;
  height: 1.5px;
  border-radius: 2px;
  background: currentColor;
  transition: width 500ms ${EASE.inOut},
              transform 500ms ${EASE.inOut},
              opacity 400ms ${EASE.inOut};
}
.nav-toggle__line:nth-child(1) { width: 18px; }
.nav-toggle__line:nth-child(2) { width: 11px; }
.nav-toggle__line:nth-child(3) { width: 15px; }

/* ouvert : les trois traits deviennent un signe plus */
[data-menu-open="true"] .nav-toggle__line:nth-child(1) { width: 18px; transform: translateY(6.5px) rotate(-90deg); }
[data-menu-open="true"] .nav-toggle__line:nth-child(2) { width: 18px; }
[data-menu-open="true"] .nav-toggle__line:nth-child(3) { opacity: 0; transform: translateY(-2px); }

/* --- tache d'encre --- */
.ink-menu {
  transition: clip-path 800ms ${EASE.inOut};
  will-change: clip-path;
}
.ink-link { transition: transform 600ms ${EASE.inOut}, opacity 500ms ease-out; }
.ink-text { transition: transform 600ms ${EASE.inOut}; }
.ink-row:hover .ink-text, .ink-row:focus-within .ink-text { transform: translateY(-1.15em); }

/* au-delà de 1024px, ni bouton ni menu plein écran : uniquement le logo,
   le menu horizontal et le bouton Réserver */
@media (min-width: 1024px) {
  .nav-toggle, .ink-menu { display: none !important; }
}

@media (prefers-reduced-motion: reduce) {
  .ink-menu, .ink-link, .ink-text, .nav-toggle, .nav-toggle__line { transition-duration: 1ms !important; }
  .nav-fade { animation-duration: 1ms !important; }
}`;

/* ------------------------------------------------------------------ */
/* Menu déroulant (ordinateur)                                         */
/* ------------------------------------------------------------------ */

/** Couleur du panneau déroulant quand l'en-tête flotte sur le hero. */
export const OVERLAY_PANEL = "#000"; // couleur noir fonce comme le bg

function DesktopMenu({ items, overlay = false, panelColor = OVERLAY_PANEL }) {
  // sur le hero, un panneau blanc tranchait brutalement avec l'image
  // sombre : il prend la couleur du thème, et son texte s'inverse
  // nommé panelStyle et non panel : panelRef.current porte déjà ce nom
  // plus bas, pour l'élément du DOM
  const panelStyle = {
    background: overlay ? panelColor : "#fff",
    border: overlay ? alpha(C.surface, 0.18) : C.line,
    title: overlay ? C.surface : C.ink,
    item: overlay ? alpha(C.surface, 0.72) : C.muted,
  };

  const [openIndex, setOpenIndex] = useState(null);
  const closeTimer = useRef(null);
  const navRef = useRef(null);
  const panelRef = useRef(null);

  // Fermeture pilotée par la position du curseur, et non par mouseleave.
  // Entre le bouton et le panneau, le curseur traverse le rembourrage de
  // l'en-tête : il quitte alors le <nav> et le menu se refermait en plein
  // trajet. On vérifie plutôt s'il se trouve encore dans la zone du menu,
  // couloir compris.
  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenIndex(null), 260);
  };

  const close = () => {
    cancelClose();
    setOpenIndex(null);
  };

  useEffect(() => cancelClose, []);

  useEffect(() => {
    if (openIndex === null) return undefined;

    const inside = (x, y) => {
      const nav = navRef.current;
      const panel = panelRef.current;
      if (!nav) return false;

      const n = nav.getBoundingClientRect();
      const p = panel ? panel.getBoundingClientRect() : null;
      const pad = 8;

      const inNav =
        x >= n.left - pad && x <= n.right + pad && y >= n.top - pad && y <= n.bottom + pad;
      const inPanel =
        !!p && x >= p.left && x <= p.right && y >= p.top - pad && y <= p.bottom + pad;
      // couloir entre le bas du menu et le haut du panneau
      const inCorridor =
        !!p && y >= n.bottom - pad && y <= p.top + pad && x >= p.left && x <= p.right;

      return inNav || inPanel || inCorridor;
    };

    const onMove = (event) => {
      if (inside(event.clientX, event.clientY)) cancelClose();
      else scheduleClose();
    };

    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, [openIndex]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <nav
      aria-label="Navigation principale"
      className="hidden lg:block"
      ref={navRef}
    >
      <ul className="flex list-none items-center gap-7">
        {items.map((item, index) => {
          const hasChildren = Array.isArray(item.children) && item.children.length > 0;
          const open = openIndex === index;

          if (!hasChildren) {
            return (
              <li key={item.label} className="flex items-center">
                <NavLink
                  href={item.href}
                  onBefore={close}
                  className="nav-item focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  {item.label}
                </NavLink>
              </li>
            );
          }

          return (
            <li
              key={item.label}
              className="static flex items-center"
              onMouseEnter={() => {
                cancelClose();
                setOpenIndex(index);
              }}
            >
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`submenu-${index}`}
                onClick={() => setOpenIndex(open ? null : index)}
                onFocus={() => {
                  cancelClose();
                  setOpenIndex(index);
                }}
                className="nav-item focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                {item.label}
                <IconCaret open={open} />
              </button>

              <div
                id={`submenu-${index}`}
                hidden={!open}
                ref={open ? panelRef : undefined}
                onClickCapture={(event) => {
                  if (event.target.closest("a")) close();
                }}
                className="nav-fade absolute inset-x-0 top-full border-t px-8 pb-8 shadow-sm transition-colors duration-500 motion-reduce:transition-none"
                style={{
                  backgroundColor: panelStyle.background,
                  borderColor: panelStyle.border,
                }}
              >
                {/* passerelle invisible : elle recouvre le rembourrage de
                    l'en-tête pour que le curseur ne quitte jamais le menu */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-full block"
                  style={{ height: 32 }}
                />

                <ul className="mx-auto grid max-w-6xl list-none grid-cols-2 gap-8 pt-8 md:grid-cols-4">
                  {item.children.map((group) => (
                    <li key={group.label}>
                      <NavLink
                        href={group.href}
                        className="text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        style={{ color: panelStyle.title }}
                      >
                        {group.label}
                      </NavLink>
                      {group.children ? (
                        <ul className="mt-3 list-none space-y-2">
                          {group.children.map((child) => (
                            <li key={child.label}>
                              <NavLink
                                href={child.href}
                                className="text-sm transition-opacity hover:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 motion-reduce:transition-none"
                                style={{ color: panelStyle.item }}
                              >
                                {child.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Menu plein écran, révélé par une tache d'encre                      */
/* ------------------------------------------------------------------ */


const MENU_BG = C.surface;
const MENU_FG = C.ink;
const MENU_ACCENT = C.accent;
const MENU_SOFT = alpha(C.ink, 0.55);
const MENU_LINE = alpha(C.ink, 0.12);

/* durée de repli de la tache : la glissade démarre juste après */
const INK_CLOSE_MS = 480;

/* L'entrée par le haut est une mise en scène de premier chargement.
   Une fois jouée, la nav doit être là immédiatement sur toutes les pages
   suivantes, même si la page continue de passer un revealDelay. */
let introPlayed = false;

function InkMenu({ open, onClose, items, cta, socials, originRef }) {
  const [mounted, setMounted] = useState(false);
  const [circle, setCircle] = useState({ cx: 0, cy: 0, r: 0 });
  const [stack, setStack] = useState([]);
  const panelRef = useRef(null);

  const measure = useCallback(() => {
    const button = originRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const rect = button
      ? button.getBoundingClientRect()
      : { left: width - 60, top: 30, width: 56, height: 56 };
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return { cx, cy, r: coverRadius(cx, cy, width, height) };
  }, [originRef]);

  // Ouverture en deux temps. Le rayon ne peut pas être agrandi dans le même
  // effet que le montage : les rAF seraient programmés avant que l'élément
  // n'existe, il naîtrait déjà déployé et la transition ne jouerait pas.
  useEffect(() => {
    if (open) {
      const next = measure();
      setCircle({ cx: next.cx, cy: next.cy, r: 0 });
      setMounted(true);
      return undefined;
    }
    setCircle((current) => ({ ...current, r: 0 }));
    const id = window.setTimeout(() => {
      setMounted(false);
      setStack([]);
    }, 800);
    return () => window.clearTimeout(id);
  }, [open, measure]);

  // second temps : l'élément est peint avec un rayon nul, on peut l'étendre
  useEffect(() => {
    if (!open || !mounted) return undefined;
    const raf = requestAnimationFrame(() => {
      if (panelRef.current) panelRef.current.getBoundingClientRect(); // reflow
      setCircle(measure());
    });
    return () => cancelAnimationFrame(raf);
  }, [open, mounted, measure]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    const onResize = () => setCircle(measure());
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (panelRef.current) panelRef.current.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = previous;
    };
  }, [open, onClose, measure]);

  if (!mounted) return null;

  const current = stack.length ? stack[stack.length - 1] : null;
  const list = current ? current.children : items;

  // Filet de sécurité : quel que soit le type de lien rendu (ancre interne
  // ou TransitionLink), tout clic sur un lien referme le tiroir.
  const closeOnLink = (event) => {
    if (event.target.closest("a")) onClose();
  };

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      data-ink-open={open ? "true" : "false"}
      onClickCapture={closeOnLink}
      className="ink-menu fixed inset-0 flex flex-col overflow-y-auto px-6 pb-10 focus:outline-none lg:hidden"
      style={{
        zIndex: 40,
        backgroundColor: MENU_BG,
        color: MENU_FG,
        paddingTop: "calc(var(--banner-height, 0px) + 110px)",
        pointerEvents: open ? "auto" : "none",
        clipPath: `circle(${circle.r}px at ${circle.cx}px ${circle.cy}px)`,
      }}
    >
      {current ? (
        <button
          type="button"
          onClick={() => setStack((s) => s.slice(0, -1))}
          className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <IconArrow back />
          {current.label}
        </button>
      ) : null}

      <ul key={stack.length} className="nav-fade list-none">
        {current ? (
          <li style={{ borderColor: MENU_LINE }} className="border-t">
            <NavLink
              href={current.href}
              scrollDelay={INK_CLOSE_MS}
              className="block py-4 text-sm uppercase tracking-[0.16em] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              style={{ color: MENU_SOFT }}
            >
              Tout voir
            </NavLink>
          </li>
        ) : null}

        {list.map((node, index) => {
          const hasChildren = Array.isArray(node.children) && node.children.length > 0;
          const label = node.label;
          const num = String(index + 1).padStart(2, "0");
          const deep = stack.length > 0;

          // le masque doit faire exactement une ligne du texte affiché :
          // sa taille de police est donc portée par le masque lui-même,
          // sinon « 1em » vaut 16px et coupe un titre de 40px
          const size = deep ? "clamp(1.4rem, 6vw, 2rem)" : "clamp(2rem, 9vw, 3rem)";

          const inner = (
            <span className="grid w-full grid-cols-[46px_1fr] items-center gap-4 py-3 text-left">
              <span
                className="text-xs tracking-[0.12em]"
                style={{ color: MENU_SOFT }}
              >
                {num}
              </span>

              <span
                className="block overflow-hidden"
                style={{ fontSize: size, height: "1.15em", lineHeight: 1.15 }}
              >
                <span className="ink-text block">
                  <span className="block font-semibold uppercase tracking-tight">
                    {label}
                  </span>
                  <span
                    className="block italic tracking-tight"
                    style={{ color: MENU_ACCENT }}
                  >
                    {label}
                  </span>
                </span>
              </span>
            </span>
          );

          return (
            <li
              key={`${stack.length}-${label}`}
              className="ink-row overflow-hidden border-t last:border-b"
              style={{ borderColor: MENU_LINE }}
            >
              <span
                className="ink-link block"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? "translateY(0)" : "translateY(40px)",
                  transitionDelay: open
                    ? `${(deep ? 0 : 450) + index * 60}ms`
                    : "0ms",
                }}
              >
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={() => setStack((s) => [...s, node])}
                    aria-label={`Ouvrir ${label}`}
                    className="w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    {inner}
                  </button>
                ) : (
                  <NavLink
                    href={node.href}
                    scrollDelay={INK_CLOSE_MS}
                    className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    {inner}
                  </NavLink>
                )}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto pt-10">
        {cta ? (
          <a
            href={cta.href}
            target={cta.href.startsWith("http") ? "_blank" : undefined}
            rel={cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="flex w-full items-center justify-center rounded-full px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            style={{ backgroundColor: C.accent, color: "#fff" }}
          >
            {cta.label}
          </a>
        ) : null}

        {socials.length ? (
          <div className="mt-6 flex items-center gap-5">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-[0.14em] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                style={{ color: MENU_SOFT }}
              >
                {social.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* En-tête                                                             */
/* ------------------------------------------------------------------ */

export default function SiteNav({
  brand = SITE.name,
  logo = LOGO_ROUGE,
  // version claire, utilisée tant que l'en-tête flotte sur le hero sombre
  overlayLogo = LOGO_BLANC,
  overlayPaths = ["/"],
  // couleur du panneau déroulant tant que l'en-tête flotte sur le hero
  panelColor = OVERLAY_PANEL,
  logoHeight = "clamp(32px, 9vw, 40px)",
  menu = DEFAULT_MENU,
  cta = BOOKING_CTA,
  socials = SOCIAL_LINKS,
  transparent = true,
  revealDelay = 0,
}) {
  const pathname = usePathname();

  // L'entrée par le haut est une mise en scène d'accueil. Ailleurs, la nav
  // est là dès la première image — quoi que la page passe comme revealDelay.
  const delay = pathname === "/" && !introPlayed ? revealDelay : 0;

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [revealed, setRevealed] = useState(delay === 0);
  // vrai quand le hero annonce que son image couvre l'écran
  const [heroCover, setHeroCover] = useState(false);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);

  // arrivée sur une ancre depuis une autre page : la nav étant montée
  // partout, elle est le bon endroit pour surveiller le hash
  useHashScroll();

  useEffect(() => {
    const onCover = (event) => setHeroCover(!!event.detail?.covered);
    window.addEventListener("hero-cover", onCover);
    return () => window.removeEventListener("hero-cover", onCover);
  }, []);

  // si le délai change, l'entrée doit être rejouée
  const [lastDelay, setLastDelay] = useState(delay);
  if (lastDelay !== delay) {
    setLastDelay(delay);
    setRevealed(delay === 0);
  }

  useEffect(() => {
    if (delay === 0) {
      introPlayed = true;
      return undefined;
    }
    const id = window.setTimeout(() => {
      setRevealed(true);
      introPlayed = true;
    }, delay);
    return () => window.clearTimeout(id);
  }, [delay]);

  useEffect(() => {
    const onCover = (event) => setHeroCover(!!event.detail?.covered);
    window.addEventListener("hero-cover", onCover);
    return () => window.removeEventListener("hero-cover", onCover);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // la hauteur réelle de l'en-tête est publiée : le hero s'en sert pour
  // occuper l'écran restant, et la glissade pour ne pas passer dessous
  useEffect(() => {
    const el = headerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const publish = () => {
      document.documentElement.style.setProperty(
        "--nav-height",
        `${el.offsetHeight}px`
      );
    };
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const solid = !transparent || scrolled || drawerOpen;

  // sur les pages dont le hero occupe le haut de l'écran, l'en-tête flotte
  // sur l'image tant qu'on n'a pas défilé : il passe alors en blanc
  // blanc seulement quand le hero annonce que son image couvre l'écran
  const overlay = !solid && overlayPaths.includes(pathname) && heroCover;
  const ink = overlay ? C.surface : C.ink;

  return (
    <>
      <style>{NAV_CSS + ANCHOR_CSS}</style>

      <header
        ref={headerRef}
        data-menu-open={drawerOpen ? "true" : "false"}
        data-solid={solid ? "true" : "false"}
        data-compact={scrolled ? "true" : "false"}
        className="sticky z-50 w-full border-b transition-[background-color,transform,border-color,padding] duration-500 ease-out motion-reduce:transition-none"
        style={{
          top: "var(--banner-height, 0px)",
          color: ink,
          transitionDelay: drawerOpen ? "300ms" : "400ms",
          backgroundColor: drawerOpen
            ? "transparent"
            : solid
            ? alpha(C.surface, 0.92)
            : "transparent",
          backdropFilter: solid && !drawerOpen ? "blur(10px)" : "none",
          borderColor: solid && !drawerOpen ? C.line : "transparent",
          transform: revealed ? "translateY(0)" : "translateY(-120%)",
          // rétrécit au défilement, sans jamais devenir une barre étroite
          paddingTop: scrolled ? "var(--nav-pad-sm)" : "var(--nav-pad)",
          paddingBottom: scrolled ? "var(--nav-pad-sm)" : "var(--nav-pad)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-5 md:gap-4 md:px-8">
          {/* --- logo à gauche --- */}
          <div className="flex flex-1 items-center gap-2">
            <button
              ref={toggleRef}
              type="button"
              aria-label={drawerOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen((value) => !value)}
              className="nav-toggle shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 lg:hidden"
              style={{ backgroundColor: "transparent", color: ink }}
            >
              <span className="nav-toggle__lines" aria-hidden="true">
                <span className="nav-toggle__line" />
                <span className="nav-toggle__line" />
                <span className="nav-toggle__line" />
              </span>
            </button>

            <NavLink
              href="/"
              onBefore={() => setDrawerOpen(false)}
              aria-label={brand}
              className="flex items-center transition-opacity hover:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 motion-reduce:transition-none"
            >
              {logo ? (
                <img
                  src={overlay && overlayLogo ? overlayLogo : logo}
                  alt={brand}
                  className="w-auto"
                  style={{ height: logoHeight }}
                />
              ) : (
                // repli si le fichier de logo n'est pas trouvé
                <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                  {brand}
                </span>
              )}
            </NavLink>
          </div>

          {/* --- menu au centre --- */}
          <DesktopMenu items={menu} overlay={overlay} panelColor={panelColor} />

          {/* --- réservation à droite --- */}
          <div className="flex flex-1 items-center justify-end">
            {/* Version icône. Pour revenir au bouton texte, commentez ce
                bloc et décommentez celui du dessous. */}
            <a
              href={cta.href}
              target={cta.href.startsWith("http") ? "_blank" : undefined}
              rel={cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={cta.label}
              title={cta.label}
              aria-hidden={drawerOpen}
              tabIndex={drawerOpen ? -1 : 0}
              className="flex h-11 w-11 items-center justify-center rounded-full transition-opacity duration-300 hover:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 motion-reduce:transition-none"
              style={{
                color: ink,
                // le menu plein écran propose déjà son propre bouton
                opacity: drawerOpen ? 0 : 1,
                pointerEvents: drawerOpen ? "none" : "auto",
              }}
            >
              <IconCalendar />
            </a>

            {/* --- ancien bouton texte, conservé au cas où ---
            <a
              href={cta.href}
              target={cta.href.startsWith("http") ? "_blank" : undefined}
              rel={cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-hidden={drawerOpen}
              tabIndex={drawerOpen ? -1 : 0}
              className="inline-flex items-center rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-opacity duration-300 hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 motion-reduce:transition-none sm:px-5 sm:py-2.5 sm:text-xs sm:tracking-[0.14em] md:px-6"
              style={{
                backgroundColor: C.ink,
                color: "#fff",
                opacity: drawerOpen ? 0 : 1,
                pointerEvents: drawerOpen ? "none" : "auto",
              }}
            >
              {cta.label}
            </a>
            --- */}
          </div>
        </div>
      </header>

      <InkMenu
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={menu}
        socials={socials}
        cta={cta}
        originRef={toggleRef}
      />
    </>
  );
}
