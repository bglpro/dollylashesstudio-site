import LegalPage, { LegalSection, LegalList } from "./LegalPage";
import { SITE } from "./config/site";

export default function Confidentialite() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      updated="15 Sept. 2026"
      intro="Cette page explique quelles données personnelles sont collectées sur dollylashesstudio.fr, pourquoi, combien de temps elles sont conservées, et comment exercer vos droits."
    >
      <LegalSection title="Responsable du traitement">
        <LegalList
          items={[
            `DOLLYLASHESSTUDIO, Entrepreneur individuel, SIRET ${SITE.siret}`,
            `Adresse : ${SITE.address}`,
            `Contact : ${SITE.email} — ${SITE.phone}`,
          ]}
        />
      </LegalSection>

      <LegalSection title="Données collectées et finalités">
        <p>
          Aucune donnée n'est collectée à votre insu : chaque information
          provient d'un formulaire que vous remplissez volontairement.
        </p>
        <LegalList
          items={[
            "Formulaire de contact : prénom, nom, e-mail, téléphone, message. Finalité : répondre à votre demande. Base légale : votre consentement.",
            "Demande d'inscription à une formation : prénom, nom, e-mail, téléphone, ville, dates souhaitées, niveau, message. Finalité : vous orienter et organiser la session. Base légale : mesures précontractuelles.",
            "Réservation d'une prestation : nom, e-mail, créneau choisi. Finalité : gérer le rendez-vous. Base légale : exécution du contrat.",
            "Achat de l'ebook : nom, e-mail, données de facturation. Finalité : livrer le produit et respecter les obligations comptables. Base légale : exécution du contrat et obligation légale.",
            "Fiche cliente au studio : antécédents pertinents pour la pose, allergies signalées, historique des prestations. Finalité : sécurité de la prestation. Base légale : votre consentement.",
          ]}
        />
        <p>
          Les informations relatives à une allergie ou à une sensibilité
          oculaire sont des données de santé. Elles ne sont recueillies qu'avec
          votre accord explicite, ne servent qu'à adapter la prestation, et ne
          sont transmises à personne.
        </p>
      </LegalSection>

      <LegalSection title="Destinataires">
        <p>
          Vos données ne sont ni vendues, ni louées, ni cédées. Elles sont
          traitées par DOLLYLASHESSTUDIO et, pour les seules finalités décrites
          ci-dessus, par les prestataires suivants :
        </p>
        <LegalList
          items={[
            "Web3Forms — acheminement des formulaires du site vers la boîte e-mail du studio.",
            "Calendly — prise de rendez-vous en ligne.",
            "Lemon Squeezy — paiement et livraison de l'ebook ; aucune donnée bancaire ne transite par ce site ni n'y est conservée.",
            "Vercel Inc. (États-Unis) — hébergement des pages du site.",
          ]}
        />
        <p>
          Certains de ces prestataires sont établis hors de l'Union européenne.
          Les transferts correspondants reposent sur les clauses contractuelles
          types de la Commission européenne.
        </p>
      </LegalSection>

      <LegalSection title="Durées de conservation">
        <LegalList
          items={[
            "Messages de contact restés sans suite : 12 mois.",
            "Demandes d'inscription à une formation : 3 ans à compter du dernier échange.",
            "Fiches clientes : 3 ans après la dernière prestation.",
            "Pièces comptables et factures : 10 ans, conformément au code de commerce.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Cookies et mesure d'audience">
        <p>
          Ce site ne dépose aucun cookie publicitaire ni traceur de suivi
          comportemental. Seul un espace de stockage local est utilisé, pour
          mémoriser la fermeture de la bannière d'annonce — il ne contient
          aucune donnée personnelle et n'est lu par personne d'autre que votre
          navigateur.
        </p>
      </LegalSection>

      <LegalSection title="Vos droits">
        <p>
          Conformément au règlement général sur la protection des données et à
          la loi Informatique et Libertés, vous disposez des droits suivants :
        </p>
        <LegalList
          items={[
            "Accès : obtenir une copie des données vous concernant.",
            "Rectification : corriger une information inexacte.",
            "Effacement : demander la suppression de vos données.",
            "Limitation et opposition : restreindre ou refuser un traitement.",
            "Portabilité : récupérer vos données dans un format lisible.",
            "Retrait du consentement, à tout moment, pour les traitements qui en dépendent.",
          ]}
        />
        <p>
          Pour exercer ces droits, écrivez à contact@dollylashesstudio.fr. Une réponse vous
          sera apportée sous un mois. En cas de désaccord persistant, vous
          pouvez saisir la CNIL — 3 place de Fontenoy, TSA 80715, 75334 Paris cedex 07.
        </p>
      </LegalSection>

      <LegalSection title="Sécurité">
        <p>
          Le site est servi en HTTPS. L'accès à la boîte e-mail et aux outils
          de réservation est protégé par des mots de passe distincts et une
          authentification à deux facteurs.
        </p>
      </LegalSection>

      <LegalSection title="Modifications de la Politique de Confidentialité">
        <p>
          DOLLYLASHESSTUDIO se réserve le droit de modifier la présente politique
          de confidentialité à tout moment. Les modifications seront communiquées
          sur le site et seront applicables dès leur publication. Nous vous encourageons 
          à la consulter régulièrement.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
