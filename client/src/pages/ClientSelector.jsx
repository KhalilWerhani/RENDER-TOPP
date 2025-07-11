import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContent } from '../../context/AppContext';

const ClientSelector = ({ onSelect }) => {
  const { backendUrl } = useContext(AppContent);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      const res = await axios.get(`${backendUrl}/api/user/all`, { withCredentials: true });
      const users = res.data.users || [];
      const clientsOnly = users.filter(u => u.role === 'user');
      setClients(clientsOnly);
    };
    fetchClients();
  }, []);

  return (
    <div className="flex gap-4 flex-wrap justify-start mb-4">
      {clients.map(client => (
        <div
          key={client._id}
          onClick={() => onSelect(client._id, 'client')}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-sm cursor-pointer hover:bg-blue-200 transition"
          title={client.name}
        >
          {(client.name || '?').split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
      ))}
    </div>
  );
};

export default ClientSelector;
