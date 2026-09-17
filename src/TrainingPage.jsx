import { useState } from "react";
import { C } from "./theme";
import { COMMON, TRAININGS } from "./trainings";
import { useInView } from "./useInView";
import TiltCard, { TiltCardStyles } from "./TiltCard";
import { trainingActionHref } from "./trainingRequest";
import Seo from "./Seo";
import { SITE as SEO, absolute } from "./seoConfig";
import TrainingRequestModal from "./TrainingRequestModal";
import { SITE } from "./config/site";
import FAQs from "./FAQs";

const CalendarIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

const Check = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="mt-1 shrink-0"
  >
    <polyline points="4 12 10 18 20 6" />
  </svg>
);

function Section({ title, children, className = "" }) {
  const [ref, inView] = useInView();

  return (
    <section
      ref={ref}
      className={`border-t py-10 transition-all duration-500 ease-out motion-reduce:transition-none md:py-14 ${className}`}
      style={{
        borderColor: C.line,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
      }}
    >
      <div className="grid gap-6 md:grid-cols-3 md:gap-12">
        <h2
          className="text-sm font-semibold uppercase tracking-[0.16em]"
          style={{ color: C.muted }}
        >
          {title}
        </h2>

        <div className="md:col-span-2">{children}</div>
      </div>
    </section>
  );
}

