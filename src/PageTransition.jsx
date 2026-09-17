import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TRANSITION,
  TRANSITION_CSS,
  TransitionContext,
  coverRadius,
  pathOf,
  scrollToTarget,
  usePageTransition,
  viewportCenter,
} from "./pageTransitionCore";
import { LOGO_BLANC } from "./brandLogo";

/* ------------------------------------------------------------------ */
/* Lien qui déclenche la transition                                    */
/* ------------------------------------------------------------------ */

export function TransitionLink({ to, children, onClick: userOnClick, ...rest }) {
  const transition = usePageTransition();

  // onClick est extrait des props : sans ça, le {...rest} plus bas
  // remplaçait ce gestionnaire et le lien redevenait une ancre HTML
  // ordinaire — rechargement complet, aucune transition.
  const handleClick = (event) => {
    if (userOnClick) userOnClick(event);
    if (event.defaultPrevented) return;

    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0 ||
      rest.target === "_blank"
    ) {
      return; // laisse le navigateur ouvrir dans un nouvel onglet
    }
    if (!transition) return;
    event.preventDefault();

    // la tache naît sous le doigt ou le curseur. Au clavier, clientX vaut 0 :
    // on retombe alors sur le centre du lien, pas sur le coin de l'écran.
    const rect = event.currentTarget.getBoundingClientRect();
    const origin =
      event.clientX || event.clientY
        ? { x: event.clientX, y: event.clientY }
        : { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };

    transition.navigate(to, origin);
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Overlay                                                             */
/* ------------------------------------------------------------------ */

export default function PageTransition({
  children,
  brand = "DOLLYLASHESSTUDIO",
  logo = LOGO_BLANC,
  config = TRANSITION,
  // l'accueil n'est pas animé
  skip = (pathname) => pathOf(pathname) === "/",
}) {
  const location = useLocation();
  const navigate = useNavigate();

  // Un chargement direct ou une actualisation n'anime rien : la transition
  // accompagne un déplacement dans le site, pas l'arrivée du navigateur.
  const [phase, setPhase] = useState("idle");

  // La tache : centre et rayon.
  const [ink, setInk] = useState(() => {
    const center = viewportCenter();
    return { x: center.x, y: center.y, r: 0 };
  });

  const pending = useRef(null);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };

  const later = (fn, delay) => {
    timers.current.push(window.setTimeout(fn, delay));
  };

  useEffect(() => clearTimers, []);

  useEffect(() => {
    if (phase === "cover") {
      const raf = requestAnimationFrame(() =>
        setInk((current) => ({ ...current, r: coverRadius(current.x, current.y) }))
      );
      return () => cancelAnimationFrame(raf);
    }
    if (phase === "reveal") {
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() =>
          setInk((current) => ({ ...current, r: 0 }))
        );
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }
    return undefined;
  }, [phase]);

  useEffect(() => {
    if (phase !== "reveal") return undefined;
    const id = window.setTimeout(() => setPhase("idle"), config.contract + 600);
    return () => window.clearTimeout(id);
  }, [phase, config]);

  // si l'écran change de taille pendant que la tache couvre tout,
  // elle doit continuer de couvrir tout
  useEffect(() => {
    if (phase !== "cover" && phase !== "hold") return undefined;
    const onResize = () =>
      setInk((current) => ({ ...current, r: coverRadius(current.x, current.y) }));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [phase]);

  const go = useCallback(
    (to, origin) => {
      if (!to) return;

      const [targetPath, targetHash] = String(to).split("#");

      // ancre sur la page affichée : rien à faire ici, NavLink a déjà
      // lancé la glissade
      if (targetHash && (targetPath === "" || targetPath === location.pathname)) {
        return;
      }
      if (pathOf(to) === location.pathname && !targetHash) return;

      // pas d'animation vers l'accueil, ni si une transition est en cours
      if (skip(to) || phase === "cover" || phase === "hold") {
        navigate(to);
        // s'il y a une ancre, navigation.js la rejoindra en glissant
        if (!targetHash) requestAnimationFrame(scrollToTarget);
        return;
      }

      clearTimers();
      pending.current = to;

      const point = origin || viewportCenter();
      setInk({ x: point.x, y: point.y, r: 0 });
      setPhase("cover");

      later(() => setPhase("hold"), config.expand);
      later(() => {
        const destination = pending.current;
        navigate(destination);
        // pendant que l'écran est couvert : le visiteur ne voit pas le saut
        if (!String(destination).includes("#")) {
          requestAnimationFrame(scrollToTarget);
        }
        pending.current = null;
        // La page d'arrivée se monte à cet instant précis, et ce montage
        // occupe le fil principal — celui-là même qui anime le clip-path.
        // Lancer le retrait immédiatement lui faisait sauter des images.
        // On lui laisse le temps de se peindre, encore cachée.
        later(() => setPhase("reveal"), config.settle);
      }, config.expand + config.hold);
    },
    [location.pathname, navigate, phase, skip, config]
  );

  // retour arrière du navigateur ou arrivée directe : on se contente
  // de dévoiler la page
  const lastPath = useRef(location.pathname);
  useEffect(() => {
    if (lastPath.current === location.pathname) return undefined;
    lastPath.current = location.pathname;
    if (pending.current !== null) return undefined; // déjà géré par go()
    if (!location.hash) scrollToTarget();

    if (skip(location.pathname)) {
      setPhase("idle");
      return undefined;
    }

    const center = viewportCenter();
    setInk({ x: center.x, y: center.y, r: coverRadius(center.x, center.y) });
    setPhase("reveal");
    return undefined;
  }, [location.pathname, location.hash, skip, config]);

  const letters = [...brand];

  return (
    <TransitionContext.Provider value={{ navigate: go, phase }}>
      <style>{TRANSITION_CSS}</style>

      {phase !== "idle" ? (
        <div
          data-phase={phase}
          aria-hidden="true"
          className="pt-ink fixed inset-0 flex items-center justify-center px-6"
          onTransitionEnd={(event) => {
            // l'événement remonte aussi depuis le mot-symbole : on ne retient
            // que la fin du retrait de la tache elle-même
            if (
              phase === "reveal" &&
              event.target === event.currentTarget &&
              event.propertyName === "clip-path"
            ) {
              setPhase("idle");
            }
          }}
          style={{
            zIndex: 9998,
            backgroundColor: config.color,
            clipPath: `circle(${ink.r}px at ${ink.x}px ${ink.y}px)`,
            transitionProperty: "clip-path",
            transitionDuration: `${
              phase === "reveal" ? config.contract : config.expand
            }ms`,
            transitionTimingFunction:
              phase === "reveal" ? config.easeOut || config.ease : config.ease,
            // pendant la couverture, plus rien n'est cliquable dessous
            pointerEvents: phase === "reveal" ? "none" : "auto",
          }}
        >
          {logo ? (
            <img
              src={logo}
              alt={brand}
              className="pt-logo w-auto transition-opacity duration-300 motion-reduce:transition-none"
              style={{
                // assez grand pour se lire, jamais plus large que l'écran
                height: "clamp(64px, 14vh, 130px)",
                maxWidth: "70vw",
                opacity: phase === "hold" ? 1 : 0,
              }}
            />
          ) : (
            <p
              className="text-center text-2xl font-semibold uppercase tracking-[0.3em] transition-opacity duration-300 motion-reduce:transition-none md:text-4xl"
              style={{ color: config.ink, opacity: phase === "hold" ? 1 : 0 }}
            >
              {phase === "hold"
                ? letters.map((letter, i) => (
                    <span
                      key={`${letter}-${i}`}
                      className="pt-letter"
                      style={{ animationDelay: `${i * 28}ms` }}
                    >
                      {letter}
                    </span>
                  ))
                : null}
            </p>
          )}
        </div>
      ) : null}

      {children}
    </TransitionContext.Provider>
  );
}
