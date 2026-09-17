import { useLayoutEffect, useRef } from "react";
import { EASE } from "./theme";

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

export const HEADING_CSS = `
.ah-word { display: inline-block; white-space: nowrap; }
.ah-char {
  display: inline-block;
  opacity: 0;
  transform: translateX(100px) skewX(20deg);
  will-change: transform, opacity;
  transition-property: transform, opacity;
  transition-duration: var(--ah-duration, 650ms);
  /* équivalent du power3.out de GSAP */
  transition-timing-function: ${EASE.soft};
}
.ah[data-play="1"] .ah-char { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  .ah-char {
    opacity: 1 !important;
    transform: none !important;
    transition-duration: 1ms !important;
    transition-delay: 0ms !important;
  }
}`;

/* ------------------------------------------------------------------ */
/* Découpage                                                           */
/* ------------------------------------------------------------------ */

export function assignDelays(
  chars,
  stagger = 50,
  delay = 0,
  { tolerance = 6, sequential = false, lineGap = -450, duration = 650 } = {}
) {
  const sorted = [...chars].sort((a, b) => a.offsetTop - b.offsetTop);

  // regroupement par proximité verticale : deux caractères d'une même ligne
  // diffèrent de quelques pixels selon la hauteur de leur glyphe, alors
  // qu'un changement de ligne fait un saut d'au moins une interligne
  const lines = [];
  sorted.forEach((char) => {
    const current = lines[lines.length - 1];
    if (current && char.offsetTop - current.top <= tolerance) current.chars.push(char);
    else lines.push({ top: char.offsetTop, chars: [char] });
  });

  const result = [];
  let base = delay;

  lines.forEach((line) => {
    line.chars.forEach((char, index) => {
      const value = base + index * stagger;
      char.style.transitionDelay = `${value}ms`;
      result.push(value);
    });

    // en mode séquentiel, la ligne suivante attend que celle-ci soit posée ;
    // sinon toutes repartent du même point et arrivent ensemble
    base = sequential
      ? base + (line.chars.length - 1) * stagger + duration + lineGap
      : delay;
  });

  return result;
}

/* ------------------------------------------------------------------ */
/* Titre animé                                                         */
/* ------------------------------------------------------------------ */

export default function AnimatedHeading({
  parts = [],
  as: Tag = "h1",
  play = true,
  delay = 0,
  stagger = 50,
  duration = 650,
  // true : chaque ligne attend la fin de la précédente
  sequential = false,
  lineGap = -450,
  className = "",
  style,
}) {
  const ref = useRef(null);

  const plain = parts.map((part) => part.text).join("");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (!play) {
      el.dataset.play = "0";
      return undefined;
    }

    const chars = Array.from(el.querySelectorAll(".ah-char"));
    assignDelays(chars, stagger, delay, { sequential, lineGap, duration });

    // l'état de départ doit avoir été peint, sinon le navigateur passe
    // directement à l'état final sans animer
    const raf = requestAnimationFrame(() => {
      if (ref.current) ref.current.dataset.play = "1";
    });
    return () => cancelAnimationFrame(raf);
  }, [play, delay, stagger, plain, sequential, lineGap, duration]);

  let key = 0;

  return (
    <Tag
      ref={ref}
      className={`ah ${className}`}
      data-play="0"
      style={{ ...style, "--ah-duration": `${duration}ms` }}
    >
      {/* texte intact pour les lecteurs d'écran : le découpage en
          caractères rendrait la lecture inaudible */}
      <span className="sr-only">{plain}</span>

      <span aria-hidden="true">
        {parts.map((part, partIndex) =>
          part.text.split(" ").map((word, wordIndex, words) => {
            const chars = [
              ...word,
              ...(wordIndex < words.length - 1 ? [" "] : []),
            ];
            return (
              <span
                key={`${partIndex}-${wordIndex}`}
                className="ah-word"
                style={part.bold ? { fontWeight: 700 } : undefined}
              >
                {chars.map((char) => (
                  <span key={(key += 1)} className="ah-char">
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </span>
            );
          })
        )}
      </span>
    </Tag>
  );
}
