import { useEffect, useRef, useState } from "react";
import { C } from "./theme";
import { useInView } from "./useInView";
import { SITE } from "./config/site";
import { STUDIO_IMAGES } from "./assets/images";

const LEMON_SCRIPT = "https://assets.lemonsqueezy.com/lemon.js";

function useLemonSqueezy(enabled) {
  const [ready, setReady] = useState(
    () => typeof window !== "undefined" && !!window.createLemonSqueezy
  );

  useEffect(() => {
    if (!enabled || ready || typeof document === "undefined") return undefined;

    const existing = document.querySelector(`script[src="${LEMON_SCRIPT}"]`);
    const script = existing || document.createElement("script");
    const onLoad = () => {
      if (window.createLemonSqueezy) window.createLemonSqueezy();
      setReady(true);
    };

    script.addEventListener("load", onLoad);
    if (!existing) {
      script.src = LEMON_SCRIPT;
      script.defer = true;
      document.body.appendChild(script);
    } else if (window.createLemonSqueezy) {
      onLoad();
    }

    return () => script.removeEventListener("load", onLoad);
  }, [enabled, ready]);

  return ready;
}

export default function EbookBanner({
  eyebrow = "Ebook",
  title = "Comprenez vos poses. Maîtrisez vos résultats.",
  text = "Le Code des Cils est un guide de 15 pages pour apprendre à analyser vos poses, comprendre vos résultats et prendre de meilleures décisions techniques.",
  price = "69.99 €",
  actionText = "Acheter l'ebook",
  checkoutUrl = SITE.ebookCheckout,
  imageUrl = STUDIO_IMAGES.find((image) => image.id === "ebook").src,
  imageAlt = STUDIO_IMAGES.find((image) => image.id === "ebook")?.alt,
  background = C.line,
}) {
  const ready = useLemonSqueezy(true);
  const [ref, inView] = useInView();
  const linkRef = useRef(null);

  return (
    <section
      ref={ref}
      aria-labelledby="ebook-title"
      // 100vw inclut la barre de défilement verticale : la section dépassait
      // d'une quinzaine de pixels et créait un défilement horizontal.
      // Le parent occupe déjà toute la largeur, w-full suffit.
      className="relative w-full"
      style={{ backgroundColor: background }}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-12 md:grid-cols-2 md:gap-12 md:px-10 md:py-0">
        {/* --- visuel --- */}
        <div
          className="order-2 flex justify-center transition-all duration-700 ease-out motion-reduce:transition-none md:order-1 md:justify-start"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <img
            src={imageUrl}
            alt={imageAlt}
            loading="lazy"
            className="w-full max-w-sm object-contain md:max-w-md"
            style={{ maxHeight: 340 }}
          />
        </div>

        {/* --- texte et achat --- */}
        <div
          className="order-1 py-2 transition-all duration-700 ease-out motion-reduce:transition-none md:order-2 md:py-16"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
            transitionDelay: inView ? "120ms" : "0ms",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/50">
            {eyebrow}
          </p>

          <h2
            id="ebook-title"
            className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-black md:text-4xl"
            style={{ fontFamily: "Melodrama, sans-serif" }}
          >
            {title}
          </h2>

          <p className="mt-4 max-w-lg text-base leading-relaxed text-black/70">{text}</p>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <a
              ref={linkRef}
              href={checkoutUrl}
              // lemon.js intercepte ce clic et ouvre la fenêtre superposée
              className={`lemonsqueezy-button inline-flex items-center rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] transition-opacity hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none`}
              style={{ backgroundColor: C.accent, color: background }}
              data-lemon-ready={ready ? "true" : "false"}
              // sans le script, le lien ouvre la page de paiement normalement
              target={ready ? undefined : "_blank"}
              rel={ready ? undefined : "noopener noreferrer"}
            >
              {actionText}
            </a>

            <p className="text-sm text-black/60">
              <span className="font-semibold text-black">{price}</span> · téléchargement
              immédiat
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
