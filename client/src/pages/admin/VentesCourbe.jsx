import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

const VentesCourbe = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("/api/statistiques/ventes-30-jours");
        setData(res.data);
        const totalVentes = res.data.reduce((acc, day) => acc + day.count, 0);
        setTotal(totalVentes);
      } catch (err) {
        console.error("Erreur chargement stats", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Generate placeholder data while loading
  const loadingData = Array.from({ length: 30 }, (_, i) => ({
    date: `2023-01-${i + 1}`,
    count: Math.floor(Math.random() * 10) + 5,
  }));

  const displayData = isLoading ? loadingData : data;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const [year, month, day] = label.split("-");
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-blue-100">
          <p className="text-sm text-blue-800 font-medium">{`${day}/${month}`}</p>
          <p className="text-lg font-bold text-blue-900">
            {payload[0].value} <span className="text-sm font-normal text-blue-700">ventes</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-blue-100 transition-all duration-300 h-full">
      <div className="flex justify-between items-start p-6 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#f4d47c]" />
            Évolution des ventes
          </h2>
          <p className="text-sm text-blue-700/60 mt-1">Sur les 30 derniers jours</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-blue-700/60">Total</p>
          <p className="text-2xl font-bold text-blue-900">
            {isLoading ? (
              <span className="inline-block h-7 w-16 bg-blue-100 rounded animate-pulse"></span>
            ) : (
              total
            )}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 h-[260px]">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="animate-pulse text-blue-200">
              <svg width="60" height="40" viewBox="0 0 60 40">
                <path
                  d="M0,40 L5,25 L10,35 L15,20 L20,30 L25,15 L30,25 L35,10 L40,20 L45,5 L50,15 L55,0 L60,10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={displayData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              onMouseMove={(e) => setActiveIndex(e.activeTooltipIndex)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                stroke="#e0e7ff" 
                vertical={false} 
                strokeDasharray="3 3" 
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                stroke="#64748b"
                fontSize={11}
                tickMargin={10}
                tickFormatter={(date) => {
                  const [year, month, day] = date.split("-");
                  return `${day}/${month}`;
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                stroke="#64748b"
                fontSize={11}
                allowDecimals={false}
                tickMargin={10}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{
                  stroke: "#e0e7ff",
                  strokeWidth: 2,
                  strokeDasharray: "4 4",
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                fill="url(#colorUv)"
                fillOpacity={1}
                strokeWidth={0}
                activeDot={false}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{
                  r: 0,
                  strokeWidth: 0,
                  fill: "#3b82f6",
                }}
                activeDot={{
                  r: 6,
                  stroke: "#fff",
                  strokeWidth: 2,
                  fill: "#3b82f6",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default VentesCourbe;