import React from 'react';
import { useParams } from 'react-router-dom';
import IntroModification from './IntroModification';

import ChangementPresident from '../pages/Gerer-Entreprises/ChangementPresident';
import TransfertSiegeSociale from '../pages/Gerer-Entreprises/TransfertSiegeSociale';
import ChangementDenomination from '../pages/Gerer-Entreprises/ChangementDenomination';
import ChangementActivite from '../pages/Gerer-Entreprises/ChangementActivite';
import TransformationSarlEnSas from '../pages/Gerer-Entreprises/TransformationSarlEnSas';
import TransformationSasEnSarl from '../pages/Gerer-Entreprises/TransformationSasEnSarl';
import FermerSociete from '../pages/Gerer-Entreprises/FermerSociete';

const pagesConfig = {
  'changement-president': {
    component: <ChangementPresident />,
    intro: {
      title: "Changement de président d'une SAS",
      bulletPoints: [
        { prefix: 'Simple', text: "un simple questionnaire à remplir en ligne" },
        { prefix: 'Sûr', text: "nos juristes vous répondent et vérifient votre dossier" },
        { prefix: 'Rapide', text: "en 48h, votre dossier est envoyé au greffe" },
        { prefix: 'Économique', text: "nos formules sont adaptées à vos besoins" },
      ],
      ctaText: "Changer de président ou de DG",
      ctaLink: "/formulaire/changement-president"
    }
  },
  'transfert-siege-sociale': {
    component: <TransfertSiegeSociale />,
    intro: {
      title: "Transfert de siège social",
      bulletPoints: [
        { prefix: 'Simple', text: "formulaire en ligne en quelques clics" },
        { prefix: 'Sûr', text: "accompagnement par nos experts" },
        { prefix: 'Rapide', text: "traitement express en 48h" },
        { prefix: 'Économique', text: "formules ajustées à vos besoins" }
      ],
      ctaText: "Faire le transfert de siège",
      ctaLink: "/formulaire/transfert-siege-sociale"
    }
  },
  'changement-denomination': {
    component: <ChangementDenomination />,
    intro: {
      title: "Changement de dénomination sociale",
      bulletPoints: [
        { prefix: 'Simple', text: "un formulaire rapide à remplir en ligne" },
        { prefix: 'Sûr', text: "votre dossier est relu par un juriste" },
        { prefix: 'Rapide', text: "envoi au greffe en moins de 48h" },
        { prefix: 'Économique', text: "tarif clair sans frais cachés" }
      ],
      ctaText: "Changer le nom de ma société",
      ctaLink: "/formulaire/changement-denomination"
    }
  },
  'changement-activite': {
    component: <ChangementActivite />,
    intro: {
      title: "Changement d’activité",
      bulletPoints: [
        { prefix: 'Simple', text: "un accompagnement clair à chaque étape" },
        { prefix: 'Sûr', text: "dossier vérifié par nos experts juridiques" },
        { prefix: 'Rapide', text: "déclaré en 48h chrono" },
        { prefix: 'Économique', text: "formule adaptée à vos changements" }
      ],
      ctaText: "Modifier l’activité de ma société",
      ctaLink: "/formulaire/changement-activite"
    }
  },
  'transformation-sarl-en-sas': {
    component: <TransformationSarlEnSas />,
    intro: {
      title: "Transformation SARL en SAS",
      bulletPoints: [
        { prefix: 'Simple', text: "processus assisté en ligne" },
        { prefix: 'Sûr', text: "dossier géré et contrôlé par nos experts" },
        { prefix: 'Rapide', text: "formalités en moins de 72h" },
        { prefix: 'Économique', text: "tarification transparente" }
      ],
      ctaText: "Transformer ma SARL en SAS",
      ctaLink: "/formulaire/transformation-sarl-en-sas"
    }
  },
  'transformation-sas-en-sarl': {
    component: <TransformationSasEnSarl />,
    intro: {
      title: "Transformation SAS en SARL",
      bulletPoints: [
        { prefix: 'Simple', text: "étapes claires à suivre" },
        { prefix: 'Sûr', text: "expertise juridique à chaque étape" },
        { prefix: 'Rapide', text: "votre dossier traité en 48h" },
        { prefix: 'Économique', text: "solution abordable" }
      ],
      ctaText: "Transformer ma SAS en SARL",
      ctaLink: "/formulaire/transformation-sas-en-sarl"
    }
  },
  'fermer-societe': {
    component: <FermerSociete />,
    intro: {
      title: "Dissolution ou Radiation de société",
      bulletPoints: [
        { prefix: 'Simple', text: "formulaire intuitif en ligne" },
        { prefix: 'Sûr', text: "prise en charge complète par nos juristes" },
        { prefix: 'Rapide', text: "formalités enclenchées sous 48h" },
        { prefix: 'Économique', text: "prix étudiés pour les entrepreneurs" }
      ],
      ctaText: "Fermer ma société",
      ctaLink: "/formulaire/fermer-societe"
    }
  }
};

const PageModificationWrapper = () => {
  const { type } = useParams();
  const page = pagesConfig[type];

  if (!page) return <div>Page non trouvée</div>;

  return (
    <>
      <IntroModification {...page.intro} />
      <div className="hidden">{page.component}</div>
    </>
  );
};

export default PageModificationWrapper;
