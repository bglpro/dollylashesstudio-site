const env = (key, fallback) => {
  try {
    return import.meta.env?.[key] || fallback;
  } catch {
    return fallback;
  }
};

export const SITE = {
  name: "DOLLYLASHESSTUDIO",
  shortName: "DollyLashesStudio",
  city: "Meaux",
  region: "Seine-et-Marne",
  since: 2019,
  url: env("VITE_SITE_URL", "https://dollylashesstudio.fr"),

  /* --- contacts --- */
  siret: "979 745 957 00014",
  address: "30 Avenue de l'Épinette, 77100 MEAUX",
  email: "contact@dollylashesstudio.fr",
  phone: "+33 7 49 93 23 79",

  /* --- liens externes --- */
  booking: env(
    "VITE_BOOKING_URL",
    "https://calendly.com/dollylashess"
  ),
  ebookCheckout: env(
    "VITE_EBOOK_CHECKOUT",
    "https://dollylashesstudio.lemonsqueezy.com/checkout/buy/3ec213b4-2876-4123-a09d-3d611c9f3507"
  ),

  /* --- réseaux --- */
  socials: {
    instagram: "https://www.instagram.com/dollylashesstudio/",
    tiktok: "https://www.tiktok.com/@dollylashestudio",
  },

  forms: {
    contact: env("VITE_WEB3FORMS_KEY", "c17e10a4-48af-4427-9771-74d70c880726"),
    training: env(
      "VITE_WEB3FORMS_FORMATION_KEY",
      env("VITE_WEB3FORMS_KEY", "2ae91ff1-56b1-4d10-837a-2f8cb049db3e")
    ),
  },
};

/** Liste prête à l'emploi pour le pied de page et le menu plein écran. */
export const SOCIAL_LINKS = [
  { id: "instagram", label: "Instagram", href: SITE.socials.instagram },
  { id: "tiktok", label: "TikTok", href: SITE.socials.tiktok },
];

/** Bouton de réservation, réutilisé tel quel à plusieurs endroits. */
export const BOOKING_CTA = { label: "Réserver", href: SITE.booking };

export const mailto = (subject) =>
  `mailto:${SITE.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;

export default SITE;