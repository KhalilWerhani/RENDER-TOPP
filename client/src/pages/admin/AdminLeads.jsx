import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiDownload, FiMail, FiUser } from "react-icons/fi";

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
   const { backendUrl } = useContext(AppContent);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/leads/all`);
setLeads(res.data.data || []);
      } catch (error) {
        console.error("Erreur chargement leads:", error);
      }
    };
    fetchLeads();
  }, []);

  const exportToCSV = () => {
    const header = ["Prénom", "Nom", "Email", "Téléphone", "Type de projet", "Message", "Date"];
    const rows = leads.map((lead) => [
      lead.prenom || "",
      lead.nom || "",
      lead.email || "",
      lead.telephone || "",
      lead.typeProjet || "",
      lead.message?.replace(/\n/g, " ") || "",
      new Date(lead.createdAt).toLocaleString("fr-FR"),
    ]);

    const csvContent = [header, ...rows]
      .map((e) => e.map((v) => `"${v}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "leads_export.csv";
    link.click();
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Leads Collectés</h1>
            <p className="text-sm text-gray-500">Liste des prospects intéressés</p>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg"
          >
            <FiDownload className="mr-2" />
            Exporter CSV
          </button>
        </div>

        <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Téléphone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Projet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">Aucun lead disponible</td>
                </tr>
              ) : (
                leads.map((lead, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.prenom} {lead.nom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {lead.telephone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {lead.typeProjet}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminLeads;
