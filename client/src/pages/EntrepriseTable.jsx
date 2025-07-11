// src/components/EntrepriseTable.jsx
import React, { useContext,useEffect, useState } from 'react';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { Check, X } from 'lucide-react';
import UserTable from './UserTable';


const EntrepriseTable = () => {

    const {backendUrl} = useContext(AppContent)
    const [entreprises, setEntreprises] = useState([]);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntreprises = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/entreprise', {
          withCredentials: true
        });
        setEntreprises(response.data.entreprises);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching entreprises:', error);
        setLoading(false);
      }
    };

    fetchEntreprises();
  }, []);

  if (loading) return <p className="text-center  mt-10">Chargement...</p>;

  return (
    <>
    <div className="">
      <h2 className="text-xl text-blue-600 font-bold mb-4 ">Entreprises des utilisateurs</h2>
      <div className="overflow-x-auto ">
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg ">
          <thead className="bg-blue-100">
            <tr>
              <td className="py-2 font-semibold border-b px-5">N°</td>
              <td className="py-2 font-semibold border-b ">Utilisateur</td>
              <td className="py-2 font-semibold border-b">Email</td>
              <td className="py-2 font-semibold border-b">Nom Entreprise</td>
              <td className="py-2 font-semibold border-b">Profession</td>
              <td className="py-2 font-semibold border-b">Type</td>
              <td className="py-2 font-semibold border-b">Secteur</td>
              <td className="py-2 font-semibold border-b">Auto-Entrepreneur</td>
            </tr>
          </thead>
          <tbody>
            {entreprises.map((entreprise, counter) => (
              <tr key={entreprise._id} className="hover:bg-blue-100 cursor-pointer">
                <td className="py-2 border-b px-5">{counter}</td>
                <td className="py-2 border-b capitalize ">{entreprise.userId?.name || 'N/A'}</td>
                <td className="py-2 border-b capitalize">{entreprise.userId?.email || 'N/A'}</td>
                <td className="py-2 border-b capitalize">{entreprise.entrepriseName}</td>
                <td className="py-2 border-b capitalize">{entreprise.profession}</td>
                <td className="py-2 border-b capitalize">{entreprise.entrepriseType}</td>
                <td className="py-2 border-b capitalize">{entreprise.secteurActivite}</td>
                <td className="py-2 border-b "> {entreprise.autoEntrepreneur == "true" ? (
          <Check className="text-green-500 inline" />
        ) : (
          <X className="text-red-500 inline" />
        )}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <UserTable />
    </>
  );
};

export default EntrepriseTable;
