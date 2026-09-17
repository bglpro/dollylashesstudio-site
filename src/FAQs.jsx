import { useId, useMemo, useState } from "react";
import { C, FONT } from "./theme";
import { useInView } from "./useInView";

/* ------------------------------------------------------------------ */
/* Contenu par défaut                                                  */
/* ------------------------------------------------------------------ */

const DEFAULT_ITEMS = [
  /* ---------- Prestations ---------- */
  {
    category: "Prestations",
    id: "prestation-pose-exterieure",
    question: "Puis-je venir avec des extensions posées par une autre technicienne ?",
    answer:
      "Nous ne réalisons pas de remplissage sur une pose extérieure : une dépose est obligatoire avant toute nouvelle pose. Elle permet de repartir sur une base saine, dont nous maîtrisons la qualité et la tenue.",
  },
  {
    category: "Prestations",
    id: "prestation-choix",
    question: "Quelle prestation choisir selon mon regard ?",
    answer:
      "Chaque pose est pensée et adaptée à votre regard, pour mettre vos traits en valeur et obtenir un résultat harmonieux. Au moindre doute sur la prestation à choisir, écrivez-nous sur Instagram, par SMS ou par e-mail : nous vous orientons avant la réservation.",
  },
  {
    category: "Prestations",
    id: "prestation-cils-naturels",
    question: "Les extensions abîment-elles les cils naturels ?",
    answer:
      "Réalisées avec une technique adaptée, un poids approprié et dans le respect du cil naturel, les extensions ne l'endommagent pas. C'est précisément ce que garantissent le diagnostic en début de séance et le choix des longueurs.",
  },
  {
    category: "Prestations",
    id: "prestation-duree",
    question: "Combien de temps dure un rendez-vous ?",
    answer:
      "Comptez 2 h 30 au maximum pour un rendez-vous au studio, temps de diagnostic et de dépose compris.",
  },
  {
    category: "Prestations",
    id: "prestation-entretien",
    question: "Comment entretenir mes extensions ?",
    answer:
      "Un nettoyage quotidien avec un produit adapté, un brossage délicat, et surtout : ne jamais tirer ni arracher les extensions. C'est ce qui fait la différence entre trois semaines de tenue et beaucoup moins.",
  },

  /* ---------- Formations ---------- */
  {
    category: "Formations",
    id: "formation-debutante",
    question: "Puis-je suivre la formation si je suis débutante ?",
    answer:
      "Oui. Nos formations s'adressent à toute personne souhaitant apprendre ou perfectionner sa technique en extensions de cils, que vous soyez débutante ou déjà technicienne.",
  },
  {
    category: "Formations",
    id: "formation-materiel",
    question: "Le matériel est-il fourni pendant la formation ?",
    answer:
      "Certaines formations incluent un kit de démarrage, pour vous permettre de pratiquer dès la fin de la session. Le détail du contenu figure sur la page de chaque formation.",
  },
  {
    category: "Formations",
    id: "formation-modele",
    question: "Vais-je pratiquer sur un modèle ?",
    answer:
      "Oui. Une partie pratique sur modèle est prévue, afin de vous placer dans des conditions proches de celles que vous rencontrerez avec vos futures clientes.",
  },
  {
    category: "Formations",
    id: "formation-suivi",
    question: "Suis-je accompagnée après la formation ?",
    answer:
      "Oui. Nous gardons le contact après la formation pour répondre à vos questions et suivre votre progression.",
  },
  {
    category: "Formations",
    id: "formation-choix",
    question: "Quelle formation choisir selon mon niveau et mon objectif ?",
    answer:
      "Contactez-nous avant de réserver : nous vous orientons vers la formation la plus adaptée à votre niveau et à votre objectif.",
  },
];

/* ------------------------------------------------------------------ */
/* Animation lettre par lettre, en CSS pur                             */
/* ------------------------------------------------------------------ */

const STAGGER_CSS = `
@keyframes faq-blur-in {
  from { opacity: 0; filter: blur(10px); }
  to   { opacity: 1; filter: blur(0); }
}
@media (prefers-reduced-motion: reduce) {
  [data-faq-char] { animation: none !important; opacity: 1 !important; filter: none !important; }
}`;

export function BlurredStagger({ text, className = "" }) {
  let cursor = 0;
  const words = text.split(" ");

  return (
    <p
      className={`text-base leading-relaxed ${className}`}
      style={{ color: C.muted }}
    >
      {/* texte intact pour les lecteurs d'écran : le découpage en
          caractères insécables rendrait la lecture inaudible */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, w) => {
        const chars = [...word, ...(w < words.length - 1 ? [" "] : [])];
        return (
          // le mot reste insécable : le découpage ne casse pas le retour à la ligne
          <span key={`${word}-${w}`} className="inline-block whitespace-nowrap">
            {chars.map((char, i) => {
              const delay = cursor * 0.015;
              cursor += 1;
              return (
                <span
                  key={i}
                  data-faq-char=""
                  className="inline-block"
                  style={{
                    animation: "faq-blur-in 0.3s ease-out both",
                    animationDelay: `${delay}s`,
                    willChange: "filter, opacity",
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              );
            })}
            </span>
          );
        })}
      </span>
    </p>
  );
}

