import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContent } from '../context/AppContext';

const UserList = ({ onSelect }) => {
  const { userData, backendUrl } = useContext(AppContent);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/messages/conversations`);
        const messages = res.data.conversations;

        const convoMap = new Map();

        messages.forEach(msg => {
          const contact = msg.sender._id === userData._id ? msg.receiver : msg.sender;
          const contactId = contact._id;

          if (!convoMap.has(contactId)) {
            convoMap.set(contactId, {
              user: contact,
              unreadCount: 0,
              lastMessage: msg.content,
              lastDate: msg.createdAt
            });
          }

          // Compter les messages non lus reçus
          if (msg.receiver._id === userData._id && !msg.read) {
            convoMap.get(contactId).unreadCount += 1;
          }
        });

        setConversations([...convoMap.values()]);
      } catch (error) {
        console.error("Erreur chargement conversations :", error.message);
      }
    };

    if (userData?._id) {
      fetchConversations();
    }
  }, [userData]);

  return (
    <div className="border-r p-4 w-64 bg-gray-50 h-full overflow-y-auto">
      <h3 className="mb-4 font-bold text-lg">Conversations</h3>

      {conversations.map(conv => (
        <div
          key={conv.user._id}
          className="mb-3 flex justify-between items-center cursor-pointer"
          onClick={() => onSelect(conv.user)}
        >
          <div>
            <div className="text-sm font-medium">{conv.user.firstName} {conv.user.lastName}</div>
            <div className="text-xs text-gray-500">{conv.user.role}</div>
          </div>
          {conv.unreadCount > 0 && (
            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
              {conv.unreadCount}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserList;
