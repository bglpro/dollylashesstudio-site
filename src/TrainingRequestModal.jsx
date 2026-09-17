import { useEffect, useRef, useState } from "react";
import { C } from "./theme";
import { SITE } from "./config/site";

const FORM_ENDPOINT = "https://api.web3forms.com/submit";

const LEVELS = [
  "Débutante, jamais posé",
  "Quelques poses, en autodidacte",
  "Technicienne en activité",
  "Je ne sais pas",
];

const EMPTY = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  dates: "",
  level: "",
  message: "",
  consent: false,
  website: "", // champ piège
};

/**
 * Champ de saisie.
 *
 * Défini au niveau du module, et non dans le composant : un composant créé
 * pendant le rendu est un type neuf à chaque frappe, React démonte donc
 * l'input et le recrée — le curseur était perdu après chaque lettre.
 */
function Field({ name, label, value, error, onChange, type = "text", required, ...rest }) {
  return (
    <div>
      <label className="rq-label" htmlFor={`rq-${name}`} style={{ color: C.ink }}>
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={`rq-${name}`}
        name={name}
        type={type}
        className="rq-field"
        value={value}
        onChange={onChange}
        aria-invalid={error ? "true" : undefined}
        {...rest}
      />
      {error ? <p className="rq-error">{error}</p> : null}
    </div>
  );
}

const emailIsValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

const MODAL_CSS = `
@keyframes rq-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
.rq-panel { animation: rq-in 260ms cubic-bezier(0.22,1,0.36,1) both; }
.rq-field {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(23,20,18,0.16);
  background: #fff;
  padding: 11px 14px;
  font-size: 0.9375rem;
  color: #171412;
  transition: border-color 200ms ease;
}
.rq-field:focus { outline: none; border-color: ${C.accent}; }
.rq-label { display: block; margin-bottom: 6px; font-size: 0.8125rem; font-weight: 500; }
.rq-error { margin-top: 5px; font-size: 0.8125rem; color: ${C.danger}; }
@media (prefers-reduced-motion: reduce) { .rq-panel { animation-duration: 1ms !important; } }`;

