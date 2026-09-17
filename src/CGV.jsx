import LegalPage, { LegalSection, LegalList } from "./LegalPage";
import Seo from "./Seo";
import { SITE } from "./config/site";

export default function CGV() {
  return (
    <>
      {/* pages de service : indexées, mais sans valeur de recherche */}
      <Seo
        title="Conditions générales de vente | DollyLashesStudio"
        description="Réservations, formations et contenus numériques : conditions, annulation et remboursement."
        path="/conditions-generales-de-vente"
      />
      <LegalPage
        title="Conditions générales de vente"
        updated="15 Sept. 2026"
        intro="Ces conditions régissent les réservations de prestations, les inscriptions aux formations et l'achat de contenus numériques auprès de DOLLYLASHESSTUDIO."
      >
        <LegalSection title="Identité du vendeur">
          <LegalList
            items={[
              `DOLLYLASHESSTUDIO, Entrepreneur individuel, SIRET ${SITE.siret}`,
              `Adresse : ${SITE.address}`,
              `Contact : ${SITE.email} — ${SITE.phone}`,
            ]}
          />
        </LegalSection>

        <LegalSection title="Prestations au studio">
          <LegalList
            items={[
              "Les tarifs affichés sur le site sont exprimés en euros, toutes taxes comprises.",
              "La réservation est confirmée par l'e-mail de confirmation du créneau. Un email de rappel est envoyé 24 heures avant la prestation.",
              "Un acompte de 15 € via Paypal est demandé à la réservation. Il est déduit du montant de la prestation et reste acquis en cas d'annulation tardive ou d'absence.",
              "Toute annulation doit être signalée au moins 48 heures à l'avance.",
              "Annulation tardive ou absence : l'acompte n'est pas remboursé.",
              "Le studio se réserve le droit de refuser une pose si l'état des cils naturels, une irritation ou une contre-indication le justifie. Dans ce cas, l'acompte est intégralement restitué.",
            ]}
          />
          <p>
            Les prestations réalisées sur place ne relèvent pas du droit de
            rétractation, celui-ci ne s'appliquant pas aux services de soins
            corporels fournis à une date convenue (article L.221-28 du code de la
            consommation).
          </p>
        </LegalSection>

        <LegalSection title="Formations">
          <LegalList
            items={[
              "L'inscription devient ferme à réception du règlement ou du premier versement.",
              "Le paiement peut être échelonné entre la date d'inscription et le jour de la formation.",
              "En cas d’annulation par l’élève, le montant versé est remboursé sous forme d’avoir, valable 12 mois à compter de sa date d’émission.",
              "Si DOLLYLASHESSTUDIO annule ou reporte une session, l'élève choisit entre un report sans frais et le remboursement intégral.",
              "Le kit professionnel offert reste acquis à l'élève ayant suivi la formation dans son intégralité.",
            ]}
          />
          <p>
            Le certificat d'aptitude est délivré après validation des acquis. Il
            atteste du suivi de la formation et ne constitue pas un diplôme
            d'État.
          </p>
        </LegalSection>

        <LegalSection title="Contenus numériques (ebook)">
          <p>
            L'ebook est livré par téléchargement immédiat après paiement. En
            validant votre commande, vous demandez expressément l'exécution
            immédiate de la prestation et reconnaissez perdre votre droit de
            rétractation de quatorze jours, conformément à l'article L.221-28 13°
            du code de la consommation.
          </p>
          <p>
            Aucun remboursement ne peut donc être accordé après téléchargement,
            sauf défaut technique rendant le fichier inutilisable : dans ce cas,
            écrivez à contact@dollylashesstudio.fr, un nouveau lien vous sera transmis.
          </p>
          <p>
            L'ebook est destiné à un usage strictement personnel. Sa revente, son
            partage ou sa diffusion, même partielle, sont interdits.
          </p>
        </LegalSection>

        <LegalSection title="Paiement">
          <LegalList
            items={[
              "Prestations au studio : espèces et virement.",
              "Formations : par virement, échelonnement possible.",
              "Ebook : paiement en ligne sécurisé via Lemon Squeezy. Aucune donnée bancaire n'est conservée par DOLLYLASHESSTUDIO.",
            ]}
          />
        </LegalSection>

        <LegalSection title="Garanties légales">
          <p>
            Indépendamment de toute garantie commerciale, le vendeur reste tenu
            de la garantie légale de conformité (articles L.217-4 et suivants du
            code de la consommation) et de la garantie contre les vices cachés
            (articles 1641 et suivants du code civil).
          </p>
        </LegalSection>

        <LegalSection title="Litiges">
          <p>
            Les présentes conditions sont soumises au droit français. En cas de
            différend, une solution amiable sera recherchée en priorité. À défaut,
            le consommateur peut saisir gratuitement le médiateur de la
            consommation mentionné dans les mentions légales, ou la plateforme
            européenne de règlement en ligne des litiges.
          </p>
        </LegalSection>
      </LegalPage>
    </>
  );
}
