import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { C } from "./theme";
import { BRAND_PRESTATION } from "./assets/images";
import { SITE } from "./config/site";

/* ------------------------------------------------------------------ */
/* Tokens                                                              */
/* ------------------------------------------------------------------ */

const BASE_WIDTH = 400; // largeur d'une slide sur desktop
const GAP = 20; // espace entre deux slides
const RATIO = 660 / 400; // ratio du média vidéo
const CARD_HEIGHT = 100; // hauteur réservée à la carte produit
const RADIUS = 22; // arrondi du média

const CLAMP2 = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

/* ------------------------------------------------------------------ */
/* Données                                                             */
/* ------------------------------------------------------------------ */

const SLIDES = [
  {
    id: "pose-wispy",
    video: "/videos/prestations/pose-wispy.mp4",
    poster: "/images/prestations/pose-wispy.webp",
    caption: "Un effet aérien et texturé mêlant différentes longueurs pour un regard tendance et déstructuré.",
    product: {
      title: "POSE — WISPY SET",
      price: "90 €",
      image: BRAND_PRESTATION.brandred.src,
      url: SITE.booking,
    },
  },
  {
    id: "pose-wet-set",
    video: "/videos/prestations/pose-wet-set.mp4",
    poster: "/images/prestations/pose-wet-set.webp",
    caption: "Un effet « cils mouillés » fin, graphique et défini pour un regard intense sans surcharge.",
    product: {
      title: "POSE — WET SET",
      price: "90 €",
      image: BRAND_PRESTATION.brandwhite.src,
      url: SITE.booking,
    },
  },
  {
    id: "pose-cil-a-cil",
    video: "/videos/prestations/pose-cil-a-cil-classique.mp4",
    poster: "/images/prestations/pose-cil-a-cil-classique.webp",
      caption: "Un résultat naturel et élégant qui définit le regard tout en apportant longueur et finesse.",
    product: {
      title: "POSE — CIL À CIL CLASSIC",
      price: "60 €",
      image: BRAND_PRESTATION.brandblack.src,
      url: SITE.booking,
    },
  },
  {
    id: "pose-volume",
    video: "/videos/prestations/pose-volume-set.mp4",
    poster: "/images/prestations/pose-volume-set.webp",
    caption: "Un regard dense, sophistiqué et glamour grâce à de délicats bouquets faits main. ",
    product: {
      title: "POSE — VOLUME SET",
      price: "80 €",
      image: BRAND_PRESTATION.brandred.src,
      url: SITE.booking,
    },
  },
  
  {
    id: "pose-mixte",
    video: "/videos/prestations/pose-mixte-leger-hybrid.mp4",
    poster: "/images/prestations/pose-mixte-leger-hybrid.webp",
     caption: "L’équilibre parfait entre naturel et intensité grâce à l’association du cil à cil et du volume.",
    product: {
      title: "POSE — MIXTE LÉGER / HYBRID",
      price: "70 €",
      image: BRAND_PRESTATION.brandbrown.src,
      url: SITE.booking,
    },
  },
];

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

const ArrowIcon = ({ direction }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth="2.2" {...stroke}>
    {direction === "left" ? (
      <>
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="10 7 5 12 10 17" />
      </>
    ) : (
      <>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="14 7 19 12 14 17" />
      </>
    )}
  </svg>
);

const SoundIcon = ({ muted }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" {...stroke}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    {muted ? (
      <>
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </>
    ) : (
      <>
        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
        <path d="M18.5 5.5a9 9 0 0 1 0 13" />
      </>
    )}
  </svg>
);

/* ------------------------------------------------------------------ */
/* Carte produit                                                       */
/* ------------------------------------------------------------------ */

