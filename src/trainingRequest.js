import { SITE } from "./config/site";

/**
 * Construction du lien d'inscription à une formation.
 *
 * Trois modes possibles :
 *   "mail"     → ouvre le client mail avec un message déjà rédigé
 *   "form"     → renvoie vers /contact pré-rempli (recommandé)
 *   "calendly" → renvoie vers l'agenda
 */

/** Champs que la personne n'a plus qu'à compléter. */
export const REQUEST_FIELDS = [
  "Prénom",
  "Nom",
  "E-mail",
  "Téléphone",
  "Ville",
  "Dates souhaitées",
  "Niveau actuel (débutante, déjà technicienne…)",
];

/**
 * Corps du message. Les retours à la ligne sont en CRLF : certains clients
 * mail (Outlook en tête) ignorent un simple \n dans une URL mailto.
 */
export function buildRequestBody(training, fields = REQUEST_FIELDS) {
  const duration = training?.duration ? ` (${training.duration})` : "";

  return [
    "Bonjour,",
    "",
    `Je souhaite participer à la formation « ${training?.title || ""} »${duration}.`,
    "",
    "Mes coordonnées :",
    ...fields.map((field) => `${field} : `),
    "",
    "Questions éventuelles :",
    "",
    "",
    "Merci d'avance,",
  ].join("\r\n");
}

export function buildTrainingMailto(training, email, fields = REQUEST_FIELDS) {
  const subject = `Inscription — ${training?.title || "formation"}`;
  const body = buildRequestBody(training, fields);
  return `mailto:${email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

/** Renvoie vers le formulaire de contact, type de demande et formation pré-remplis. */
export function buildTrainingFormLink(training, path = "/contact") {
  const params = new URLSearchParams({
    demande: "formation",
    formation: training?.title || "",
  });
  return `${path}?${params.toString()}`;
}

export function trainingActionHref(
  training,
  { mode = "mail", email = SITE.email, bookingHref = SITE.booking, contactPath = "/contact", } = {}
) {
  if (mode === "calendly" && bookingHref) return bookingHref;
  if (mode === "form") return buildTrainingFormLink(training, contactPath);
  return buildTrainingMailto(training, email);
}
