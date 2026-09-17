/**
 * Résolution des logos.
 *
 * Le module d'images peut exporter ses visuels de deux façons — en export
 * nommé direct, ou dans l'objet BRAND_IMAGES — et chaque entrée peut être
 * soit une chaîne, soit un objet { src }. On accepte les deux plutôt que
 * de faire dépendre trois composants d'une forme précise.
 */
import * as images from "./assets/images";

export function logoSrc(name) {
  const entry = images[name] ?? images.BRAND_IMAGES?.[name] ?? null;
  if (!entry) return "";
  return typeof entry === "string" ? entry : entry.src || "";
}

export const LOGO_NOIR = logoSrc("logoNoirTrp");
export const LOGO_BLANC = logoSrc("logoBlancTrp");
export const LOGO_ROUGE = logoSrc("logoRougeTrp");
