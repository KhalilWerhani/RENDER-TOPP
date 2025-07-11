import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import socket from '../../utils/socket';

const ChatBox = ({ selectedUser }) => {
  const { userData: currentUser, backendUrl } = useContext(AppContent);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const messagesEndRef = useRef(null);

  // Charger la conversation + marquer comme lue
  useEffect(() => {
    if (!selectedUser || !currentUser?._id) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/messages/conversation/${selectedUser._id}`
        );
        setMessages(res.data.messages);

        // Marquer comme lus
        await axios.patch(
          `${backendUrl}/api/messages/conversation/${selectedUser._id}/read`
        );
      } catch (err) {
        console.error("Erreur lors du chargement de la conversation :", err.message);
      }
    };

    fetchMessages();
  }, [selectedUser, currentUser, backendUrl]);

  // Enregistrer le socket à la connexion
  useEffect(() => {
    if (currentUser?._id) {
      socket.emit('register', currentUser._id);
    }
  }, [currentUser]);

  // Réception temps réel
  useEffect(() => {
    const handleNewMessage = (msg) => {
      if (msg.senderId === selectedUser?._id) {
        setMessages(prev => [
          ...prev,
          {
            sender: selectedUser._id,
            receiver: currentUser._id,
            content: msg.content,
            createdAt: msg.timestamp,
            read: false
          }
        ]);
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [selectedUser, currentUser]);

  // Scroll vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!content.trim() || !selectedUser) return;

    const message = {
      receiver: selectedUser._id,
      content
    };

    try {
      const res = await axios.post(`${backendUrl}/api/messages/send`, message);

      socket.emit('sendMessage', {
        senderId: currentUser._id,
        receiverId: selectedUser._id,
        content
      });

      setMessages(prev => [...prev, res.data.message]);
      setContent('');
    } catch (error) {
      console.error("Erreur envoi message :", error.message);
    }
  };

  return (
    <div className="flex flex-col h-full border p-4 rounded-lg bg-white">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 text-sm mt-4">Aucun message</div>
        ) : (
          messages.map((msg, index) => {
            const isSender =
              msg.sender === currentUser._id ||
              (msg.sender?._id && msg.sender._id === currentUser._id);
            return (
              <div key={index} className={`mb-2 ${isSender ? 'text-right' : 'text-left'}`}>
                <span
                  className={`inline-block px-3 py-2 rounded ${
                    isSender
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-black'
                  } text-sm`}
                >
                  {msg.content}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border px-3 py-2 rounded"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écrire un message…"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