function Bullets({ items }) {
  return (
    <ul className="list-none space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-base leading-relaxed" style={{ color: C.ink }}>
          <Check />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

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

export default function TrainingPage({
  training,
  // "modal" = formulaire en fenêtre (recommandé), "mail" = client mail
  // pré-rempli, "form" = /contact pré-rempli, "calendly" = agenda
  requestMode = "modal",
  contactEmail = SITE.email,
  bookingHref = SITE.booking,
  others = TRAININGS,
  ebook = {
    title: "Le Code des Cils",
    text: "15 pages pour analyser tes poses, comprendre tes résultats et prendre de meilleures décisions techniques.",
    price: "69.99 €",
    href: "/#ebook",
  },
}) {
  const [modalOpen, setModalOpen] = useState(false);

  if (!training) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="text-3xl font-semibold" style={{ color: C.ink }}>
          Formation introuvable
        </h1>
        <p className="mt-4" style={{ color: C.muted }}>
          Cette formation n'existe pas ou a été renommée.
        </p>
        <a
          href="/#formations"
          className="mt-8 inline-flex rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white"
          style={{ backgroundColor: C.ink }}
        >
          Voir toutes les formations
        </a>
      </main>
    );
  }

  const certification = training.certification === false ? null : COMMON.certification;
  const isModal = requestMode === "modal";
  const actionHref = isModal
    ? null
    : trainingActionHref(training, {
        mode: requestMode,
        email: contactEmail,
        bookingHref,
      });
  const external = !!actionHref && actionHref.startsWith("http");

  // les deux boutons d'inscription partagent le même comportement :
  // bouton qui ouvre la fenêtre, ou lien selon le mode choisi
  const RequestAction = ({ className, style }) =>
    isModal ? (
      <button type="button" onClick={() => setModalOpen(true)} className={className} style={style}>
        <CalendarIcon />
        Demander une place
      </button>
    ) : (
      <a
        href={actionHref}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={className}
        style={style}
      >
        <CalendarIcon />
        Demander une place
      </a>
    );
  const rest = others.filter((item) => item.slug !== training.slug);

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-16 md:pt-24">
      <Seo
        title={`Formation ${training.title} à Meaux`}
        description={training.tagline || training.audience.slice(0, 155)}
        path={`/formations/${training.slug}`}
        type="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: training.title,
          description: training.tagline || training.audience,
          url: absolute(`/formations/${training.slug}`),
          provider: {
            "@type": "Organization",
            name: SEO.name,
            url: SEO.url,
          },
          hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "onsite",
            location: { "@type": "Place", address: "Meaux, France" },
          },
        }}
      />

      {/* --- en-tête --- */}
      <header>
        <p
          className="text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: C.muted }}
        >
          Formation · {training.level}
        </p>

        <h1
          className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl"
          style={{ color: C.ink }}
        >
          {training.title}
        </h1>

        {training.subtitle ? (
          <p className="mt-2 text-lg" style={{ color: C.muted }}>
            {training.subtitle}
          </p>
        ) : null}

        {training.tagline ? (
          <p className="mt-6 max-w-2xl text-xl leading-snug" style={{ color: C.ink }}>
            {training.tagline}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <RequestAction
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 motion-reduce:transition-none"
            style={{ backgroundColor: C.accent }}
          />

          <span
            className="rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.12em]"
            style={{ borderColor: C.edge, color: C.muted }}
          >
            {training.duration}
          </span>
        </div>
      </header>

      {/* --- contenu --- */}
      <Section title="À qui s'adresse la formation" className="mt-4">
        <p className="text-base leading-relaxed" style={{ color: C.ink }}>
          {training.audience}
        </p>
      </Section>

      {/*<Section title="Durée">
        <p className="text-base leading-relaxed" style={{ color: C.ink }}>
          {training.duration}
        </p>
        <p className="mt-2 text-sm" style={{ color: C.muted }}>
          {COMMON.scheduleNote}
        </p>
      </Section>*/}

      <Section title="Objectifs">
        {training.intro ? (
          <p className="mb-6 text-base leading-relaxed" style={{ color: C.ink }}>
            {training.intro}
          </p>
        ) : null}
        {training.objectives ? (
          <>
            <p className="mb-4 text-sm" style={{ color: C.muted }}>
              À l'issue de la formation, l'élève sera capable de :
            </p>
            <Bullets items={training.objectives} />
          </>
        ) : null}
      </Section>

      {training.steps ? (
        <Section title="Déroulement">
          <ol className="list-none space-y-5">
            {training.steps.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: C.accent }}
                >
                  {index + 1}
                </span>
                <p className="text-base leading-relaxed" style={{ color: C.ink }}>
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {certification ? (
        <Section title="Évaluation, certification et suivi">
          <Bullets items={certification} />
        </Section>
      ) : null}

      {training.included && training.included.length ? (
        <Section title="Inclus">
          <Bullets items={training.included} />
        </Section>
      ) : null}

      <Section title="Facilités de paiement">
        <Bullets items={COMMON.payment} />
      </Section>

      {/* --- rappel de réservation --- */}
      <section
        className="mt-14 overflow-hidden px-6 py-12 text-center md:px-12"
        style={{ borderRadius: 22, backgroundColor: C.line }}
      >
        <h2 className="text-2xl font-semibold md:text-3xl" style={{ color: C.ink }}>
          Prête à vous lancer ?
        </h2>
        <p className="mx-auto mt-3 max-w-lg" style={{ color: C.ink }}>
          Complétez le formulaire avec vos coordonnées et envoyez.<br />
          Nous revenons vers vous sous 24 h avec les dates disponibles.
        </p>
        <RequestAction
          className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition-opacity hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
          style={{ backgroundColor: C.accent, color: C.surface }}
        />
      </section>

      {/* --- ebook, action secondaire --- */}
      {ebook ? (
        <section
          className="mt-6 flex flex-col items-start justify-between gap-4 border px-6 py-6 sm:flex-row sm:items-center"
          style={{ borderColor: C.line, borderRadius: 18 }}
        >
          <div>
            <p className="text-base font-semibold" style={{ color: C.ink }}>
              Pas encore prête pour la formation ? {ebook.title} — {ebook.price}
            </p>
            <p className="mt-1 text-sm" style={{ color: C.muted }}>
              {ebook.text}
            </p>
          </div>
          <a
            href={SITE.ebookCheckout}
            className="shrink-0 whitespace-nowrap text-sm font-semibold underline underline-offset-4 transition-opacity hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 motion-reduce:transition-none"
            style={{ color: C.ink }}
          >
            Voir l'ebook
          </a>
        </section>
      ) : null}

      {/* --- autres formations --- */}
      {rest.length ? (
        <nav aria-label="Autres formations" className="mt-16">
          <TiltCardStyles />
          <h2
            className="text-sm font-semibold uppercase tracking-[0.16em]"
            style={{ color: C.muted }}
          >
            Autres formations
          </h2>
          <ul
            className="mt-6 grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-4"
            style={{ perspective: "1000px" }}
          >
            {rest.map((item) => (
              <li key={item.slug}>
                <TiltCard
                  title={item.title}
                  subtitle={`${item.level} · ${item.duration}`}
                  imageUrl={item.image}
                  href={`/formations/${item.slug}`}
                  actionText="Voir la formation"
                />
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <TrainingRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        training={training}
        fallbackEmail={contactEmail}
      />

      <Anchor id="faq">
        <FAQs />
      </Anchor>
    </main>
  );
}