function ProductCard({ product, width }) {
  return (
    <div className="mt-2" style={{ width }}>
      <div
        className="flex items-center gap-3 rounded-2xl border bg-white p-3"
        style={{ borderColor: C.line }}
      >
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 flex-1 items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <img
            src={product.image}
            alt=""
            loading="lazy"
            className="h-14 w-14 shrink-0 rounded-xl border object-cover"
            style={{ borderColor: C.line }}
          />
          <div className="min-w-0 flex-1">
            <p
              className="line-clamp-2 text-base font-semibold leading-tight"
              style={{ color: C.ink, ...CLAMP2 }}
            >
              {product.title}
            </p>
            <p
              className="mt-1.5 text-base leading-tight"
              style={{ color: C.muted }}
            >
              {product.price}
            </p>
          </div>
        </a>
        <button
          type="button"
          onClick={() => window.open(product.url, "_blank", "noopener,noreferrer")}
          aria-label={`Réserver ${product.title}`}
          className="shrink-0 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 motion-reduce:transition-none"
          style={{ backgroundColor: C.ink }}
        >
          Réserver
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Carrousel                                                           */
/* ------------------------------------------------------------------ */

export default function SpotlightCarousel({ 
  slides = SLIDES,
  /*title = "Nos prestations",
  subtitle = "Les différentes pose de cil avec différentes options disponibles.",*/ }) {
  
  const count = slides.length;
  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  const slideRefs = useRef([]);

  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState(BASE_WIDTH);
  const [isMuted, setIsMuted] = useState(true);
  const [drag, setDrag] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const step = width + GAP;
  const mediaHeight = Math.round(width * RATIO);

  /* --- position circulaire : -4 … 0 … +4 pour 9 slides --- */
  const offsetOf = useCallback(
    (i) => {
      const rel = (i - index + count) % count;
      return rel > count / 2 ? rel - count : rel;
    },
    [index, count]
  );

  const go = useCallback(
    (delta) => setIndex((i) => (i + delta + count) % count),
    [count]
  );

  /* --- largeur responsive --- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const available = el.clientWidth - 48;
      setWidth(Math.max(220, Math.min(BASE_WIDTH, available)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

    /* --- coupe la transition des slides qui font le tour de la boucle ---
     On écrit directement dans le DOM plutôt que dans un état : l'effet
     synchronise un système externe, il ne déclenche pas de rendu en cascade. */
  const prevOffsets = useRef(new Map());
  useLayoutEffect(() => {
  const jumped = [];
  for (let i = 0; i < count; i += 1) {
    const next = offsetOf(i);
    const prev = prevOffsets.current.get(i);
    prevOffsets.current.set(i, next);
    const el = slideRefs.current[i];
    if (!el || prev === undefined || Math.abs(next - prev) <= 1) continue;
    el.style.transition = "none";
    jumped.push(el);
  }
  if (!jumped.length) return;
  let inner;
  const raf = requestAnimationFrame(() => {
    inner = requestAnimationFrame(() => {
      jumped.forEach((el) => {
          el.style.transition = "";
        });
    });
  });
  return () => {
    // navigation avant la fin des deux frames : on rétablit tout de suite,
      // sinon la slide resterait figée sans transition
    cancelAnimationFrame(raf);
    if (inner) cancelAnimationFrame(inner);
    jumped.forEach((el) => {
        el.style.transition = "";
      });
  };
}, [index, count, offsetOf]);

  /* --- lecture : seules les slides visibles tournent --- */
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      const near = Math.abs(offsetOf(i)) <= 1;
      video.muted = !(offsetOf(i) === 0 && !isMuted);
      if (near) {
        const p = video.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [index, isMuted, offsetOf]);

  /* --- clavier --- */
  const onKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    }
  };

  /* --- swipe --- */
  const touchStart = useRef(null);
  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
    setIsDragging(true);
  };
  const onTouchMove = (e) => {
    if (touchStart.current === null) return;
    setDrag(e.touches[0].clientX - touchStart.current);
  };
  const onTouchEnd = () => {
    if (Math.abs(drag) > 50) go(drag < 0 ? 1 : -1);
    touchStart.current = null;
    setDrag(0);
    setIsDragging(false);
  };

  const trackHeight = mediaHeight + CARD_HEIGHT;
  const activeTitle = slides[index]?.product.title;

  const rendered = useMemo(
    () => slides.map((slide, i) => ({ slide, i, offset: offsetOf(i) })),
    [slides, offsetOf]
  );

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Sélection vidéo"
      className="w-full focus:outline-none"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div className="mx-auto max-w-6xl px-4">
        {/* <h2
          id="formations-title"
          className="text-4xl font-semibold"
          style={{ color: C.ink }}
        >
          {title}
        </h2>
        <p className="mt-4 text-lg" style={{ color: C.muted }}>
          {subtitle}
        </p> */}
      </div>
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden px-4 py-10 sm:px-6 md:px-8 md:py-14"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="relative w-full touch-pan-y"
          style={{ height: trackHeight }}
        >
          {rendered.map(({ slide, i, offset }) => {
            const isActive = offset === 0;
            const hidden = Math.abs(offset) > 2;
            return (
              <div
                key={slide.id}
                ref={(node) => {
                  slideRefs.current[i] = node;
                }}
                aria-hidden={hidden}
                className={`absolute left-1/2 top-0 ease-out motion-reduce:transition-none ${
                  isDragging ? "" : "transition-transform duration-500"
                }`}
                style={{
                  width,
                  marginLeft: -width / 2,
                  transform: `translate3d(${offset * step + drag}px,0,0)`,
                  zIndex: 10 - Math.abs(offset),
                  visibility: hidden ? "hidden" : "visible",
                }}
              >
                <div
                  role={isActive ? undefined : "button"}
                  tabIndex={isActive || hidden ? -1 : 0}
                  aria-label={
                    isActive
                      ? undefined
                      : offset < 0
                      ? "Slide précédente"
                      : "Slide suivante"
                  }
                  onClick={isActive ? undefined : () => go(offset)}
                  onKeyDown={
                    isActive
                      ? undefined
                      : (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            go(offset);
                          }
                        }
                  }
                  className="relative overflow-hidden bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  style={{ width, height: mediaHeight, borderRadius: RADIUS }}
                >
                  <video
                    ref={(node) => {
                      videoRefs.current[i] = node;
                    }}
                    src={slide.video}
                    poster={slide.poster}
                    playsInline
                    loop
                    muted
                    preload="none"
                    aria-label={slide.caption}
                    className="absolute inset-0 h-full w-full object-cover object-bottom"
                  />
                  {isActive && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMuted((m) => !m);
                      }}
                      aria-label={
                        isMuted ? "Activer le son" : "Couper le son"
                      }
                      className="absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-white backdrop-blur-sm transition-colors focus:outline-none focus-visible:ring-2 motion-reduce:transition-none"
                      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    >
                      <SoundIcon muted={isMuted} />
                    </button>
                  )}
                </div>

                <ProductCard product={slide.product} width={width} />
              </div>
            );
          })}
        </div>

        <nav
          aria-label="Navigation du carrousel"
          className="mt-3 flex items-center justify-center gap-3"
        >
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Slide précédente"
            className="flex h-9 w-9 items-center justify-center rounded-full border bg-white transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 motion-reduce:transition-none"
            style={{ borderColor: C.edge, color: C.ink }}
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Slide suivante"
            className="flex h-9 w-9 items-center justify-center rounded-full border bg-white transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 motion-reduce:transition-none"
            style={{ borderColor: C.edge, color: C.ink }}
          >
            <ArrowIcon direction="right" />
          </button>
        </nav>

        <p className="sr-only" aria-live="polite">
          {activeTitle}
        </p>
      </div>
    </section>
  );
}
