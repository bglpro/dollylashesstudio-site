import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Révélations au défilement                                           */
/* ------------------------------------------------------------------ */
/* Équivalents locaux de TimelineContent et VerticalCutReveal, écrits
   avec IntersectionObserver + CSS : aucune dépendance à installer,
   et le même vocabulaire d'animation que le menu (même courbe). */

export const REVEAL_CSS = `
.rv {
  opacity: 0;
  filter: blur(10px);
  transform: translateY(-16px);
  transition: opacity 620ms ease-out, filter 620ms ease-out,
              transform 620ms cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}
.rv[data-from="up"]    { transform: translateY(24px); }
.rv[data-from="still"] { transform: none; }
.rv[data-shown="true"] { opacity: 1; filter: blur(0); transform: none; }

.rv-cut { display: inline-block; overflow: hidden; vertical-align: bottom; }
.rv-cut > span {
  display: inline-block;
  transform: translateY(110%);
  transition: transform 900ms cubic-bezier(0.16, 1, 0.3, 1);
}
.rv-cut[data-shown="true"] > span { transform: translateY(0); }

@media (prefers-reduced-motion: reduce) {
  .rv, .rv-cut > span { transition-duration: 1ms !important; }
  .rv { filter: none; }
}`;

/** Injecte la feuille une seule fois, quel que soit le nombre d'appels. */
export function RevealStyles() {
  return <style>{REVEAL_CSS}</style>;
}

function useInView(options) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return [ref, shown];
}

/**
 * Bloc qui se pose à l'entrée dans le champ.
 * `delay` en secondes, pour rester proche de l'API d'origine (i * 0.1).
 */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  from = "down",
  className = "",
  style,
  children,
  ...rest
}) {
  const [ref, shown] = useInView();
  return (
    <Tag
      ref={ref}
      className={`rv ${className}`}
      data-shown={shown ? "true" : "false"}
      data-from={from}
      style={{ transitionDelay: `${delay}s`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * Titre dont chaque mot remonte depuis sous une ligne de coupe.
 * C'est la signature typographique de la page : à réserver aux titres.
 */
export function CutReveal({
  children,
  className = "",
  stagger = 0.07,
  delay = 0,
  ...rest
}) {
  const [ref, shown] = useInView({ threshold: 0.4 });
  const words = String(children).split(" ");

  return (
    <span ref={ref} className={className} {...rest}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span
            className="rv-cut"
            data-shown={shown ? "true" : "false"}
            style={{ transitionDelay: `${delay + index * stagger}s` }}
            aria-hidden="true"
          >
            <span style={{ transitionDelay: `${delay + index * stagger}s` }}>
              {word}
            </span>
          </span>
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
      <span className="sr-only">{children}</span>
    </span>
  );
}