export default function TrainingRequestModal({
  open,
  onClose,
  training,
  accessKey = SITE.forms.training,
  fallbackEmail = SITE.email,
}) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (panelRef.current) panelRef.current.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  // chaque ouverture repart d'un formulaire vierge
  useEffect(() => {
    if (open) {
      setValues(EMPTY);
      setErrors({});
      setStatus("idle");
    }
  }, [open, training]);

  if (!open) return null;

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
    if (!values.phone.trim()) next.phone = "Un numéro nous permet de vous rappeler.";
    if (!values.consent) next.consent = "Votre accord est nécessaire pour vous répondre.";
    return next;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    if (values.website) {
      setStatus("sent"); // robot : on n'envoie rien
      return;
    }

    const fullName = `${values.firstName.trim()} ${values.lastName.trim()}`;

    const payload = {
      access_key: accessKey,
      // objet distinct des messages de contact : le tri se fait tout seul
      subject: `Inscription formation — ${training?.title || ""} — ${fullName}`,
      from_name: "Site DollyLashesStudio",
      replyto: values.email.trim(),
      botcheck: "",

      Formation: training?.title || "",
      Durée: training?.duration || "",

      Prénom: values.firstName.trim(),
      Nom: values.lastName.trim(),
      "E-mail": values.email.trim(),
      Téléphone: values.phone.trim(),
      Ville: values.city.trim() || "non renseignée",
      "Dates souhaitées": values.dates.trim() || "non précisées",
      "Niveau actuel": values.level || "non précisé",
      Message: values.message.trim() || "—",

      "Consentement RGPD": values.consent ? "accordé" : "refusé",
      "Reçu le": new Date().toLocaleString("fr-FR", {
        dateStyle: "full",
        timeStyle: "short",
      }),
      "Page d'origine": typeof window !== "undefined" ? window.location.href : "",
    };

    setStatus("sending");
    const controller =
      typeof AbortController === "function" ? new AbortController() : null;
    const timer = controller
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
      if (import.meta.env?.DEV) console.warn("[inscription]", error);
      setStatus("error");
    } finally {
      if (timer) window.clearTimeout(timer);
    }
  };

  const invalid = (key) => (errors[key] ? "true" : undefined);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <style>{MODAL_CSS}</style>

      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 h-full w-full"
        style={{ backgroundColor: "rgba(23,20,18,0.55)" }}
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rq-title"
        className="rq-panel relative max-h-[92vh] w-full max-w-lg overflow-y-auto bg-white p-6 focus:outline-none sm:p-8"
        style={{ borderRadius: 22 }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-md transition-opacity hover:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          style={{ color: C.muted }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>

        {status === "sent" ? (
          <div className="py-6 text-center">
            <h2 id="rq-title" className="text-2xl font-semibold" style={{ color: C.ink }}>
              Demande envoyée
            </h2>
            <p className="mt-3" style={{ color: C.muted }}>
              Merci. Nous revenons vers vous sous 24 h avec les dates disponibles
              pour « {training?.title} ».
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-8 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white"
              style={{ backgroundColor: C.ink }}
            >
              Fermer
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: C.muted }}>
              Demande d'inscription
            </p>
            <h2 id="rq-title" className="mt-2 text-2xl font-semibold leading-tight" style={{ color: C.ink }}>
              {training?.title}
            </h2>
            <p className="mt-1 text-sm" style={{ color: C.muted }}>
              {training?.duration}
              {training?.level ? ` · ${training.level}` : ""}
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field
                name="firstName"
                label="Prénom"
                value={values.firstName}
                error={errors.firstName}
                onChange={set("firstName")} required autoComplete="given-name"
              />
              <Field
                name="lastName"
                label="Nom"
                value={values.lastName}
                error={errors.lastName}
                onChange={set("lastName")} required autoComplete="family-name"
              />
              <Field
                name="email"
                label="E-mail"
                value={values.email}
                error={errors.email}
                onChange={set("email")} type="email" required autoComplete="email"
              />
              <Field
                name="phone"
                label="Téléphone"
                value={values.phone}
                error={errors.phone}
                onChange={set("phone")} type="tel" required autoComplete="tel"
              />
              <Field
                name="city"
                label="Ville"
                value={values.city}
                error={errors.city}
                onChange={set("city")} autoComplete="address-level2"
              />
              <Field
                name="dates"
                label="Dates souhaitées"
                value={values.dates}
                error={errors.dates}
                onChange={set("dates")} placeholder="ex. mars, ou un samedi"
              />

              <div className="sm:col-span-2">
                <label className="rq-label" htmlFor="rq-level" style={{ color: C.ink }}>
                  Niveau actuel
                </label>
                <select
                  id="rq-level"
                  name="level"
                  className="rq-field"
                  value={values.level}
                  onChange={set("level")}
                >
                  <option value="">Choisir…</option>
                  {LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="rq-label" htmlFor="rq-message" style={{ color: C.ink }}>
                  Message
                </label>
                <textarea
                  id="rq-message"
                  name="message"
                  rows={3}
                  className="rq-field"
                  value={values.message}
                  onChange={set("message")}
                />
              </div>

              {/* piège à robots : invisible pour les humains */}
              <input
                type="text"
                name="website"
                value={values.website}
                onChange={set("website")}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", opacity: 0 }}
              />

              <div className="sm:col-span-2">
                <label className="flex items-start gap-3 text-sm" style={{ color: C.muted }}>
                  <input
                    type="checkbox"
                    name="consent"
                    checked={values.consent}
                    onChange={set("consent")}
                    aria-invalid={invalid("consent")}
                    className="mt-0.5"
                  />
                  <span>
                    J'accepte que mes coordonnées soient utilisées pour répondre à
                    ma demande.
                  </span>
                </label>
                {errors.consent ? <p className="rq-error">{errors.consent}</p> : null}
              </div>

              {status === "error" ? (
                <p className="rq-error sm:col-span-2">
                  L'envoi n'a pas abouti. Réessayez, ou écrivez à{" "}
                  <a className="underline" href={`mailto:${fallbackEmail}`}>
                    {fallbackEmail}
                  </a>
                  .
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-85 disabled:opacity-60 sm:col-span-2"
                style={{ backgroundColor: C.ink }}
              >
                {status === "sending" ? "Envoi…" : "Envoyer ma demande"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
