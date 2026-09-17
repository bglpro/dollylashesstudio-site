import { useEffect, useState } from "react";
import { C, alpha, EASE, FONT } from "./theme";
import { scrollToAnchor } from "./anchorScroll";
import Seo from "./Seo";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$?/\\";
const SCRAMBLE_MS = 700;
const TICK_MS = 45;

export function scrambleAt(text, progress, random = Math.random) {
  const chars = [...text];
  const settled = Math.floor(Math.min(Math.max(progress, 0), 1) * chars.length);

  return chars
    .map((char, index) =>
      index < settled || char === " "
        ? char
        : GLYPHS[Math.floor(random() * GLYPHS.length)]
    )
    .join("");
}

function Scramble({ text }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setDisplay(text);
      return undefined;
    }

    // l'origine vient de la première image, et non de performance.now() :
    // les deux horloges n'ont pas la même origine
    let start = null;
    let last = 0;
    let raf = 0;

    const loop = (now) => {
      if (start === null) start = now;
      const elapsed = now - start;

      if (elapsed >= SCRAMBLE_MS) {
        setDisplay(text);
        return;
      }
      if (now - last >= TICK_MS) {
        last = now;
        setDisplay(scrambleAt(text, elapsed / SCRAMBLE_MS));
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [text]);

  return <span className="tabular-nums">{display}</span>;
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const NOT_FOUND_CSS = `
.nf-code { position: relative; }

/* Les deux calques décalés donnent le tremblement. L'original utilisait
   un rouge et un cyan de néon ; ici le bordeaux de la marque et le beige
   des bordures, sinon la page jure avec le reste du site. */
.nf-ghost {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transition: transform 150ms ${EASE.out}, opacity 150ms ${EASE.out};
}
.nf-code:hover .nf-ghost-a { transform: translateX(3px); opacity: 0.55; }
.nf-code:hover .nf-ghost-b { transform: translateX(-3px); opacity: 0.4; }

@media (prefers-reduced-motion: reduce) {
  .nf-ghost { display: none; }
}`;

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function NotFound({
  code = "404",
  title = "Cette page n'existe pas",
  description =
    "Le lien que vous avez suivi est peut-être ancien, ou l'adresse comporte une faute. Revenez à l'accueil, ou allez directement voir les prestations.",
  homeHref = "/",
  homeLabel = "Retour à l'accueil",
  browseHref = "/#prestations",
  browseLabel = "Voir les prestations",
}) {
  const onBrowse = (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey) return;
    // l'ancre n'existe que sur l'accueil : ailleurs, le lien navigue
    if (scrollToAnchor(browseHref, 0)) event.preventDefault();
  };

  return (
    <main
      className="flex w-full flex-col items-center justify-center gap-8 px-6 py-24 text-center"
      style={{ minHeight: "70svh", color: C.ink }}
    >
      {/* une page d'erreur ne doit jamais entrer dans l'index */}
      <Seo
        title="Page introuvable"
        description="Cette adresse ne correspond à aucune page du site."
        path="/404"
        noIndex
      />

      <style>{NOT_FOUND_CSS}</style>

      <div
        className="nf-code select-none leading-none tracking-tight"
        style={{
          fontFamily: FONT.display,
          fontWeight: 700,
          fontSize: "clamp(5rem, 18vw, 11rem)",
        }}
      >
        <span aria-hidden="true" className="nf-ghost nf-ghost-a" style={{ color: C.accent }}>
          <Scramble text={code} />
        </span>
        <span aria-hidden="true" className="nf-ghost nf-ghost-b" style={{ color: C.edge }}>
          <Scramble text={code} />
        </span>

        <h1 className="relative m-0" style={{ fontSize: "inherit" }}>
          <Scramble text={code} />
        </h1>
      </div>

      <div className="flex flex-col items-center gap-3">
        <p className="m-0 text-xl font-semibold">{title}</p>
        <p className="m-0 max-w-md text-base leading-relaxed" style={{ color: C.muted }}>
          {description}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href={homeHref}
          className="inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold transition-opacity hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 motion-reduce:transition-none"
          style={{ backgroundColor: C.ink, color: C.surface }}
        >
          {homeLabel}
        </a>

        <a
          href={browseHref}
          onClick={onBrowse}
          className="inline-flex h-11 items-center justify-center rounded-full border px-6 text-sm font-semibold transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 motion-reduce:transition-none"
          style={{ borderColor: C.edge, backgroundColor: C.surface, color: C.ink }}
        >
          {browseLabel}
        </a>
      </div>

      <p className="m-0 text-sm" style={{ color: alpha(C.ink, 0.45) }}>
        Besoin d'aide ?{" "}
        <a href="/contact" className="underline underline-offset-4">
          Écrivez-nous
        </a>
        .
      </p>
    </main>
  );
}
