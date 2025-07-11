import express from "express";
import Dossier from "../models/dossierModel.js";
const router = express.Router();

router.get("/ventes-30-jours", async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 29); // Inclut aujourd'hui

    const result = await Dossier.aggregate([
      {
        $match: {
          statut: "payé",
          createdAt: { $gte: thirtyDaysAgo, $lte: today },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // S'assurer d'avoir les 30 jours même si aucune vente
    const dailySales = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const formatted = date.toISOString().split("T")[0];
      const day = result.find((r) => r._id === formatted);
      dailySales.push({ date: formatted, count: day ? day.count : 0 });
    }

    res.json(dailySales);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
