import entrepriseModel from "../models/entrepriseModel.js";  // Nouveau nom
import axios from 'axios';


export const createEntreprise = async (req, res) => {
  try {
    const entrepriseData = {
      entrepriseType: req.body.entrepriseType,
      profession: req.body.profession,
      startDate: req.body.startDate,
      domiciliation: req.body.domiciliation,
      workingAlone: req.body.workingAlone,
      entrepriseName: req.body.entrepriseName,
      secteurActivite: req.body.secteurActivite,
      autoEntrepreneur: req.body.autoEntrepreneur,
      userId: req.body.userId  // Injecté par userAuth
    };

    const newEntreprise = new entrepriseModel(entrepriseData);
    const savedEntreprise = await newEntreprise.save();

    res.status(201).json({ success: true, entreprise: savedEntreprise });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET all entreprises
export const getAllEntreprises = async (req, res) => {
    try {
      const entreprises = await entrepriseModel.find().populate('userId', 'email name');
      res.status(200).json({ success: true, entreprises });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

//export const searchEntreprise = async (req, res) => {
 // return res.json([
   // {
    //  nom: "Airbus SAS",
    //  siret: "77556914700029",
    //  adresse: "1 Rond Point Maurice Bellonte 31700 Blagnac"
   // },
   // {
   //   nom: "Airbus Operations",
    //  siret: "42023522200030",
   //   adresse: "316 Route de Bayonne 31060 Toulouse"
   // }
  //]);
//};



export const searchEntreprise = async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: 'Requête vide.' });

  try {
    const { data } = await axios.get(`https://recherche-entreprises.api.gouv.fr/search`, {
      params: {
        q: query,
        per_page: 10,
      },
    });

    const results = (data.results || []).map((e) => {
      const siret = e.siege?.siret || e.siret || "Inconnu";

      // 🔧 Construction manuelle de l'adresse si disponible
      const siege = e.siege || {};
      const adresseParts = [
        siege.numero_voie,
        siege.type_voie,
        siege.nom_voie || siege.libelle_voie,
        siege.code_postal,
        siege.commune,
      ].filter(Boolean); // supprime les `undefined` ou `null`

      const adresse = adresseParts.length > 0 ? adresseParts.join(' ') : "Adresse inconnue";

      return {
        nom: e.nom_raison_sociale || e.nom_complet || "Nom inconnu",
        siret,
        adresse,
      };
    });

    return res.status(200).json(results);
  } catch (error) {
    console.error("❌ Erreur recherche entreprise :", error.message);
    return res.status(500).json({ message: "Erreur de l'API SIRENE." });
  }
};
