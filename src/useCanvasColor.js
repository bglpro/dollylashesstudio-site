import { useEffect } from "react";

/**
 * Teinte le canevas et la barre d'état selon l'endroit où l'on se trouve.
 * Les zones de rebond et les barres de Safari prennent cette couleur : sans
 * ça, elles restent figées sur une seule teinte pour toute la page.
 */
export function useCanvasColor({ top, middle, bottom }) {
  useEffect(() => {

    const update = () => {
      const y = window.scrollY;
      const fond = document.documentElement.scrollHeight;
      const vue = window.innerHeight;

      const hero = document.querySelector(".hero");
      const finDuHero = hero ? hero.getBoundingClientRect().bottom : vue;
      const couleur =
        finDuHero > 40 ? top : y + vue > fond - 200 ? bottom : middle;

      document.documentElement.style.backgroundColor = couleur;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [top, middle, bottom]);
}