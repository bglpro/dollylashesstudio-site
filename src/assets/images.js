// BRAND
import logoNoirTrp from "./brand/logo-dolly-lashes-studio-paris-noir-transparent.svg";
import logoBlancTrp from "./brand/logo-dolly-lashes-studio-paris-blanc-transparent.svg";
import logoRougeTrp from "./brand/logo-dolly-lashes-studio-paris-rouge-transparent.svg";

// FORMATION
import posePrestation from "./training/formation-cours-complets-debutant-pose-extensions-cils-studio-meaux.webp";
import coffretChaise from "./training/formation-volumes-coffret-dolly-lashes-studio-chaise-maquillage.webp";
import livretFormation from "./training/formation-cil-a-cil-volumes-livret-formation-initiation-extensions-cils.webp";
import formationCoachingPrive from "./training/formation-coaching-prive-mapping-cils.webp";
import formationCreationContenu from "./training/formation-creation-contenu-tournage-studio.webp";

// STUDIO
import carte800 from "./carte-fidelite-800.webp";
import carte1600 from "./carte-fidelite-1600.webp";
import CouvertureEbook from "./couverture-ebook-le-code-des-cils.webp";
import backstageShooting from "./backstage-shooting-dolly-lashes-studio-paris.webp";

//PRESTATIONS BRAND
import brandwhite from "./prestation-logo/logo-dollylashesstudio-white.webp";
import brandblack from "./prestation-logo/logo-dollylashesstudio-black.webp";
import brandbrown from "./prestation-logo/logo-dollylashesstudio-brown.webp";
import brandred from "./prestation-logo/logo-dollylashesstudio-red.webp";

export const BRAND_IMAGES = {
  logoBlancTrp: {
    src: logoBlancTrp,
    alt: "Logo Dolly Lashes Studio Paris en blanc transparent",
  },
  logoNoirTrp: {
    src: logoNoirTrp,
    alt: "Logo Dolly Lashes Studio Paris en noir transparent",
  },
  logoRougeTrp: {
    src: logoRougeTrp,
    alt: "Logo Dolly Lashes Studio Paris en rouge bordeaux transparent",
  },
  openGraph: "https://dollylashesstudio.fr/og-dolly-lashes-studio.jpeg",
};

export const FORMATION_IMAGESS = [
  {
    id: "cours-classique-debutante",
    src: posePrestation,
    alt: "Dolly pose des extensions de cils sur une cliente allongée dans son studio à Meaux",
  },
  {
    id: "les-volumes",
    src: coffretChaise,
    alt: "Coffret bordeaux Dolly Lashes Studio Paris posé sur une chaise de maquillage noire",
  },
  {
    id: "livret",
    src: livretFormation,
    alt: "Livret de formation au cours d'initiation aux extensions de cils Dolly Lashes Studio",
  },
  {
    id: "coaching-prive",
    src: formationCreationContenu,
    alt: "Élève en coaching privé s'exerçant au mapping et à la manipulation des extensions de cils sur planche d'entraînement",
  },
  {
    id: "creation-contenu",
    src: formationCoachingPrive,
    alt: "Tournage d'une vidéo de formation au studio DollyLashesStudio, deux élèves présentant le livret de cours devant un opérateur caméra",
  }
];

export const STUDIO_IMAGES = [
  {
    id: "fidelite800",
    src: carte800,
    alt: "Carte de fidélité Dolly Lashes Studio tenue par une main gantée en cabine",
  },
  {
    id: "fidelite1600",
    src: carte1600,
    alt: "Carte de fidélité Dolly Lashes Studio tenue par une main gantée en cabine",
  },
  {
    id: "ebook",
    src: CouvertureEbook,
    alt: "Couverture de l'ebook Le Code des Cils, guide de l'extension de cils",
  },
  {
    id: "backstage",
    src: backstageShooting,
    alt: "Séance photo de la marque Dolly Lashes Studio : modèle en tenue bordeaux devant le photographe",
  },
];

export const BRAND_PRESTATION = {
  brandwhite: {
    src: brandwhite,
    alt: "Logo miniature Dolly Lashes Studio Paris en blanc",
  },
  brandblack: {
    src: brandblack,
    alt: "Logo miniature Dolly Lashes Studio Paris en noir",
  },
  brandred: {
    src: brandred,
    alt: "Logo miniature Dolly Lashes Studio Paris en rouge bordeaux",
  },
  brandbrown: {
    src: brandbrown,
    alt: "Logo miniature Dolly Lashes Studio Paris en marron",
  },
};

export default {FORMATION_IMAGESS, STUDIO_IMAGES, BRAND_IMAGES, BRAND_PRESTATION,};