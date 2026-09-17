import { useState } from "react";
import { C } from "./theme";
import { useInView } from "./useInView";
import { scrollToAnchor } from "./anchorScroll";

const ArrowRight = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="13 6 19 12 13 18" />
  </svg>
);

/* Apparition en cascade : un simple délai par élément */
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

function AnchorLink({ href, className, style, children }) {
  const onClick = (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey) return;
    if (scrollToAnchor(href, 0)) event.preventDefault();
  };
  return (
    <a href={href} onClick={onClick} className={className} style={style}>
      {children}
    </a>
  );
}

export default function CtaCard({
  title = "Formez-vous à la technique Dollylashes",
  description = "Une journée de formation avec les fiches techniques et le kit complet. Accès à vie, à suivre à votre rythme.",
  //imageSrc = `${backstage?.src || ""}`,
  primary = { label: "Voir les formations", href: "/#formations" },
  secondary = { label: "Pas encore prêt ? L'ebook à 69.99 €", href: "/#ebook" },
  onSubmitEmail,
  inputPlaceholder = "Votre adresse e-mail",
  buttonText = "Recevoir l'ebook",
}) {
  const [ref, inView] = useInView();
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmitEmail) onSubmitEmail(email);
  };

  return (
    <section className="w-full px-4 py-12 md:px-8 md:py-16" aria-labelledby="cta-title">
      <div
        ref={ref}
        // sans largeur maximale, la carte s'étirait sur toute la largeur des
        // très grands écrans et le texte se retrouvait perdu à gauche
        className="relative mx-auto w-full max-w-7xl overflow-hidden"
        style={{ borderRadius: 22, backgroundColor: C.line }}
      >
        <div className="relative z-10 grid grid-cols-1 items-center gap-8 p-8 md:grid-cols-2 md:gap-16 md:p-12 lg:gap-20 lg:p-16">
          <div className="flex flex-col items-start text-left" style={{ color: C.ink }}>
            <Reveal inView={inView}>
              <h2
                id="cta-title"
                className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl"
                style={{ fontFamily: "Melodrama, sans-serif", fontWeight: 500 }}
              >
                {title}
              </h2>
            </Reveal>
            <Reveal inView={inView} delay={120}>
              <p className="mt-4 max-w-xl text-lg" style={{ color: C.muted }}>{description}</p>
            </Reveal>
          </div>

          <Reveal
            inView={inView}
            delay={240}
            className="w-full md:w-auto md:justify-self-end"
          >
            {onSubmitEmail ? (
              <form
                onSubmit={handleSubmit}
                className="flex w-full flex-col gap-3 sm:flex-row md:w-auto md:justify-end"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={inputPlaceholder}
                  aria-label={inputPlaceholder}
                  className="h-12 flex-1 rounded-lg border px-4 text-base text-white placeholder:text-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  style={{ borderColor: C.edge, backgroundColor: C.surface, color: C.ink }}
                />
                <button
                  type="submit"
                  className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
                  style={{ backgroundColor: C.ink, color: C.surface }}
                >
                  {buttonText}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <div className="flex w-full flex-col items-start gap-4 md:w-auto md:items-end md:text-right">
                <AnchorLink
                  href={primary.href}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
                  style={{ backgroundColor: C.accent, color: C.surface }}
                >
                  {primary.label}
                  <ArrowRight className="h-4 w-4" />
                </AnchorLink>

                {secondary ? (
                  <AnchorLink
                    href={secondary.href}
                    className="text-sm underline underline-offset-4 transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    style={{ color: C.muted }}
                  >
                    {secondary.label}
                  </AnchorLink>
                ) : null}
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
