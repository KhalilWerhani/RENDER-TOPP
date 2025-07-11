import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, RadialBarChart, RadialBar
} from 'recharts';
import { 
  FiFilePlus, FiEdit2, FiArchive, FiClock, 
  FiCheckCircle, FiStar, FiUser, FiCalendar,
  FiTrendingUp, FiTrendingDown, FiEye
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { assets } from '../../assets/assets';

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
  'a traité': 'bg-yellow-100 text-yellow-800',
  'en traitement': 'bg-indigo-100 text-indigo-800',
  'traité': 'bg-green-100 text-green-800',
  'fermé': 'bg-purple-100 text-purple-800'
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

const DashboardBO = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`/api/bo/dashboard?range=${timeRange}`, {
          withCredentials: true,
        });
        console.log("Réponse API dashboard :", res.data);
        setStats(res.data);
      } catch (err) {
        console.error("Erreur dashboard :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

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

  if (!stats?.success) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center border border-gray-100"
      >
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
        <p className="text-gray-600 mb-6">{stats?.error || "Nous n'avons pas pu charger les statistiques du tableau de bord."}</p>
        <motion.button 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
        >
          Réessayer
        </motion.button>
      </motion.div>
    </div>
  );

  const { 
    totalCreation, 
    totalModification, 
    totalFermeture,
    statusCounts = {},
    clientRatings,
    creationParDate,
    parType,
    parStatut,
    dossierCounts = {},
  } = stats.stats;

  const {
    aTraite = 0,
    enTraitement = 0,
    traites = 0
  } = statusCounts;

  const { totalDossiers = 0, totalModifications = 0 } = dossierCounts;

  const dossiersRecents = Array.isArray(stats.dossiersRecents) ? stats.dossiersRecents : [];

  // Format type data with proper labels
  const typeData = Object.entries(parType).map(([key, value]) => {
    const formattedName = key === 'AUTO-ENTREPRENEUR' ? 'Auto-Entrepreneur' : 
                         key === 'Entreprise individuelle' ? 'Entreprise Individuelle' : 
                         key;
    return { 
      name: formattedName, 
      value 
    };
  }).filter(item => item.value > 0); // Only show types with data

  const statutData = Object.entries(parStatut).map(([key, value]) => ({ 
    name: key.charAt(0).toUpperCase() + key.slice(1), 
    value 
  }));

  const ratingData = Array.isArray(clientRatings)
    ? clientRatings.map((rating, index) => ({
        name: `${rating.value} étoiles`,
        value: rating.count,
        fill: COLORS[index % COLORS.length],
      }))
    : [];

  const averageRating = Array.isArray(clientRatings) && clientRatings.length > 0
    ? (clientRatings.reduce((acc, curr) => acc + (curr.value * curr.count), 0) / 
       clientRatings.reduce((acc, curr) => acc + curr.count, 0)).toFixed(1)
    : 0;

  // Main metrics cards
  const metrics = [
    {
      title: "Dossiers Création",
      value: totalDossiers,
      icon: <FiFilePlus className="w-6 h-6" />,
      color: "bg-indigo-500",
      trend: totalCreation > 0 ? "up" : "down",
      percentage: totalCreation > 0 ? 
        `+${Math.round((totalCreation / totalDossiers) * 100)}%` : 
        `${Math.round((totalCreation / totalDossiers) * 100)}%`,
      description: "Nouveaux dossiers créés"
    },
    {
      title: "Dossiers Modification",
      value: totalModifications,
      icon: <FiEdit2 className="w-6 h-6" />,
      color: "bg-emerald-500",
      trend: totalModification > 0 ? "up" : "down",
      percentage: totalModification > 0 ? 
        `+${Math.round((totalModification / totalModifications) * 100)}%` : 
        `${Math.round((totalModification / totalModifications) * 100)}%`,
      description: "Dossiers modifiés"
    },
    {
      title: "Dossiers Fermeture",
      value: totalFermeture,
      icon: <FiArchive className="w-6 h-6" />,
      color: "bg-amber-500",
      trend: "neutral",
      description: "Dossiers clôturés"
    }
  ];

  // Status metrics
  const statusMetrics = [
    {
      title: "À Traiter",
      value: aTraite,
      icon: <FiClock className="w-5 h-5" />,
      color: STATUS_COLORS['a traité']
    },
    {
      title: "En Traitement",
      value: enTraitement,
      icon: <FiTrendingUp className="w-5 h-5" />,
      color: STATUS_COLORS['en traitement']
    },
    {
      title: "Traités",
      value: traites,
      icon: <FiCheckCircle className="w-5 h-5" />,
      color: STATUS_COLORS['traité']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with elegant glass morphism effect */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-gray-100/30"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className='flex items-center gap-4'>
              <img
                src={assets.illustrawfly}
                alt="Doc"
                className="w-28 h-28 rounded-lg shadow-sm border-1 border-blue-100"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Tableau de bord
                </h1>
                <p className="text-sm text-gray-500">Données spécifiques à votre compte</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.select 
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.02 }}
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white/90 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              >
                <option value="day">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="year">Cette année</option>
              </motion.select>
              <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-white/90 text-indigo-800 border border-gray-200 shadow-sm">
                <FiCalendar className="mr-2" />
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics with elegant cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{metric.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {metric.value.toLocaleString('fr-FR')} 
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{metric.description}</p>
                  
                  {metric.trend !== "neutral" && (
                    <div className={`inline-flex items-center mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                      metric.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {metric.trend === 'up' ? (
                        <FiTrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <FiTrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {metric.percentage}
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-xl ${metric.color} text-white shadow-md group-hover:shadow-lg transition-shadow`}>
                  {metric.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Status Metrics with elegant pills */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {statusMetrics.map((metric, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{metric.title}</p>
                  <p className="text-xl font-semibold text-gray-900 mt-1">
                    {metric.value.toLocaleString('fr-FR')}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${metric.color} shadow-inner`}>
                  {metric.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section with glass morphism */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ratings Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-gray-100/30"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Satisfaction Clients</h2>
              <div className="flex items-center bg-indigo-50 px-3 py-1 rounded-full">
                <div className="flex items-center text-amber-500 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(averageRating) ? 'fill-current' : ''}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {averageRating}/5
                </span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  innerRadius="20%" 
                  outerRadius="90%" 
                  data={ratingData}
                  startAngle={180} 
                  endAngle={-180}
                >
                  <RadialBar
                    minAngle={15}
                    label={{ position: 'insideStart', fill: '#fff' }}
                    background
                    clockWise
                    dataKey="value"
                  />
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value} évaluations`, 
                      `${props.payload.name}`
                    ]}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      background: 'rgba(255, 255, 255, 0.95)'
                    }}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Activity Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-gray-100/30"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Activité Récente</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={creationParDate}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                  <XAxis
                    dataKey="_id"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => 
                      timeRange === 'day' ? 
                      `${value}h` : 
                      new Date(value).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short'})
                    }
                    tickMargin={10}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                  />
                  <Tooltip
                    labelFormatter={(value) => 
                      timeRange === 'day' ? 
                      `À ${value}h` : 
                      new Date(value).toLocaleDateString('fr-FR', {weekday: 'long', day: 'numeric', month: 'long'})
                    }
                    formatter={(value) => [`${value} dossiers`, 'Nombre']}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      background: 'rgba(255, 255, 255, 0.95)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#6366F1"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, stroke: '#6366F1', fill: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#6366F1' }}
                    name="Créations"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dossiers par Type */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-gray-100/30"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Répartition par Type</h2>
            <div className="h-64">
              <ResponsiveContainer width="120%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                    paddingAngle={2}
                  >
                    {typeData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        stroke="#fff"
                        strokeWidth={5}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} dossiers`, 
                      `${props.payload.name}`
                    ]}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      background: 'rgba(255, 255, 255, 0.95)'
                    }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(value) => <span className="text-xs">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Dossiers par Statut */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-gray-100/30"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Statut des Dossiers</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statutData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={true} vertical={false} />
                  <XAxis 
                    type="number" 
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={90}
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                  />
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} dossiers`, 
                      `${props.payload.name}`
                    ]}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      background: 'rgba(255, 255, 255, 0.95)'
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#10B981"
                    radius={[0, 4, 4, 0]}
                    name="Dossiers"
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Files */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-gray-100/30"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Dossiers Récents</h2>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors flex items-center"
              >
                Voir tout <FiEye className="ml-1" />
              </motion.button>
            </div>
           
            {dossiersRecents.length > 0 ? (
              <div className="space-y-4">
                {dossiersRecents.slice(0, 4).map((dossier, index) => {
                  const isModification = dossier.type === 'modification' || dossier.__t === 'DossierModification';
                  const type = isModification ? 'modification' : 'création';
                  
                  return (
                    <motion.div 
                      key={dossier._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center p-4 bg-white rounded-xl shadow-xs border border-gray-100 hover:shadow-sm transition-all group"
                    >
                      <div className={`flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center 
                        ${type === 'création' ? 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200' :
                          type === 'modification' ? 'bg-green-100 text-green-600 group-hover:bg-green-200' :
                          'bg-amber-100 text-amber-600 group-hover:bg-amber-200'} transition-colors shadow-inner`}>
                        {type === 'création' ? <FiFilePlus className="w-5 h-5" /> : 
                         type === 'modification' ? <FiEdit2 className="w-5 h-5" /> : <FiArchive className="w-5 h-5" />}
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {dossier.user?.name || "Utilisateur inconnu"}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            STATUS_COLORS[dossier.statut] || 'bg-gray-100 text-gray-800'
                          }`}>
                            {dossier.statut}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {new Date(dossier.createdAt).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short', year: 'numeric'})}
                        </p>
                      </div>
                      <a
                        href={`/bo/dossiers/${dossier._id}?type=${type}`}
                        className="ml-2 text-indigo-600 hover:text-indigo-900 text-sm font-medium transition-colors flex items-center"
                      >
                        <FiEye className="w-4 h-4" />
                      </a>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun dossier récent</h3>
                <p className="mt-1 text-sm text-gray-500">Aucun dossier n'a été créé récemment.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBO;