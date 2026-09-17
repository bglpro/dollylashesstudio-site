import { useEffect } from "react";
import { SITE, absolute, fullTitle } from "./seoConfig";

/**
 * Métadonnées d'une page.
 *
 * react-helmet-async n'apporte rien ici : son intérêt est le rendu serveur,
 * que ce site n'utilise pas. On écrit donc directement dans le <head>, ce
 * qui évite une dépendance et fonctionne sur toutes les versions de React.
 *
 *   <Seo title="..." description="..." path="/formations/volumes" />
 */

/** Crée la balise si elle n'existe pas encore, puis lui donne sa valeur. */
function setMeta(selector, create, value) {
  if (!value) return;
  let node = document.head.querySelector(selector);
  if (!node) {
    node = create();
    document.head.appendChild(node);
  }
  if (node.tagName === "LINK") node.setAttribute("href", value);
  else node.setAttribute("content", value);
}

export default function Seo({
  title,
  description = SITE.description,
  path = "/",
  image = SITE.image,
  type = "website",
  noIndex = false,
  jsonLd = null,
}) {
  const resolved = fullTitle(title);
  const url = absolute(path);
  const cover = absolute(image);

  useEffect(() => {
    document.title = resolved;

    const named = (name) => [
      `meta[name="${name}"]`,
      () => {
        const el = document.createElement("meta");
        el.setAttribute("name", name);
        return el;
      },
    ];
    const property = (prop) => [
      `meta[property="${prop}"]`,
      () => {
        const el = document.createElement("meta");
        el.setAttribute("property", prop);
        return el;
      },
    ];

    setMeta(...named("description"), description);
    setMeta(...property("og:title"), resolved);
    setMeta(...property("og:description"), description);
    setMeta(...property("og:url"), url);
    setMeta(...property("og:image"), cover);
    setMeta(...property("og:type"), type);
    setMeta(...property("og:locale"), SITE.locale);
    setMeta(...named("twitter:card"), "summary_large_image");

    // l'adresse canonique évite que /page et /page/ soient vues comme
    // deux pages distinctes
    setMeta(
      'link[rel="canonical"]',
      () => {
        const el = document.createElement("link");
        el.setAttribute("rel", "canonical");
        return el;
      },
      url
    );

    setMeta(...named("robots"), noIndex ? "noindex, follow" : "index, follow");
  }, [resolved, description, url, cover, type, noIndex]);

  // données structurées propres à la page, retirées en quittant celle-ci
  useEffect(() => {
    if (!jsonLd) return undefined;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.page = "true";
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => script.remove();
  }, [jsonLd]);

  return null;
}
