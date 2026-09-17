/* Version corrigée : elle mesure l'ancre que vous visez vraiment.
   Collez-la dans la console, placez la page où vous la voulez, puis :
       mesure("#prestations")
   Le premier nombre du tableau est celui à me transmettre. */
function mesure(ancre) {
  if (!ancre) return "Précisez l'ancre : mesure('#prestations')";

  const cible = document.querySelector(ancre);
  if (!cible) return `Ancre ${ancre} introuvable sur cette page.`;

  const hautAbsolu = cible.getBoundingClientRect().top + window.scrollY;
  const offset = Math.round(hautAbsolu - window.scrollY);

  console.table({
    "ancre mesurée": ancre,
    "nextOffset à me donner": offset,
    "largeur d'écran": window.innerWidth,
    "position actuelle (scrollY)": Math.round(window.scrollY),
    "haut de la section dans la page": Math.round(hautAbsolu),
  });
  return offset;
}
