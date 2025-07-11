import React, { useEffect, useState, useContext } from 'react';
import { AppContent } from '../context/AppContext';
import axios from 'axios';

const ClientSelectorModal = ({ onSelect }) => {
  const { backendUrl } = useContext(AppContent);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    axios.get(`${backendUrl}/api/user/all`, { withCredentials: true })
      .then(res => {
        const users = res.data.users || [];
        setClients(users.filter(u => u.role === 'user'));
      });
  }, []);

  return (
    <div className="flex flex-wrap gap-3 justify-start p-4">
      {clients.map(client => (
        <div
          key={client._id}
          onClick={() => onSelect(client._id, 'client')}
          className="cursor-pointer w-14 h-14 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full font-semibold hover:bg-blue-200 transition-all"
          title={client.name}
        >
          {(client.name || '?').split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
      ))}
    </div>
  );
};

export default ClientSelectorModal;
