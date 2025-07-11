
import Stripe from 'stripe';
import Paiement from '../models/paiementModel.js';
import Dossier from '../models/dossierModel.js';
import DossierModification from '../models/dossierModificationModel.js';
import DossierFermeture from '../models/DossierFermetureModel.js';
import { createNotification } from "../utils/createNotification.js";



import mongoose from "mongoose";

import userModel from '../models/userModel.js';




const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { userId, dossierId, modificationType, modificationId, amount, isFermeture } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ error: "Données manquantes dans la requête." });
    }

    let productName;
    if (isFermeture) {
      productName = `Fermeture d'entreprise`;
    } else if (modificationType) {
      productName = `Formalité : ${modificationType.replace(/_/g, ' ')}`;
    } else {
      productName = `Création d'entreprise`;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: productName,
              metadata: {
                dossierId,
                modificationId,
                modificationType,
                isFermeture: isFermeture || false
              },
            },
            unit_amount: amount * 100, // Convertir en centimes
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        dossierId,
        modificationType,
        modificationId,
        isFermeture: isFermeture || false
      },
      success_url: `${process.env.FRONTEND_URL}/paiement/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/paiement/cancel`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Erreur création session Stripe :", err.message);
    res.status(500).json({ error: "Erreur lors de la création de la session de paiement." });
  }
};



export const verifySession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

    if (session.payment_status === 'paid') {
      const existing = await Paiement.findOne({ sessionId: session.id });
      if (existing) return res.status(200).json(existing);

      const isModification = [
        "TRANSFERT_SIEGE",
        "CHANGEMENT_DENOMINATION", 
        "CHANGEMENT_PRESIDENT",
        "CHANGEMENT_ACTIVITE",
        "TRANSFORMATION_SARL_EN_SAS",
        "TRANSFORMATION_SAS_EN_SARL"
      ].includes(session.metadata.modificationType);

      const isFermeture = session.metadata.isFermeture === 'true';

      // Determine the correct model and update accordingly
      let dossierModel;
      let updateQuery;
      
      if (isFermeture) {
        dossierModel = "DossierFermeture";
        updateQuery = {
          statut: 'payé',
          etatAvancement: 'documents'
        };
        await DossierFermeture.findByIdAndUpdate(
          session.metadata.dossierId, 
          updateQuery
        );
      } else if (isModification) {
        dossierModel = "DossierModification";
        updateQuery = {
          statut: 'payé', 
          etatAvancement: 'documents'
        };
        await DossierModification.findByIdAndUpdate(
          session.metadata.modificationId,
          updateQuery
        );
      } else {
        dossierModel = "Dossier";
        updateQuery = {
          statut: 'payé',
          etatAvancement: 'documents'
        };
        await Dossier.findByIdAndUpdate(
          session.metadata.modificationId,
          updateQuery
        );
      }

      // Create payment record
      const paiement = await Paiement.create({
        user: session.metadata.userId,
        dossier: isFermeture ? session.metadata.dossierId : session.metadata.modificationId,
        dossierModel,
        montant: session.amount_total / 100,
        statut: 'payé',
        méthode: 'stripe',
        sessionId: session.id,
        modificationType: isFermeture ? 'FERMETURE' : session.metadata.modificationType
      });

      // Create appropriate notification
      let message;
      if (isFermeture) {
        message = "Paiement reçu pour une fermeture d'entreprise";
      } else {
        message = `Paiement reçu pour ${session.metadata.modificationType?.replace(/_/g, " ") || 'création dentreprise'}`;
      }

      await createNotification({
        userId: process.env.ADMIN_ID,
        message,
        link: `/admin/paiements`
      });

      res.status(201).json(paiement);
    } else {
      res.status(400).json({ error: "Paiement non effectué." });
    }
  } catch (err) {
    console.error("Erreur vérification session Stripe :", err.message);
    res.status(500).json({ error: "Erreur lors de la vérification de session." });
  }
};

export const getAllPaiements = async (req, res) => {
  try {
    const paiements = await Paiement.find()
      .populate('user', 'name email')
      .populate('dossier', 'type statut')
      .populate('dossierModification', 'type statut');
    res.status(200).json({ success: true, paiements });
  } catch (err) {
    console.error("Erreur récupération paiements :", err.message);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des paiements." });
  }
};
export const getStripePayments = async (req, res) => {
  try {
    let allSessions = [];
    let hasMore = true;
    let startingAfter = null;

    // ✅ Récupérer toutes les sessions avec pagination
    while (hasMore) {
      const response = await stripe.checkout.sessions.list({
        limit: 100,
        ...(startingAfter && { starting_after: startingAfter })
      });

      allSessions = allSessions.concat(response.data);
      hasMore = response.has_more;
      startingAfter = response.data[response.data.length - 1]?.id;
    }

    // ✅ Formater les sessions
    const formatted = await Promise.all(
      allSessions.map(async (session) => {
        const userId = session.metadata?.userId;
        let clientEmail = session.customer_details?.email || 'Non spécifié';

        // Tentative de récupération email utilisateur si userId valide
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
          try {
            const user = await userModel.findById(userId).select('email');
            if (user) clientEmail = user.email;
          } catch (err) {
            console.warn(`⚠️ Erreur récupération user ${userId} :`, err.message);
          }
        } else if (userId) {
          clientEmail = `ID non valide : ${userId}`;
        }

        return {
          id: session.id,
          montant: session.amount_total / 100,
          devise: session.currency?.toUpperCase() || 'EUR',
          statut: session.payment_status,
          date: new Date(session.created * 1000).toLocaleString('fr-FR'),
          methode: session.payment_method_types?.[0] || 'Inconnue',
          client: clientEmail,
        };
      })
    );
console.log("Total sessions récupérées Stripe :", allSessions.length);

    res.status(200).json({ success: true, paiements: formatted });
  } catch (err) {
    console.error("❌ Erreur Stripe (getStripePayments) :", err.message);
    res.status(500).json({ error: "Erreur lors de la récupération des paiements Stripe." });
  }
};

/*PaimentBy id */


export const getPaiementsByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const paiements = await Paiement.find({ user: userId })
      .populate('user', 'name email')
      .populate('dossier', 'type statut');

    const enriched = await Promise.all(
      paiements.map(async (paiement) => {
        // Skip Stripe info if no sessionId
        if (!paiement.sessionId) {
          return {
            ...paiement.toObject(),
            stripe: {
              montant: paiement.montant,
              devise: "EUR",
              statut: paiement.statut,
              date: paiement.date,
              methode: paiement.méthode || "-"
            }
          };
        }

        try {
          const stripeSession = await stripe.checkout.sessions.retrieve(paiement.sessionId);
          return {
            ...paiement.toObject(),
            stripe: {
              montant: stripeSession.amount_total / 100,
              devise: stripeSession.currency.toUpperCase(),
              statut: stripeSession.payment_status,
              date: new Date(stripeSession.created * 1000),
              methode: stripeSession.payment_method_types[0]
            }
          };
        } catch (err) {
          console.error(`❌ Paiement ${paiement._id} Stripe error:`, err.message);
          return {
            ...paiement.toObject(),
            stripe: {
              montant: paiement.montant,
              devise: "EUR",
              statut: "Erreur Stripe",
              date: paiement.date,
              methode: paiement.méthode || "-"
            }
          };
        }
      })
    );

    res.status(200).json({ success: true, paiements: enriched });
  } catch (err) {
    console.error("Erreur getPaiementsByUser:", err.message);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};



