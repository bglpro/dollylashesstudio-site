import { useMemo, useState } from "react";
import { Reveal, RevealStyles } from "./Reveal";
import { C } from "./theme";
import { BRAND_IMAGES } from "./assets/images";
import Seo from "./Seo";
import { SITE, SOCIAL_LINKS } from "./config/site";

/* ------------------------------------------------------------------ */
/* Réglages                                                            */
/* ------------------------------------------------------------------ */

const FORM_ENDPOINT = "https://api.web3forms.com/submit";

const STUDIO = {
  email: SITE.email,
  phone: SITE.phone,
  phoneHref: `tel:${SITE.phone.replace(/\s+/g, "")}`,
  address: ["30 Avenue de l'Épinette", "77100 MEAUX"],
  hours: ["Mardi – samedi", "10h00 – 18h30"],
  image: BRAND_IMAGES.logoBordeaux,
};

const REQUESTS = [
  { value: "formation", label: "Une formation" },
  { value: "prestation", label: "Une prestation (pose, remplissage, dépose)" },
  { value: "coaching", label: "Un coaching privé" },
  { value: "contenu", label: "De la création de contenu" },
  { value: "partenariat", label: "Un partenariat" },
  { value: "autre", label: "Autre chose" },
];

const COURSES = [
  "Cours classique débutante",
  "Les volumes",
  "Cil à cil et volumes",
  "Coaching privé",
  "Création de contenu",
  "Je ne sais pas encore",
];

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

const FORM_CSS = `
.field {
  width: 100%;
  border-radius: 16px;
  border: 1px solid rgba(23,20,18,0.14);
  background: #fff;
  padding: 13px 16px;
  font-size: 0.9375rem;
  line-height: 1.4;
  color: #171412;
  transition: border-color 220ms ease, box-shadow 220ms ease;
}
.field::placeholder { color: rgba(23,20,18,0.35); }
.field:hover { border-color: rgba(23,20,18,0.28); }
.field:focus {
  outline: none;
  border-color: #5A1220;
  box-shadow: 0 0 0 3px rgba(90,18,32,0.12);
}
.field[aria-invalid="true"] { border-color: #9B2C3B; background: #FFF8F8; }
textarea.field { min-height: 132px; resize: vertical; }

select.field {
  appearance: none;
  -webkit-appearance: none;
  padding-right: 42px;
  cursor: pointer;
}
select.field:invalid { color: rgba(23,20,18,0.35); }

.field-label {
  display: block;
  margin-bottom: 7px;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(23,20,18,0.55);
}
.field-error { margin-top: 6px; font-size: 12px; color: #9B2C3B; }

@media (prefers-reduced-motion: reduce) { .field { transition: none; } }`;

/* ------------------------------------------------------------------ */

const emailIsValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

const EMPTY = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  request: "",
  course: "",
  message: "",
  consent: false,
  website: "", // champ piège, invisible pour les humains
};

