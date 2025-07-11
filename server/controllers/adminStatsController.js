import Dossier from '../models/dossierModel.js';
import DossierModification from '../models/dossierModificationModel.js';
import DossierFermeture from '../models/DossierFermetureModel.js';
import Paiement from '../models/paiementModel.js';

// Helper function to count documents by status
const countByStatus = async (Model) => {
  const result = await Model.aggregate([
    {
      $group: {
        _id: '$statut',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$prix' } // Add revenue calculation
      }
    }
  ]);
  
  return result.reduce((acc, { _id, count, totalRevenue }) => {
    acc[_id] = { count, totalRevenue: totalRevenue || 0 };
    return acc;
  }, {});
};

// Helper function to count documents by type
const countByType = async (Model, field = 'type') => {
  const result = await Model.aggregate([
    {
      $group: {
        _id: `$${field}`,
        count: { $sum: 1 },
        totalRevenue: { $sum: '$prix' } // Add revenue calculation
      }
    }
  ]);
  
  return result;
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get counts by status for each collection with revenue
    const [dossierCounts, modificationCounts, fermetureCounts, paymentStats] = await Promise.all([
      countByStatus(Dossier),
      countByStatus(DossierModification),
      countByStatus(DossierFermeture),
      // Get payment stats grouped by dossier type
      Paiement.aggregate([
        {
          $group: {
            _id: "$dossierModel",
            totalAmount: { $sum: "$montant" },
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    // Convert payment stats to a more usable format
    const paymentStatsFormatted = paymentStats.reduce((acc, curr) => {
      acc[curr._id] = {
        totalAmount: curr.totalAmount,
        count: curr.count
      };
      return acc;
    }, {});

    // Combine all status counts with revenue
    const combinedStats = {
      'en attente': {
        count: (dossierCounts['en attente']?.count || 0) + 
               (modificationCounts['en attente']?.count || 0) + 
               (fermetureCounts['en attente']?.count || 0),
        revenue: (dossierCounts['en attente']?.totalRevenue || 0) + 
                 (modificationCounts['en attente']?.totalRevenue || 0) + 
                 (fermetureCounts['en attente']?.totalRevenue || 0),
        revenueEUR: ((dossierCounts['en attente']?.totalRevenue || 0) + 
                    (modificationCounts['en attente']?.totalRevenue || 0) + 
                    (fermetureCounts['en attente']?.totalRevenue || 0)) / 10 // Assuming 10 DH = 1 EUR
      },
      'payé': {
        count: (dossierCounts['payé']?.count || 0) + 
               (modificationCounts['payé']?.count || 0),
        revenue: (dossierCounts['payé']?.totalRevenue || 0) + 
                 (modificationCounts['payé']?.totalRevenue || 0),
        revenueEUR: ((dossierCounts['payé']?.totalRevenue || 0) + 
                    (modificationCounts['payé']?.totalRevenue || 0)) / 10
      },
      'a traité': {
        count: (dossierCounts['a traité']?.count || 0) + 
               (modificationCounts['a traité']?.count || 0),
        revenue: (dossierCounts['a traité']?.totalRevenue || 0) + 
                 (modificationCounts['a traité']?.totalRevenue || 0),
        revenueEUR: ((dossierCounts['a traité']?.totalRevenue || 0) + 
                    (modificationCounts['a traité']?.totalRevenue || 0)) / 10
      },
      'en traitement': {
        count: (dossierCounts['en traitement']?.count || 0) + 
               (modificationCounts['en traitement']?.count || 0) + 
               (fermetureCounts['en cours']?.count || 0),
        revenue: (dossierCounts['en traitement']?.totalRevenue || 0) + 
                 (modificationCounts['en traitement']?.totalRevenue || 0) + 
                 (fermetureCounts['en cours']?.totalRevenue || 0),
        revenueEUR: ((dossierCounts['en traitement']?.totalRevenue || 0) + 
                    (modificationCounts['en traitement']?.totalRevenue || 0) + 
                    (fermetureCounts['en cours']?.totalRevenue || 0)) / 10
      },
      'traité': {
        count: (dossierCounts['traité']?.count || 0) + 
               (modificationCounts['traité']?.count || 0) + 
               (fermetureCounts['terminé']?.count || 0),
        revenue: (dossierCounts['traité']?.totalRevenue || 0) + 
                 (modificationCounts['traité']?.totalRevenue || 0) + 
                 (fermetureCounts['terminé']?.totalRevenue || 0),
        revenueEUR: ((dossierCounts['traité']?.totalRevenue || 0) + 
                    (modificationCounts['traité']?.totalRevenue || 0) + 
                    (fermetureCounts['terminé']?.totalRevenue || 0)) / 10
      }
    };

    // Count totals with revenue
    const [
      totalDossiers, 
      totalModifications, 
      totalFermetures,
      totalCreationRevenue,
      totalModificationRevenue,
      totalFermetureRevenue
    ] = await Promise.all([
      Dossier.countDocuments(),
      DossierModification.countDocuments(),
      DossierFermeture.countDocuments(),
      Dossier.aggregate([{ $group: { _id: null, total: { $sum: '$prix' } } }]),
      DossierModification.aggregate([{ $group: { _id: null, total: { $sum: '$prix' } } }]),
      DossierFermeture.aggregate([{ $group: { _id: null, total: { $sum: '$prix' } } }])
    ]);

    // Get payment totals by type
    const creationPayments = paymentStatsFormatted['Dossier'] || { totalAmount: 0, count: 0 };
    const modificationPayments = paymentStatsFormatted['DossierModification'] || { totalAmount: 0, count: 0 };
    const fermeturePayments = paymentStatsFormatted['DossierFermeture'] || { totalAmount: 0, count: 0 };

    // Count by type for charts with revenue
    const [dossierTypes, modificationTypes, fermetureTypes] = await Promise.all([
      countByType(Dossier),
      countByType(DossierModification),
      countByType(DossierFermeture, 'typeFermeture')
    ]);

    // Get recent activity (last 5 dossiers)
    const recentActivity = await Dossier.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .lean();

    // Calculate monthly stats with revenue
    const [monthlyCreationStats, monthlyModificationStats, monthlyFermetureStats] = await Promise.all([
      Dossier.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 },
            revenue: { $sum: '$prix' },
            revenueEUR: { $sum: { $divide: ['$prix', 10] } }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 }
      ]),
      DossierModification.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 },
            revenue: { $sum: '$prix' },
            revenueEUR: { $sum: { $divide: ['$prix', 10] } }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 }
      ]),
      DossierFermeture.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 },
            revenue: { $sum: '$prix' },
            revenueEUR: { $sum: { $divide: ['$prix', 10] } }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 }
      ])
    ]);

    // Combine monthly stats
    const combinedMonthlyStats = monthlyCreationStats.map(month => {
      const modificationMonth = monthlyModificationStats.find(m => 
        m._id.year === month._id.year && m._id.month === month._id.month
      );
      const fermetureMonth = monthlyFermetureStats.find(m => 
        m._id.year === month._id.year && m._id.month === month._id.month
      );
      
      return {
        ...month,
        modificationCount: modificationMonth?.count || 0,
        modificationRevenue: modificationMonth?.revenue || 0,
        modificationRevenueEUR: modificationMonth?.revenueEUR || 0,
        fermetureCount: fermetureMonth?.count || 0,
        fermetureRevenue: fermetureMonth?.revenue || 0,
        fermetureRevenueEUR: fermetureMonth?.revenueEUR || 0,
        totalRevenue: month.revenue + 
                     (modificationMonth?.revenue || 0) + 
                     (fermetureMonth?.revenue || 0),
        totalRevenueEUR: month.revenueEUR + 
                        (modificationMonth?.revenueEUR || 0) + 
                        (fermetureMonth?.revenueEUR || 0)
      };
    });

    // Prepare response
    const stats = {
  combinedStats,
  dossierCounts,
  modificationCounts,
  fermetureCounts,
  paymentStats: {
    creation: creationPayments,
    modification: modificationPayments,
    fermeture: fermeturePayments,
    totalAmountEUR: (creationPayments.totalAmount + modificationPayments.totalAmount + fermeturePayments.totalAmount) / 10
  },
  totals: {
    allDossiers: totalDossiers + totalModifications + totalFermetures,
    dossierCreations: totalDossiers,
    dossierModifications: totalModifications,
    dossierFermetures: totalFermetures,
    totalRevenueEUR: ((totalCreationRevenue[0]?.total || 0) + 
                     (totalModificationRevenue[0]?.total || 0) + 
                     (totalFermetureRevenue[0]?.total || 0)) / 10,
    creationRevenueEUR: (totalCreationRevenue[0]?.total || 0) / 10,
    modificationRevenueEUR: (totalModificationRevenue[0]?.total || 0) / 10,
    fermetureRevenueEUR: (totalFermetureRevenue[0]?.total || 0) / 10
  },
      dossierTypes: dossierTypes.reduce((acc, { _id, count, totalRevenue }) => {
        acc[_id] = { count, totalRevenue: totalRevenue || 0, totalRevenueEUR: (totalRevenue || 0) / 10 };
        return acc;
      }, {}),
      modificationTypes: modificationTypes.reduce((acc, { _id, count, totalRevenue }) => {
        acc[_id] = { count, totalRevenue: totalRevenue || 0, totalRevenueEUR: (totalRevenue || 0) / 10 };
        return acc;
      }, {}),
      fermetureTypes: fermetureTypes.reduce((acc, { _id, count, totalRevenue }) => {
        acc[_id] = { count, totalRevenue: totalRevenue || 0, totalRevenueEUR: (totalRevenue || 0) / 10 };
        return acc;
      }, {}),
      monthlyStats: combinedMonthlyStats,
      recentActivity
    };

    res.json({ success: true, data: stats });
    
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};