/**
 * Apparition à l'entrée dans l'écran.
 *
 * Un composant plutôt qu'une classe utilitaire : le délai varie d'un
 * élément à l'autre, et c'est ce décalage qui fait la cascade.
 */
function Reveal({ inView, delay = 0, as: Tag = "div", className = "", children }) {
  return (
    <Tag
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(18px)",
        transitionDelay: inView ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Accordéon                                                           */
/* ------------------------------------------------------------------ */

const ChevronIcon = ({ open }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="shrink-0 transition-transform duration-300 motion-reduce:transition-none"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

function AccordionItem({ item, isOpen, onToggle, headingLevel = "h3", inView = true, delay = 0 }) {
  const Heading = headingLevel;
  const uid = useId();
  const panelId = `${uid}-panel`;
  const buttonId = `${uid}-button`;

  return (
    <div
      className="border-b transition-all duration-500 ease-out motion-reduce:transition-none"
      style={{
        borderColor: C.line,
        opacity: inView ? 1 : 0,
        // léger décalage latéral : la ligne semble se poser plutôt que
        // simplement apparaître
        transform: inView ? "translateX(0)" : "translateX(-12px)",
        transitionDelay: inView ? `${delay}ms` : "0ms",
      }}
    >
      <Heading>
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left text-base font-medium transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 motion-reduce:transition-none"
          style={{ color: C.ink }}
        >
          {item.question}
          <ChevronIcon open={isOpen} />
        </button>
      </Heading>

      {/* grid 0fr -> 1fr : hauteur animée sans mesurer le contenu */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="grid transition-all duration-300 ease-out motion-reduce:transition-none"
        style={{
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <div className="pb-4 pr-6">
            <BlurredStagger key={isOpen ? "open" : "closed"} text={item.answer} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section FAQ                                                         */
/* ------------------------------------------------------------------ */

function groupByCategory(items) {
  const groups = [];
  items.forEach((item) => {
    const label = item.category || "";
    const existing = groups.find((group) => group.label === label);
    if (existing) existing.items.push(item);
    else groups.push({ label, items: [item] });
  });
  return groups;
}

export default function FAQs({
  items = DEFAULT_ITEMS,
  title = "Questions fréquentes",
  subtitle = "Prestations et formations, les réponses aux questions qui reviennent",
  contactHref = "/contact",
}) {
  const [openId, setOpenId] = useState(null);
  const [ref, inView] = useInView();
  const groups = useMemo(() => groupByCategory(items), [items]);

  // numérotation continue d'un groupe à l'autre : la cascade traverse
  // toute la colonne au lieu de repartir de zéro à chaque intitulé
  let rank = 0;

  const contact = (
    <>
      Vous ne trouvez pas votre réponse ? Écrivez à{" "}
      <a
        href={contactHref}
        className="font-medium underline underline-offset-4 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        style={{ color: C.ink }}
      >
        notre équipe
      </a>
      , on répond sous 24 h.
    </>
  );

  return (
    <section ref={ref} className="py-16 md:py-24" aria-labelledby="faq-title">
      <style>{STAGGER_CSS}</style>

      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-8 md:grid-cols-5 md:gap-12">
          <div className="md:col-span-2">
            <Reveal inView={inView}>
            <h2
              id="faq-title"
              className="text-4xl font-semibold"
              style={{ color: C.accent, fontFamily: FONT.display, fontWeight: 500 }}
            >
              {title}
            </h2>
            </Reveal>

            <Reveal inView={inView} delay={120}>
            <p className="mt-4 text-lg" style={{ color: C.muted }}>
              {subtitle}
            </p>
            </Reveal>

            <Reveal inView={inView} delay={240} className="hidden md:block">
              <p className="mt-6" style={{ color: C.muted }}>
              {contact}
            </p>
            </Reveal>
          </div>

          <div className="md:col-span-3">
            {groups.map((group) => (
              <section
                key={group.label || "sans-categorie"}
                className="mb-10 last:mb-0"
                aria-labelledby={group.label ? `faq-${group.label}` : undefined}
              >
                {group.label ? (
                  <Reveal inView={inView} delay={rank * 60}>
                  <h3
                    id={`faq-${group.label}`}
                    className="mb-2 text-xs font-semibold uppercase tracking-[0.18em]"
                    style={{ color: C.muted }}
                  >
                    {group.label}
                  </h3>
                  </Reveal>
                ) : null}

                {group.items.map((item) => (
                  <AccordionItem
                    key={item.id}
                    item={item}
                    inView={inView}
                    delay={(rank += 1) * 60}
                    // le titre du groupe occupe le niveau 3 : les questions
                    // descendent d'un cran pour garder une hiérarchie valide
                    headingLevel={group.label ? "h4" : "h3"}
                    isOpen={openId === item.id}
                    onToggle={() =>
                      setOpenId((current) => (current === item.id ? null : item.id))
                    }
                  />
                ))}
              </section>
            ))}
          </div>

          <Reveal inView={inView} delay={rank * 60} className="md:hidden">
            <p className="mt-6" style={{ color: C.muted }}>
            {contact}
          </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
