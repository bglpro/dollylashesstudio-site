import { SITE as BRAND } from "./config/site";

export const SITE = {
  url: BRAND.url,
  name: BRAND.shortName,
  title: `Extensions de cils à ${BRAND.city} | ${BRAND.name}`,
  description: `Extensions de cils à ${BRAND.city} : cil à cil, mixte, volume, Wispy & Wet Set. Des poses personnalisées adaptées à votre regard sur rendez-vous, depuis ${BRAND.since}.`,
  image: "/og-image.jpg",
  locale: "fr_FR",
};

/** Google tronque au-delà d'environ 60 et 155 caractères. */
export const LIMITS = { title: 60, description: 160 };

export const absolute = (path = "/") =>
  path.startsWith("http") ? path : `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;

/** Le nom du studio est ajouté sauf s'il y figure déjà. */
export const fullTitle = (title) =>
  !title || title === SITE.title
    ? SITE.title
    : title.includes(SITE.name)
    ? title
    : `${title} | ${SITE.name}`;
