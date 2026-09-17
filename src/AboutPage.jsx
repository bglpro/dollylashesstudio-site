import { NavLink } from "./SiteNav";
import { CutReveal, Reveal, RevealStyles } from "./Reveal";
import { C, FONT } from "./theme";
import { STUDIO_IMAGES } from "./assets/images";
import FAQs from "./FAQs";
import Seo from "./Seo";
import { SOCIAL_LINKS, SITE } from "./config/site";

/* ------------------------------------------------------------------ */
/* Jetons visuels                                                      */
/* ------------------------------------------------------------------ */

const T = {
  ink: C.ink || "#171412",
  line: C.line || "rgba(23,20,18,0.12)",
  muted: C.muted || "rgba(23,20,18,0.60)",
  paper: "#ECE8E3",
  accent: "#5A1220",
};

/* Remplace par ta photo : /public/images/studio.jpg */
const PORTRAIT = STUDIO_IMAGES.find((img) => img.id === "backstage")?.src;

/* Partie de la photo affichée dans le cadre découpé.
   50 % = centré, plus petit = on remonte. 35 % remonte de 15 points. */
const CROP_Y = "29%";

const ABOUT_CSS = `
@keyframes about-spin { to { transform: rotate(360deg); } }
.about-star { display: inline-block; animation: about-spin 6s linear infinite; }

/* Le titre est révélé derrière un cache en overflow hidden : sans cette
   marge intérieure, la jambe du « g » de « signature » est rognée. */
.about-title { line-height: 1.28; }
.about-title span { padding-bottom: 0.14em; }

/* Cadre découpé : le clip-path vient du SVG, la photo est une vraie image
   HTML, ce qui permet de choisir la partie affichée avec object-position. */
.about-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 100 / 40;
  overflow: hidden;
  clip-path: url(#about-notch);
}
.about-frame img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* sous 640 px, une bande de 100/40 devient une fente illisible */
@media (max-width: 639px) { .about-frame { aspect-ratio: 4 / 3; } }

@media (prefers-reduced-motion: reduce) { .about-star { animation: none; } }`;

function Anchor({ id, children }) {
  return (
    <div
      id={id}
      data-section={id}
      style={{ scrollMarginTop: "calc(var(--nav-height, 80px) + 16px)" }}
    >
      {children}
    </div>
  );
}

export const yearsOfPractice = (since = SITE.since) =>
  Math.max(1, new Date().getFullYear() - since);

/* ------------------------------------------------------------------ */

