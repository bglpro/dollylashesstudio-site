import { useLayoutEffect, useRef } from "react";
import { C, FONT } from "./theme";
import {
  SECTION_SCREENS,
  computeBands,
  computeParagraph,
  findStickyBreaker,
  minScaleFor,
} from "./servicesRevealMath";

/* ------------------------------------------------------------------ */
/* Mot plein cadre                                                     */
/* ------------------------------------------------------------------ */

function WordMark({ word, fontWeight = 300, italic = true }) {
  return (
    <svg
      // l'italique penche vers la droite : un peu de marge dans la boîte
      // évite que la dernière lettre soit rognée
      viewBox="-10 0 1020 132"
      className="block h-auto w-full"
      role="img"
      aria-label={word}
    >
      <text
        x="500"
        y="115"
        textAnchor="middle"
        textLength="980"
        lengthAdjust="spacingAndGlyphs"
        fontSize="150"
        // même graisse et même famille que les lettres du hero :
        // la famille est héritée de la page, on ne la fixe pas
        fontWeight={fontWeight}
        fontStyle={italic ? "italic" : "normal"}
        letterSpacing="-2"
        fill="currentColor"
      >
        {word}
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function ServicesReveal({
  word = "SUR-MESURE",
  src = null, // ex. "/img/whatido.svg" pour utiliser votre propre visuel
  fontWeight = 700, // identique aux lettres du hero
  italic = false,
  copy =
  "Chaque regard est unique. Votre pose doit l’être aussi dans notre studio.\n" +
  "Chez DOLLYLASHESSTUDIO, chaque prestation est entièrement personnalisée selon vos envies. La morphologie de vos yeux et vos cils naturels sont également pris en compte afin de créer une pose harmonieuse.\n" +
  "Avant chaque rendez-vous, une courte consultation nous permet d’échanger sur vos attentes et de définir ensemble la prestation qui sublimera au mieux votre regard.",
  gap = 32,
}) {
  const sectionRef = useRef(null);
  const bandRefs = useRef([]);
  const textRef = useRef(null);
  const warned = useRef(false);

  useLayoutEffect(() => {
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const apply = () => {
      const viewportHeight = window.innerHeight;
      const text = textRef.current;

      if (reduced) {
        bandRefs.current.forEach((el) => {
          if (el) el.style.transform = "none";
        });
        if (text) {
          text.style.top = "auto";
          text.style.bottom = "8%";
          text.style.transform = "none";
          text.style.setProperty("--clip", "0%");
        }
        return;
      }

      const section = sectionRef.current;
      if (!section) return;

      const sectionTop = section.getBoundingClientRect().top;
      const minScale = minScaleFor(window.innerWidth);

      computeBands(sectionTop, viewportHeight, minScale).forEach((frame, i) => {
        const el = bandRefs.current[i];
        if (!el) return;
        el.style.transform = `translate3d(${frame.x}%, ${frame.y}%, 0) scale(${frame.scale})`;
      });

      if (text) {
        const bandHeight = bandRefs.current[1]
          ? bandRefs.current[1].offsetHeight
          : 0;
        const frame = computeParagraph(
          sectionTop,
          viewportHeight,
          bandHeight,
          minScale,
          gap
        );
        text.style.top = `${frame.top}px`;
        text.style.transform = `translate3d(0, ${frame.y}px, 0)`;
        text.style.setProperty("--clip", `${frame.clip}%`);
      }
    };

    // une seule lecture par frame, quel que soit le débit d'événements
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        apply();
      });
    };

    apply();

    if (!warned.current) {
      warned.current = true;
      const breaker = findStickyBreaker(sectionRef.current);
      if (breaker) {
        const name =
          breaker.tagName.toLowerCase() +
          (breaker.id ? `#${breaker.id}` : "") +
          (breaker.className ? `.${String(breaker.className).split(" ")[0]}` : "");
        console.warn(
          `[ServicesReveal] position:sticky est neutralisé par un ancêtre qui découpe le défilement : <${name}>. ` +
            "Retirez son overflow, ou remplacez overflow-x: hidden par overflow-x: clip."
        );
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [gap]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="services-word"
      style={{ height: `${SECTION_SCREENS * 100}svh` }}
      className="relative w-full"
    >
      <div
        style={{ height: "100svh" }}
        className="sticky top-0 flex w-full flex-col items-center justify-center overflow-hidden bg-white"
      >
        <h2 id="services-word" className="sr-only">
          {word}
        </h2>

        {[0, 1, 2].map((i) => (
          <div
            key={i}
            ref={(node) => {
              bandRefs.current[i] = node;
            }}
            aria-hidden="true"
            className="relative w-full bg-white px-4 md:px-8"
            style={{
              color: C.ink,
              zIndex: i === 1 ? 2 : 1,
              willChange: "transform",
              transform:
                i === 1 ? "translate3d(-100%, 0, 0)" : "translate3d(100%, 0, 0)",
            }}
          >
            {src ? (
              <img src={src} alt="" className="block h-auto w-full" />
            ) : (
              <WordMark word={word} fontWeight={fontWeight} italic={italic} />
            )}
          </div>
        ))}

        {/* le paragraphe monte depuis le bas de la scène, qui le rogne */}
        <p
          ref={textRef}
          className="absolute left-0 right-0 z-10 mx-auto max-w-3xl px-6 text-left hyphens-manual text-xl leading-relaxed md:text-justify md:text-2xl md:hyphens-auto"
          style={{
            color: C.edge,
            fontFamily: FONT.read,
            fontWeight: 300,
            top: "60%",
            transform: "translate3d(0, 100vh, 0)",
            willChange: "transform",
            "--clip": "100%",
            whiteSpace: "pre-line",
          }}
        >
          {copy}

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 px-6"
            style={{
              color: C.ink,
              whiteSpace: "pre-line",
              clipPath: "inset(0 0 var(--clip) 0)",
              willChange: "clip-path",
            }}
          >
            {copy}
          </span>
        </p>
      </div>
    </section>
  );
}
