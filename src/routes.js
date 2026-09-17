/**
 * Table des chemins de l'application.
 *
 * Source unique : App.jsx la parcourt pour déclarer ses <Route>, et les
 * tests s'en servent pour vérifier qu'aucune entrée de menu ne pointe vers
 * une page inexistante — c'est exactement ce qui s'était produit avec
 * /about et /contact, présents dans le menu mais sans route : l'URL
 * changeait et la page restait vide.
 */
export const ROUTE_PATHS = [
  "/",
  "/formations/:slug",
  "/about",
  "/contact",
  "/mentions-legales",
  "/politique-de-confidentialite",
  "/conditions-generales-de-vente",
];

/** "/formations/volumes" correspond au motif "/formations/:slug". */
export function matchesRoute(pathname, patterns = ROUTE_PATHS) {
  const parts = String(pathname || "/").split("#")[0].split("/").filter(Boolean);

  return patterns.some((pattern) => {
    const expected = pattern.split("/").filter(Boolean);
    if (expected.length !== parts.length) return false;
    return expected.every(
      (segment, i) => segment.startsWith(":") || segment === parts[i]
    );
  });
}
