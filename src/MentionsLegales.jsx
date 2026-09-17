import LegalPage, { LegalSection, LegalList } from "./LegalPage";
import Seo from "./Seo";
import { SITE } from "./config/site";

export default function MentionsLegales() {
  return (
    <>
      {/* pages de service : indexées, mais sans valeur de recherche */}
      <Seo
        title="Mentions légales | DollyLashesStudio"
        description="Informations sur l'éditeur et l'hébergeur du site DollyLashesStudio."
        path="/mentions-legales"
      />
      <LegalPage
        title="Mentions légales"
        updated="15 Sept. 2026"
        intro="Informations relatives à l'éditeur et à l'hébergeur du site dollylashesstudio.fr, conformément à la loi pour la confiance dans l'économie numérique."
      >
        <LegalSection title="Éditeur du site">
          <LegalList
            items={[
              `Dénomination : ${SITE.name}`,
              "Forme juridique : Entreprise individuelle",
              `Responsable de la publication : ${SITE.name}`,
              `Adresse : ${SITE.address}`,
              `Téléphone : ${SITE.phone}`,
              `Courriel : ${SITE.email}`,
              `SIRET : ${SITE.siret}`,
              "Code APE / NAF : 96.02B",
            ]}
          />
        </LegalSection>

        <LegalSection title="Hébergeur">
          <LegalList
            items={[
              "Dénomination : Vercel Inc.",
              "Adresse : 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis",
              "Site web : vercel.com",
            ]}
          />
        </LegalSection>
        
        <LegalSection title="Activité réglementée">
          <p>
            L'activité de soins esthétiques exercée par DOLLYLASHESSTUDIO est
            soumise à la détention des qualifications professionnelles prévues par
            la loi n° 96-603 du 5 juillet 1996.
          </p>
          <LegalList
            items={[
              "Diplôme ou titre : Certification professionnelle de technicienne chez Salyma Beauty, Valene Beauty & Aisha Lashes",
              "Assurance responsabilité civile professionnelle : Crédit Agricole, police n° 14379224907",
              "Couverture géographique : France",
            ]}
          />
        </LegalSection>

        <LegalSection title="Propriété intellectuelle">
          <p>
            L'ensemble des contenus du site — textes, photographies, vidéos,
            logo, charte graphique — est la propriété exclusive de
            DOLLYLASHESSTUDIO ou de ses partenaires, et protégé par le code de la
            propriété intellectuelle.
          </p>
          <p>
            Toute reproduction, représentation ou réutilisation, totale ou
            partielle, sans autorisation écrite préalable, est interdite et
            constitue une contrefaçon au sens des articles L.335-2 et suivants.
          </p>
        </LegalSection>

        <LegalSection title="Responsabilité">
          <p>
            Les informations publiées sur ce site sont données à titre indicatif
            et peuvent évoluer. Les résultats des prestations varient selon la
            nature des cils naturels, le respect des consignes d'entretien et le
            mode de vie de chaque cliente ; aucune durée de tenue ne peut être
            garantie de façon absolue.
          </p>
          <p>
            Les liens vers des sites tiers sont fournis pour votre commodité.
            DOLLYLASHESSTUDIO n'exerce aucun contrôle sur leur contenu et décline
            toute responsabilité à leur égard.
          </p>
        </LegalSection>

        <LegalSection title="Contact">
          <p>
            Pour toute question relative au site ou à son contenu :{" "}
            contact@dollylashesstudio.fr.
          </p>
        </LegalSection>
        
      </LegalPage>
    </>
  );
}