export default function ContactPage() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const set = (key) => (event) => {
    const value =
      event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const validate = () => {
    const next = {};
    if (!values.firstName.trim()) next.firstName = "Indiquez votre prénom.";
    if (!values.lastName.trim()) next.lastName = "Indiquez votre nom.";
    if (!emailIsValid(values.email)) next.email = "Cette adresse e-mail est incomplète.";
    if (!values.request) next.request = "Choisissez le type de demande.";
    if (values.request === "formation" && !values.course)
      next.course = "Précisez la formation qui vous intéresse.";
    if (values.message.trim().length < 10)
      next.message = "Décrivez votre demande en quelques mots.";
    if (!values.consent) next.consent = "Votre accord est nécessaire pour vous répondre.";
    return next;
  };

  const requestLabel = useMemo(
    () => REQUESTS.find((item) => item.value === values.request)?.label || "",
    [values.request]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      const first = document.querySelector('[aria-invalid="true"]');
      if (first) first.focus();
      return;
    }

    // un robot remplit tous les champs, y compris celui qu'on a caché :
    // on le laisse croire que c'est parti, sans rien envoyer
    if (values.website) {
      setStatus("sent");
      return;
    }

    const fullName = `${values.firstName.trim()} ${values.lastName.trim()}`;

    const payload = {
      access_key: SITE.forms.contact,
      subject: `Contact site — ${requestLabel} — ${fullName}`,
      from_name: `Site ${SITE.shortName}`,
      // permet de répondre directement depuis la boîte mail
      replyto: values.email.trim(),
      // filtre anti-robot de Web3Forms : vide = humain
      botcheck: "",

      Demande: requestLabel,
      ...(values.course ? { Formation: values.course } : {}),
      Message: values.message.trim(),

      Prénom: values.firstName.trim(),
      Nom: values.lastName.trim(),
      "E-mail": values.email.trim(),
      Téléphone: values.phone.trim() || "non renseigné",

      "Consentement RGPD": values.consent ? "accordé" : "refusé",
      "Reçu le": new Date().toLocaleString("fr-FR", {
        dateStyle: "full",
        timeStyle: "short",
      }),
      "Page d'origine": typeof window !== "undefined" ? window.location.href : "",
    };

    setStatus("sending");

    // sans limite de temps, un réseau qui ne répond pas laisse le bouton
    // bloqué sur « Envoi… » indéfiniment
    const controller =
      typeof AbortController === "function" ? new AbortController() : null;
    const timeout = controller
      ? window.setTimeout(() => controller.abort(), 15000)
      : null;

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: controller ? controller.signal : undefined,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) {
        throw new Error(result.message || `HTTP ${response.status}`);
      }
      setStatus("sent");
    } catch (error) {
      // le message de Web3Forms est utile en développement : clé invalide,
      // domaine non autorisé, quota atteint
      if (import.meta.env?.DEV) console.warn("[contact]", error);
      setStatus("error");
    } finally {
      if (timeout) window.clearTimeout(timeout);
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setStatus("idle");
  };

  const invalid = (key) => (errors[key] ? "true" : undefined);

  return (
    <main style={{ backgroundColor: T.surface, color: T.ink }}>
      <Seo
        title="Contact | DollyLashesStudio"
        description="Une question sur une pose ou une formation ? Écrivez au studio DollyLashesStudio à Meaux, réponse sous 24 h."
        path="/contact"
      />
      <RevealStyles />
      <style>{FORM_CSS}</style>

      <section
        id="contact"
        data-section="contact"
        className="px-4 pb-20 pt-12 sm:px-6 md:pb-28 md:pt-16"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal
            as="p"
            className="mb-4 text-xs uppercase tracking-[0.18em]"
            style={{ color: T.muted }}
          >
            Contact
          </Reveal>

          <Reveal
            as="h1"
            delay={0.08}
            className="mb-10 max-w-2xl text-3xl font-semibold leading-[1.1] sm:text-4xl md:text-5xl"
          >
            Dites-nous ce dont vous avez{" "}
            <span className="font-serif italic" style={{ color: T.accent }}>
              besoin
            </span>
            .
          </Reveal>

          <Reveal
            delay={0.16}
            from="still"
            className="overflow-hidden rounded-[28px] border shadow-[0_24px_60px_-40px_rgba(23,20,18,0.5)] md:rounded-[36px]"
            style={{ borderColor: T.line, backgroundColor: "#fff" }}
          >
            <div className="grid md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
              {/* ---------------- panneau gauche ---------------- */}
              <div
                className="flex flex-col gap-8 p-7 sm:p-9"
                style={{ backgroundColor: T.ink, color: T.paper }}
              >
                <div>
                  <h2 className="text-xl font-semibold">Le studio</h2>
                  <p
                    className="mt-2 max-w-xs text-sm leading-relaxed"
                    style={{ color: "rgba(236,232,227,0.66)" }}
                  >
                    Une question sur une formation, une pose, une disponibilité :
                    on répond sous 48 h ouvrées.
                  </p>
                </div>

                <ul className="list-none space-y-4 text-sm">
                  <li>
                    <span
                      className="block text-[10px] uppercase tracking-[0.16em]"
                      style={{ color: "rgba(236,232,227,0.5)" }}
                    >
                      Téléphone
                    </span>
                    <a
                      href={STUDIO.phoneHref}
                      className="transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      {STUDIO.phone}
                    </a>
                  </li>
                  <li>
                    <span
                      className="block text-[10px] uppercase tracking-[0.16em]"
                      style={{ color: "rgba(236,232,227,0.5)" }}
                    >
                      E-mail
                    </span>
                    <a
                      href={`mailto:${STUDIO.email}`}
                      className="break-all transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      {STUDIO.email}
                    </a>
                  </li>
                  <li>
                    <span
                      className="block text-[10px] uppercase tracking-[0.16em]"
                      style={{ color: "rgba(236,232,227,0.5)" }}
                    >
                      Adresse
                    </span>
                    {STUDIO.address.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </li>
                  <li>
                    <span
                      className="block text-[10px] uppercase tracking-[0.16em]"
                      style={{ color: "rgba(236,232,227,0.5)" }}
                    >
                      Horaires
                    </span>
                    {STUDIO.hours.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </li>
                </ul>

                <figure className="mt-auto overflow-hidden rounded-2xl">
                  <img
                    src={BRAND_IMAGES.logoBlancTrp.src}
                    alt={BRAND_IMAGES.logoBlancTrp.alt}
                    loading="lazy"
                    className="h-52 w-full object-contain sm:h-64 md:h-72"
                    style={{ backgroundColor: C.accent }}
                  />
                </figure>

                <div className="flex flex-wrap items-center gap-2">
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.id}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white hover:bg-[#ECE8E3] hover:text-[#171412]"
                      style={{
                        borderColor: "rgba(236,232,227,0.28)",
                        color: "rgba(236,232,227,0.8)",
                      }}
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* ---------------- formulaire ---------------- */}
              <div className="p-7 sm:p-9 md:p-10">
                {status === "sent" ? (
                  <div className="flex h-full flex-col items-start justify-center py-10">
                    <span
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: T.paper, color: T.accent }}
                      aria-hidden="true"
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M5 12.5l4.5 4.5L19 7"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <h2 className="text-2xl font-semibold">Message envoyé</h2>
                    <p className="mt-2 max-w-sm text-sm" style={{ color: T.muted }}>
                      Une réponse arrive sur {values.email || "votre adresse"} sous
                      48 h ouvrées. Pensez à regarder vos indésirables.
                    </p>
                    <button
                      type="button"
                      onClick={reset}
                      className="mt-7 rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition-opacity hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                      style={{ backgroundColor: T.ink, color: "#fff" }}
                    >
                      Écrire un autre message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <h2 className="text-xl font-semibold">Écrire au studio</h2>
                    <p className="mt-2 text-sm" style={{ color: T.muted }}>
                      Les champs marqués d'un astérisque sont nécessaires pour vous
                      répondre.
                    </p>

                    <div className="mt-7 grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="field-label" htmlFor="firstName">
                          Prénom *
                        </label>
                        <input
                          id="firstName"
                          name="firstName"
                          className="field"
                          autoComplete="given-name"
                          placeholder="Camille"
                          value={values.firstName}
                          onChange={set("firstName")}
                          aria-invalid={invalid("firstName")}
                          aria-describedby={errors.firstName ? "err-firstName" : undefined}
                        />
                        {errors.firstName ? (
                          <p className="field-error" id="err-firstName">
                            {errors.firstName}
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <label className="field-label" htmlFor="lastName">
                          Nom *
                        </label>
                        <input
                          id="lastName"
                          name="lastName"
                          className="field"
                          autoComplete="family-name"
                          placeholder="Durand"
                          value={values.lastName}
                          onChange={set("lastName")}
                          aria-invalid={invalid("lastName")}
                          aria-describedby={errors.lastName ? "err-lastName" : undefined}
                        />
                        {errors.lastName ? (
                          <p className="field-error" id="err-lastName">
                            {errors.lastName}
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <label className="field-label" htmlFor="email">
                          E-mail *
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          inputMode="email"
                          className="field"
                          autoComplete="email"
                          placeholder="camille@exemple.fr"
                          value={values.email}
                          onChange={set("email")}
                          aria-invalid={invalid("email")}
                          aria-describedby={errors.email ? "err-email" : undefined}
                        />
                        {errors.email ? (
                          <p className="field-error" id="err-email">
                            {errors.email}
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <label className="field-label" htmlFor="phone">
                          Téléphone
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          inputMode="tel"
                          className="field"
                          autoComplete="tel"
                          placeholder="06 12 34 56 78"
                          value={values.phone}
                          onChange={set("phone")}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="field-label" htmlFor="request">
                          Votre demande porte sur *
                        </label>
                        <div className="relative">
                          <select
                            id="request"
                            name="request"
                            required
                            className="field"
                            value={values.request}
                            onChange={set("request")}
                            aria-invalid={invalid("request")}
                            aria-describedby={errors.request ? "err-request" : undefined}
                          >
                            <option value="" disabled>
                              Choisir…
                            </option>
                            {REQUESTS.map((item) => (
                              <option key={item.value} value={item.value}>
                                {item.label}
                              </option>
                            ))}
                          </select>
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                            style={{ color: T.muted }}
                          >
                            <svg width="11" height="7" viewBox="0 0 24 15" fill="currentColor">
                              <path d="M12 15c-.3 0-.6-.1-.8-.4l-11-13C-.2 1.2-.1.5.3.2c.4-.4 1.1-.3 1.4.1L12 12.5 22.2.4c.4-.4 1-.5 1.4-.1.4.4.5 1 .1 1.4l-11 13c-.1.2-.4.3-.7.3z" />
                            </svg>
                          </span>
                        </div>
                        {errors.request ? (
                          <p className="field-error" id="err-request">
                            {errors.request}
                          </p>
                        ) : null}
                      </div>

                      {values.request === "formation" ? (
                        <div className="sm:col-span-2">
                          <label className="field-label" htmlFor="course">
                            Quelle formation ? *
                          </label>
                          <div className="relative">
                            <select
                              id="course"
                              name="course"
                              required
                              className="field"
                              value={values.course}
                              onChange={set("course")}
                              aria-invalid={invalid("course")}
                              aria-describedby={errors.course ? "err-course" : undefined}
                            >
                              <option value="" disabled>
                                Choisir…
                              </option>
                              {COURSES.map((course) => (
                                <option key={course} value={course}>
                                  {course}
                                </option>
                              ))}
                            </select>
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                              style={{ color: T.muted }}
                            >
                              <svg width="11" height="7" viewBox="0 0 24 15" fill="currentColor">
                                <path d="M12 15c-.3 0-.6-.1-.8-.4l-11-13C-.2 1.2-.1.5.3.2c.4-.4 1.1-.3 1.4.1L12 12.5 22.2.4c.4-.4 1-.5 1.4-.1.4.4.5 1 .1 1.4l-11 13c-.1.2-.4.3-.7.3z" />
                              </svg>
                            </span>
                          </div>
                          {errors.course ? (
                            <p className="field-error" id="err-course">
                              {errors.course}
                            </p>
                          ) : null}
                        </div>
                      ) : null}

                      <div className="sm:col-span-2">
                        <label className="field-label" htmlFor="message">
                          Votre message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          className="field"
                          placeholder="Votre niveau actuel, vos dates possibles, vos questions…"
                          value={values.message}
                          onChange={set("message")}
                          aria-invalid={invalid("message")}
                          aria-describedby={errors.message ? "err-message" : undefined}
                        />
                        {errors.message ? (
                          <p className="field-error" id="err-message">
                            {errors.message}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-6">
                      {/* piège à robots : caché à l'œil et au lecteur d'écran */}
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        value={values.website}
                        onChange={set("website")}
                        style={{
                          position: "absolute",
                          left: "-9999px",
                          width: 1,
                          height: 1,
                          opacity: 0,
                        }}
                      />

                      <label className="flex items-start gap-3 text-xs leading-relaxed" style={{ color: T.muted }}>
                        <input
                          type="checkbox"
                          name="consent"
                          checked={values.consent}
                          onChange={set("consent")}
                          aria-invalid={invalid("consent")}
                          className="mt-0.5 h-4 w-4 shrink-0 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                          style={{ accentColor: T.accent, borderColor: T.line }}
                        />
                        <span>
                          J'accepte que ces informations soient utilisées pour
                          répondre à ma demande. Elles ne servent à rien d'autre. *
                        </span>
                      </label>
                      {errors.consent ? <p className="field-error">{errors.consent}</p> : null}
                    </div>


                    {status === "error" ? (
                      <p
                        className="mt-5 rounded-2xl px-4 py-3 text-sm"
                        role="alert"
                        style={{ backgroundColor: "#FFF3F3", color: "#9B2C3B" }}
                      >
                        L'envoi n'a pas abouti. Réessayez, ou écrivez directement à{" "}
                        <a className="underline" href={`mailto:${STUDIO.email}`}>
                          {STUDIO.email}
                        </a>
                        .
                      </p>
                    ) : null}

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] transition-opacity duration-300 hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-60 sm:w-auto"
                      style={{ backgroundColor: T.ink, color: "#fff" }}
                    >
                      {status === "sending" ? "Envoi…" : "Envoyer le message"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}