export default function AboutPage() {

  return (
    <main style={{ backgroundColor: "#fff", color: T.ink }}>
      <Seo
        title="À propos | Dolly, technicienne et formatrice à Meaux"
        description="Plus de sept ans d'expérience en extensions de cils avec plus de 500 clientes. Découvrez le studio et la démarche de Dolly, à Meaux."
        path="/about"
      />

      <RevealStyles />
      <style>{ABOUT_CSS}</style>

      <section
        id="a-propos"
        data-section="a-propos"
        className="px-4 pb-20 pt-10 sm:px-6 md:pb-28"
      >
        <div className="mx-auto max-w-6xl">
          {/* ---------------- bandeau ---------------- */}
          <div className="relative">
            {/* rangée en flux normal : en position absolue, elle chevauchait
                la photo sur téléphone et flottait au-dessus sur ordinateur */}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
              <Reveal
                as="span"
                delay={0}
                className="flex items-center gap-2 text-xs uppercase tracking-[0.18em]"
                style={{ color: T.muted }}
              >
                <span className="about-star" style={{ color: T.accent }}>
                  ✱
                </span>
                Le studio
              </Reveal>

              <div className="flex flex-wrap items-center gap-2">
                {SOCIAL_LINKS.map((social, index) => (
                  <Reveal
                    key={social.id}
                    as="a"
                    delay={0.1 + index * 0.1}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] transition-colors duration-300 hover:bg-[#5a1220] hover:text-white sm:text-[11px]"
                    style={{ borderColor: T.line, color: T.muted }}
                  >
                    {social.label}
                  </Reveal>
                ))}
              </div>
            </div>

            {/* ---------------- image découpée ---------------- */}
            <Reveal as="figure" delay={0.25} from="still" className="m-0 mt-6 md:mt-8">
              {/* le SVG ne sert plus qu'à porter la forme découpée */}
              <svg width="0" height="0" aria-hidden="true" className="absolute">
                <defs>
                  <clipPath id="about-notch" clipPathUnits="objectBoundingBox">
                    <path d="M0.0998072 1H0.422076H0.749756C0.767072 1 0.774207 0.961783 0.77561 0.942675V0.807325C0.777053 0.743631 0.791844 0.731953 0.799059 0.734076H0.969813C0.996268 0.730255 1.00088 0.693206 0.999875 0.675159V0.0700637C0.999875 0.0254777 0.985045 0.00477707 0.977629 0H0.902473C0.854975 0 0.890448 0.138535 0.850165 0.138535H0.0204424C0.00408849 0.142357 0 0.180467 0 0.199045V0.410828C0 0.449045 0.0136283 0.46603 0.0204424 0.469745H0.0523086C0.0696245 0.471019 0.0735527 0.497877 0.0733523 0.511146V0.915605C0.0723903 0.983121 0.090588 1 0.0998072 1Z" />
                  </clipPath>
                </defs>
              </svg>

              <div className="about-frame" style={{ backgroundColor: T.paper }}>
                <img
                  src={PORTRAIT}
                  alt="Le studio Dolly Lashes à Meaux"
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: `center ${CROP_Y}` }}
                />
              </div>
            </Reveal>

            {/* ---------------- chiffres ---------------- */}
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 py-4 lg:justify-start">
              <Reveal
                delay={0.35}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm"
              >
                <span className="flex items-center gap-2">
                  <span className="font-semibold" style={{ color: T.accent }}>
                    {yearsOfPractice()} ans
                  </span>
                  <span style={{ color: T.muted }}>d'extensions de cils</span>
                </span>
                <span aria-hidden="true" style={{ color: T.line }}>
                  |
                </span>
                {/* Trois remplacements possibles à la note et aux avis, tous
                    vérifiables. Décommentez celui que vous préférez.

                    2) <span className="font-semibold">5 techniques</span> maîtrisées
                    3) <span className="font-semibold">Certifiée</span> et assurée   */}
                <span className="flex items-center gap-2">
                  <span className="font-semibold" style={{ color: T.accent }}>
                    Sur rendez-vous
                  </span>
                  <span style={{ color: T.muted }}>une cliente à la fois</span>
                </span>
              </Reveal>

              <div className="flex flex-row-reverse items-end gap-4 lg:absolute lg:bottom-16 lg:right-0 lg:flex-col lg:items-end lg:gap-0">
                <Reveal
                  delay={0.45}
                  className="flex items-baseline gap-2 text-2xl sm:text-3xl lg:text-4xl"
                >
                  <span className="font-semibold" style={{ color: T.accent }}>
                    +500
                  </span>
                  <span className="uppercase tracking-tight" style={{ color: T.muted }}>
                    clientes
                  </span>
                </Reveal>
                <Reveal
                  delay={0.55}
                  className="flex items-center gap-2 text-xs sm:text-sm"
                >
                  <span className="font-semibold" style={{ color: T.accent }}>
                    100 %
                  </span>
                  <span style={{ color: T.muted }}>en petit comité</span>
                </Reveal>
              </div>
            </div>
          </div>

          {/* ---------------- contenu ---------------- */}
          <div className="mt-6 grid gap-10 md:mt-10 md:grid-cols-3">
            <div className="md:col-span-2">
              <h1 className="about-title mb-8 text-2xl font-semibold sm:text-4xl md:text-5xl" style={{ color: T.ink, fontFamily: FONT.display, fontWeight: 400 }}>
                <CutReveal stagger={0.09}>
                  Le regard, notre signature.
                </CutReveal>
              </h1>

              <div className="grid gap-6 text-sm sm:text-base md:grid-cols-2">
                <Reveal delay={0.1} style={{ color: T.muted, fontFamily: FONT.read, fontWeight: 500 }}>
                  <p className="leading-relaxed text-justify">
                    Technicienne de cils depuis {yearsOfPractice()} ans, diplômée à trois reprises et aujourd’hui formatrice, 
                    Julia a fait de l’excellence et du détail le cœur de son métier.<br />
                    Ayant grandi dans un environnement où l’entrepreneuriat occupait déjà une place importante, 
                    j’ai très tôt développé le goût de la création, de l’indépendance et de l’ambition. Passionnée 
                    par l’esthétique, mais surtout par les détails qui font toute la différence, j’ai toujours cherché 
                    à créer un univers qui me ressemble et à me distinguer par une approche singulière.<br />
                    C’est naturellement que je me suis tournée vers l’art de l’extension de cils. Une discipline qui m’a 
                    immédiatement séduite par sa précision, sa créativité et son caractère profondément personnalisé.
                  </p>
                </Reveal>
                <Reveal delay={0.2} style={{ color: T.muted, fontFamily: FONT.read, fontWeight: 500 }}>
                  <p className="leading-relaxed text-justify">
                    Pour moi, l’extension de cils n’est pas simplement une prestation esthétique. C’est un véritable art du détail, 
                    une approche du luxe où la qualité, la précision et l’expérience occupent une place centrale.<br />
                    Au fil des années, j’ai développé ma propre vision de ce métier : une beauté sophistiquée, maîtrisée et sur mesure, 
                    où chaque choix est pensé pour respecter la personnalité, la morphologie et les envies de chaque cliente.<br />
                    DOLLYLASHESSTUDIO est ainsi devenu le reflet de tout ce que j’aime : la beauté, la créativité, l’élégance, le sens du 
                    détail, mais aussi les petites attentions qui rendent une expérience mémorable.
                  </p>
                </Reveal>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="rounded-3xl p-6 md:text-right" style={{ backgroundColor: T.paper }}>
                <Reveal
                  delay={0.1}
                  className="text-xl font-semibold uppercase tracking-[0.16em]"
                  style={{ color: T.accent }}
                >
                  Dolly
                </Reveal>
                <Reveal delay={0.18} className="mt-1 text-sm" style={{ color: T.muted }}>
                  Lash artist &amp; formatrice
                </Reveal>

                <Reveal delay={0.26} className="mt-8">
                  <p className="text-sm font-medium leading-relaxed">
                    Envie d'en faire votre métier, ou simplement d'un regard bien posé ?
                  </p>
                </Reveal>

                <Reveal delay={0.34} className="mt-6 flex flex-col gap-3 md:items-end">
                  <NavLink
                    href="/#formations"
                    className="group inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition-[gap,opacity] duration-300 hover:gap-4 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 motion-reduce:transition-none"
                    style={{ backgroundColor: T.accent, color: "#fff" }}
                  >
                    Voir les formations
                    <svg width="16" height="12" viewBox="0 0 14 10" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.537.808a.5.5 0 01.817-.162l4 4a.5.5 0 010 .708l-4 4a.5.5 0 11-.708-.708L11.793 5.5H1a.5.5 0 010-1h10.793L8.646 1.354a.5.5 0 01-.109-.546z"
                        fill="currentColor"
                      />
                    </svg>
                  </NavLink>

                  <NavLink
                    href="/contact"
                    className="inline-flex w-fit items-center text-xs uppercase tracking-[0.14em] underline underline-offset-4 transition-opacity hover:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    style={{ color: T.muted }}
                  >
                    Poser une question
                  </NavLink>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Anchor id="faq">
        <FAQs />
      </Anchor>
    </main>
  );
}
