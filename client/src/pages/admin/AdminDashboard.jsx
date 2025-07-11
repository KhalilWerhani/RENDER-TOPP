import { useContext, useEffect, useState } from "react";
import { AppContent } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { DollarSign, Users, TrendingUp, CreditCard, Calendar, FileText, Edit, CheckCircle, XCircle, Folder, FilePlus, FileMinus, Archive } from "lucide-react";
import VentesCourbe from "./VentesCourbe";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, RadialBarChart, RadialBar
} from 'recharts';



// Elegant color palette
const COLORS = [
  '#6366F1', // indigo-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // violet-500
  '#3B82F6', // blue-500
  '#EC4899', // pink-500
  '#14B8A6'  // teal-500
];

const STATUS_COLORS = {
  'en attente': 'bg-gray-100 text-gray-800',
  'payé': 'bg-blue-100 text-blue-800',
  'a traité': 'bg-yellow-100 text-yellow-800',
  'en traitement': 'bg-indigo-100 text-indigo-800',
  'traité': 'bg-green-100 text-green-800'
};

const STATUS_ICONS = {
  'en attente': <FileText className="w-5 h-5" />,
  'payé': <DollarSign className="w-5 h-5" />,
  'a traité': <Edit className="w-5 h-5" />,
  'en traitement': <TrendingUp className="w-5 h-5" />,
  'traité': <CheckCircle className="w-5 h-5" />
};

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${name}`}
    </text>
  );
};

const AdminDashboard = () => {

  const { userData, backendUrl } = useContext(AppContent);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [stats, setStats] = useState({
    metrics: {
      pending: { count: 0, revenue: 0, revenueEUR: 0 },
      paid: { count: 0, revenue: 0, revenueEUR: 0 },
      toProcess: { count: 0, revenue: 0, revenueEUR: 0 },
      inProgress: { count: 0, revenue: 0, revenueEUR: 0 },
      completed: { count: 0, revenue: 0, revenueEUR: 0 }
    },
    paymentStats: {
      creation: { totalAmount: 0, count: 0 },
      modification: { totalAmount: 0, count: 0 },
      fermeture: { totalAmount: 0, count: 0 },
      totalAmount: 0,
      totalAmountEUR: 0
    },
    breakdown: {
      pending: {
        creation: { count: 0, revenue: 0 },
        modification: { count: 0, revenue: 0 },
        fermeture: { count: 0, revenue: 0 }
      },
      paid: {
        creation: { count: 0, revenue: 0 },
        modification: { count: 0, revenue: 0 },
        fermeture: { count: 0, revenue: 0 }
      },
      toProcess: {
        creation: { count: 0, revenue: 0 },
        modification: { count: 0, revenue: 0 },
        fermeture: { count: 0, revenue: 0 }
      },
      inProgress: {
        creation: { count: 0, revenue: 0 },
        modification: { count: 0, revenue: 0 },
        fermeture: { count: 0, revenue: 0 }
      },
      completed: {
        creation: { count: 0, revenue: 0 },
        modification: { count: 0, revenue: 0 },
        fermeture: { count: 0, revenue: 0 }
      }
    },
    totals: {
      allDossiers: 0,
      dossierCreations: 0,
      dossierModifications: 0,
      dossierFermetures: 0,
      totalRevenue: 0,
      creationRevenue: 0,
      modificationRevenue: 0,
      fermetureRevenue: 0
    },
    types: {
      dossiers: [],
      modifications: [],
      fermetures: []
    },
    monthlyStats: [],
    recentActivity: []

  });


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/stats/stats`, {
          withCredentials: true,
        });
        if (data.success) {
          // Format the data with revenue information
          const formattedData = {
            metrics: {
              pending: data.data.combinedStats?.['en attente'] || { count: 0, revenue: 0, revenueEUR: 0 },
              paid: data.data.combinedStats?.payé || { count: 0, revenue: 0, revenueEUR: 0 },
              toProcess: data.data.combinedStats?.['a traité'] || { count: 0, revenue: 0, revenueEUR: 0 },
              inProgress: data.data.combinedStats?.['en traitement'] || { count: 0, revenue: 0, revenueEUR: 0 },
              completed: data.data.combinedStats?.traité || { count: 0, revenue: 0, revenueEUR: 0 }
            },
            breakdown: {
              pending: {
                creation: data.data.dossierCounts?.['en attente'] || { count: 0, revenue: 0 },
                modification: data.data.modificationCounts?.['en attente'] || { count: 0, revenue: 0 },
                fermeture: data.data.fermetureCounts?.['en attente'] || { count: 0, revenue: 0 }
              },
              paid: {
                creation: data.data.dossierCounts?.payé || { count: 0, revenue: 0 },
                modification: data.data.modificationCounts?.payé || { count: 0, revenue: 0 },
                fermeture: { count: 0, revenue: 0 }
              },
              toProcess: {
                creation: data.data.dossierCounts?.['a traité'] || { count: 0, revenue: 0 },
                modification: data.data.modificationCounts?.['a traité'] || { count: 0, revenue: 0 },
                fermeture: { count: 0, revenue: 0 }
              },
              inProgress: {
                creation: data.data.dossierCounts?.['en traitement'] || { count: 0, revenue: 0 },
                modification: data.data.modificationCounts?.['en traitement'] || { count: 0, revenue: 0 },
                fermeture: data.data.fermetureCounts?.['en cours'] || { count: 0, revenue: 0 }
              },
              completed: {
                creation: data.data.dossierCounts?.traité || { count: 0, revenue: 0 },
                modification: data.data.modificationCounts?.traité || { count: 0, revenue: 0 },
                fermeture: data.data.fermetureCounts?.terminé || { count: 0, revenue: 0 }
              }
            },
            paymentStats: data.data.paymentStats || {
              creation: { totalAmount: 0, count: 0 },
              modification: { totalAmount: 0, count: 0 },
              fermeture: { totalAmount: 0, count: 0 },
              totalAmount: 0,
              totalAmountEUR: 0
            },
            totals: {
              allDossiers: data.data.totals?.allDossiers || 0,
              dossierCreations: data.data.totals?.dossierCreations || 0,
              dossierModifications: data.data.totals?.dossierModifications || 0,
              dossierFermetures: data.data.totals?.dossierFermetures || 0,
              totalRevenue: data.data.totals?.totalRevenue || 0,
              totalRevenueEUR: data.data.totals?.totalRevenueEUR || 0,
              creationRevenue: data.data.totals?.creationRevenue || 0,
              creationRevenueEUR: data.data.totals?.creationRevenueEUR || 0,
              modificationRevenue: data.data.totals?.modificationRevenue || 0,
              modificationRevenueEUR: data.data.totals?.modificationRevenueEUR || 0,
              fermetureRevenue: data.data.totals?.fermetureRevenue || 0,
              fermetureRevenueEUR: data.data.totals?.fermetureRevenueEUR || 0
            },
            types: {
              dossiers: Object.entries(data.data.dossierTypes || {}).map(([name, value]) => ({
                _id: name,
                count: value.count || 0,
                revenue: value.totalRevenue || 0
              })),
              modifications: Object.entries(data.data.modificationTypes || {}).map(([name, value]) => ({
                _id: name,
                count: value.count || 0,
                revenue: value.totalRevenue || 0
              })),
              fermetures: Object.entries(data.data.fermetureTypes || {}).map(([name, value]) => ({
                _id: name,
                count: value.count || 0,
                revenue: value.totalRevenue || 0
              }))
            },
            monthlyStats: data.data.monthlyStats || [],
            recentActivity: data.data.recentActivity || []
          };

          setStats(formattedData);
        } else {
          toast.error("Erreur lors de la récupération des statistiques");
        }
      } catch (error) {
        toast.error("Erreur serveur : " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [backendUrl]);

  // Format type data with revenue
  const typeData = stats.types.dossiers.map((type, index) => ({
    name: type._id || `Type ${index}`,
    count: type.count || 0,
    revenue: type.revenue || 0,
    fill: COLORS[index % COLORS.length]
  }));

  // Format status data with revenue
  const statusData = [
    { name: 'En attente', count: stats.metrics.pending.count || 0, revenue: stats.metrics.pending.revenue || 0 },
    { name: 'Payé', count: stats.metrics.paid.count || 0, revenue: stats.metrics.paid.revenue || 0 },
    { name: 'A Traiter', count: stats.metrics.toProcess.count || 0, revenue: stats.metrics.toProcess.revenue || 0 },
    { name: 'En traitement', count: stats.metrics.inProgress.count || 0, revenue: stats.metrics.inProgress.revenue || 0 },
    { name: 'Traité', count: stats.metrics.completed.count || 0, revenue: stats.metrics.completed.revenue || 0 }
  ];

  // Format monthly stats for chart
  const monthlyRevenueData = stats.monthlyStats.map(month => ({
    name: `${month._id.month}/${month._id.year}`,
    Créations: month.revenue || 0,
    Modifications: month.modificationRevenue || 0,
    Fermetures: month.fermetureRevenue || 0,
    Total: month.totalRevenue || 0
  }));

  // Revenue distribution data
  const revenueDistributionData = [
    { name: 'Créations', value: stats.totals.creationRevenue || 0 },
    { name: 'Modifications', value: stats.totals.modificationRevenue || 0 },
    { name: 'Fermetures', value: stats.totals.fermetureRevenue || 0 }
  ];

  const dossierStatuses = [
    {
      title: "Total Dossiers",
      value: stats.totals.allDossiers || 0,
      icon: <Folder className="w-6 h-6" />,
      color: "bg-indigo-500",
      description: "Tous les dossiers confondus",
      breakdown: {
        creation: stats.totals.dossierCreations || 0,
        modification: stats.totals.dossierModifications || 0,
        fermeture: stats.totals.dossierFermetures || 0
      },
      isRevenue: false
    },
    
    {
      title: "En attente",
      value: stats.metrics.pending.count || 0,
      icon: <FileText className="w-6 h-6" />,
      color: "bg-gray-500",
      description: "Dossiers en attente de traitement",
      breakdown: {
        creation: stats.breakdown.pending.creation.count || 0,
        modification: stats.breakdown.pending.modification.count || 0,
        fermeture: stats.breakdown.pending.fermeture.count || 0
      },
      revenue: stats.metrics.pending.revenue || 0,
      isRevenue: false
    },
    {
      title: "Payé",
      value: stats.metrics.paid.count || 0,
      icon: <DollarSign className="w-6 h-6" />,
      color: "bg-blue-500",
      description: "Dossiers payés",
      breakdown: {
        creation: stats.breakdown.paid.creation.count || 0,
        modification: stats.breakdown.paid.modification.count || 0,
        fermeture: stats.breakdown.paid.fermeture.count || 0
      },
      revenue: stats.metrics.paid.revenue || 0,
      isRevenue: false
    },
    {
      title: "A traiter",
      value: stats.metrics.toProcess.count || 0,
      icon: <Edit className="w-6 h-6" />,
      color: "bg-yellow-500",
      description: "Dossiers à traiter",
      breakdown: {
        creation: stats.breakdown.toProcess.creation.count || 0,
        modification: stats.breakdown.toProcess.modification.count || 0,
        fermeture: stats.breakdown.toProcess.fermeture.count || 0
      },
      revenue: stats.metrics.toProcess.revenue || 0,
      isRevenue: false
    },
    {
      title: "En traitement",
      value: stats.metrics.inProgress.count || 0,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "bg-purple-500",
      description: "Dossiers en cours de traitement",
      breakdown: {
        creation: stats.breakdown.inProgress.creation.count || 0,
        modification: stats.breakdown.inProgress.modification.count || 0,
        fermeture: stats.breakdown.inProgress.fermeture.count || 0
      },
      revenue: stats.metrics.inProgress.revenue || 0,
      isRevenue: false
    },
    {
      title: "Traité",
      value: stats.metrics.completed.count || 0,
      icon: <CheckCircle className="w-6 h-6" />,
      color: "bg-green-500",
      description: "Dossiers traités",
      breakdown: {
        creation: stats.breakdown.completed.creation.count || 0,
        modification: stats.breakdown.completed.modification.count || 0,
        fermeture: stats.breakdown.completed.fermeture.count || 0
      },
      revenue: stats.metrics.completed.revenue || 0,
      isRevenue: false
    }
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center"
      >
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full"
          ></motion.div>
        </div>
        <p className="text-gray-600 font-medium">Chargement des données...</p>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-gray-100/30"
        >
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 shadow-sm border border-gray-100">
            {/* Background image container (half width) */}
            <div className="absolute inset-y-0 left-0 w-2/2 h-6/2">
              <img
                src={assets.dashadmin_img}
                alt="Admin background"
                className="w-full h-full object-cover object-center opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10"></div>
            </div>

            {/* Content container */}
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6">
              <div className="flex items-center gap-6">
                {/* Avatar with elegant shadow and border */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition duration-200"></div>
                  <img
                    src={assets.dashadmin_img}
                    alt="Admin avatar"
                    className="relative w-54 h-24 rounded-full object-cover border-4 border-white shadow-md z-10"
                  />
                </div>

                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Tableau de bord des dossiers
                  </h1>
                  <p className="text-indigo-700/90 mt-1 font-medium">Vue d'ensemble complète de vos statistiques</p>
                </div>
              </div>

              {/* Right side controls */}
              <div className="flex flex-col sm:flex-row items-center gap-3">

                <motion.select
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-white/95 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm backdrop-blur-sm"
                >
                  <option value="day">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="year">Cette année</option>
                </motion.select>

                <motion.span
                  whileHover={{ scale: 1.02 }}
                  className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-white/95 text-indigo-800 border border-gray-200 shadow-sm backdrop-blur-sm"
                >
                  <Calendar className="mr-2 w-4 h-4 text-indigo-600" />
                  {new Date().toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-gray-100/30"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Statistiques de Paiement</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Creation Payments */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Paiements Création</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stats.paymentStats?.creation?.count || 0}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    {(stats.paymentStats?.creation?.totalAmount  || 0).toLocaleString('fr-FR')} €
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-indigo-500 text-white shadow-md">
                  <FilePlus className="w-6 h-6" />
                </div>
              </div>
            </motion.div>

            {/* Modification Payments */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Paiements Modification</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stats.paymentStats?.modification?.count || 0}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    {(stats.paymentStats?.modification?.totalAmount || 0).toLocaleString('fr-FR')} €
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-indigo-500 text-white shadow-md">
                  <FilePlus className="w-6 h-6" />
                </div>
              </div>
            </motion.div>

            {/* Fermeture Payments */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Paiements fermeture</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stats.paymentStats?.fermeture?.count || 0}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    {(stats.paymentStats?.fermeture?.totalAmount  || 0).toLocaleString('fr-FR')} €
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-indigo-500 text-white shadow-md">
                  <FilePlus className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Dossier Status Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-gray-100/30"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Statut des Dossiers</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dossierStatuses.map((status, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group relative overflow-hidden`}
              >
                <div className="absolute top-0 left-0 w-full h-1 ${status.color}"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{status.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {status.isRevenue ? status.value : status.value?.toLocaleString('fr-FR') || '0'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{status.description}</p>
                    {!status.isRevenue && status.revenue > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        Revenue: {(status.revenue || 0).toLocaleString('fr-FR')} DH ({(status.revenueEUR || 0).toLocaleString('fr-FR')} €)
                      </p>
                    )}
                  </div>
                  <div className={`p-3 rounded-xl ${status.color} text-white shadow-md group-hover:shadow-lg transition-shadow`}>
                    {status.icon}
                  </div>
                </div>

                {status.breakdown && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="flex flex-col items-center p-2 bg-indigo-50 rounded-lg">
                        <div className="flex items-center gap-1">
                          <FilePlus className="w-4 h-4 text-indigo-600" />
                          <span className="font-semibold text-indigo-800">
                            {status.isRevenue ? status.breakdown.creation : status.breakdown.creation?.toLocaleString('fr-FR') || '0'}
                          </span>
                        </div>
                        <span className="text-indigo-600">Création</span>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-yellow-50 rounded-lg">
                        <div className="flex items-center gap-1">
                          <Edit className="w-4 h-4 text-yellow-600" />
                          <span className="font-semibold text-yellow-800">
                            {status.isRevenue ? status.breakdown.modification : status.breakdown.modification?.toLocaleString('fr-FR') || '0'}
                          </span>
                        </div>
                        <span className="text-yellow-600">Modification</span>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-red-50 rounded-lg">
                        <div className="flex items-center gap-1">
                          <Archive className="w-4 h-4 text-red-600" />
                          <span className="font-semibold text-red-800">
                            {status.isRevenue ? status.breakdown.fermeture : status.breakdown.fermeture?.toLocaleString('fr-FR') || '0'}
                          </span>
                        </div>
                        <span className="text-red-600">Fermeture</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

    {/* Charts Section */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Type Dossier Chart */}
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.4, duration: 0.5 }}
    className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-gray-100/30"
  >
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Types de Dossiers</h2>
        <p className="text-sm text-gray-500">Répartition par type de dossier</p>
      </div>
    </div>
    <div className="h-80">
      {typeData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={typeData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => name === 'count' ? [`${value} dossiers`, 'Count'] : [`${value} DH`, 'Revenue']}
              labelFormatter={(label) => `Type: ${label}`}
            />
            <Legend />
            <Bar dataKey="count" fill="#6366F1" name="Nombre de dossiers" />
            <Bar dataKey="revenue" fill="#10B981" name="Revenue (DH)" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Aucune donnée disponible</p>
        </div>
      )}
    </div>
  </motion.div>

  {/* Payment Types Chart */}
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.4, duration: 0.5 }}
    className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-gray-100/30"
  >
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900">Paiements par Type</h2>
      <p className="text-sm text-gray-500">Répartition des paiements</p>
    </div>
    <div className="h-64 flex flex-col">
      {stats.paymentStats ? (
        <>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { 
                    name: 'Créations', 
                    count: stats.paymentStats.creation.count, 
                    amount: stats.paymentStats.creation.totalAmount 
                  },
                  { 
                    name: 'Modifications', 
                    count: stats.paymentStats.modification.count, 
                    amount: stats.paymentStats.modification.totalAmount 
                  },
                  { 
                    name: 'Fermetures', 
                    count: stats.paymentStats.fermeture.count, 
                    amount: stats.paymentStats.fermeture.totalAmount 
                  }
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#6366F1" />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                <Tooltip 
                  formatter={(value, name) => name === 'count' ? [`${value} paiements`, 'Count'] : [`${value} DH`, 'Montant']}
                  labelFormatter={(label) => `Type: ${label}`}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="count" fill="#6366F1" name="Nombre de paiements" />
                <Bar yAxisId="right" dataKey="amount" fill="#10B981" name="Montant total (DH)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Aucune donnée disponible</p>
        </div>
      )}
    </div>
  </motion.div>
</div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-gray-100/30"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Activité récente</h2>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
              Voir tout
            </button>
          </div>
          <div className="space-y-4">
            {stats.recentActivity?.length > 0 ? (
              stats.recentActivity.map((dossier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center p-4 bg-white rounded-xl shadow-xs border border-gray-100 hover:shadow-sm transition-all"
                >
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    {STATUS_ICONS[dossier.statut] || <FileText className="w-5 h-5" />}
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {dossier.user?.name || "Utilisateur inconnu"}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[dossier.statut] || 'bg-gray-100 text-gray-800'
                        }`}>
                        {dossier.statut}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {new Date(dossier.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                        {dossier.type === 'creation' ? 'Création' :
                          dossier.type === 'modification' ? 'Modification' : 'Fermeture'}
                      </span>
                      {dossier.prix && (
                        <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full">
                          {(dossier.prix / 10).toLocaleString('fr-FR')} €
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune activité récente</h3>
                <p className="mt-1 text-sm text-gray-500">Aucun dossier n'a été créé récemment.</p>
              </motion.div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AdminDashboard;