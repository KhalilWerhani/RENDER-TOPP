// src/pages/bo/BOLayout.jsx
import { useState, useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import NavbarBO from './NavbarBO';
import SidebarBO from './SidebarBO';
import axios from 'axios';
import { AppContent } from '../../context/AppContext';
import ConversationList from '../../components/ConversationList';
import Messaging from '../../components/Messaging';

const BOLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const { backendUrl, userData } = useContext(AppContent);

  // Fetch unread message count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/messages/unread-count`,
          { withCredentials: true }
        );
        setUnreadCount(data.count || 0);
      } catch (err) {
        console.error("Error fetching unread count", err);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [backendUrl]);

  const handleSelectConversation = (userId) => {
    setSelectedConversation(userId);
  };

  const handleBackToConversations = () => {
    setSelectedConversation(null);
  };

  return (
    <div className="flex min-h-screen relative">
      <NavbarBO />
      <SidebarBO isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className={`flex-1 transition-all duration-300 ${isOpen ? 'ml-72' : 'ml-0'}`}>
        <main className="p-6 bg-gray-100 pt-20">
          <Outlet />
        </main>
      </div>

      {/* Messaging bubble - same as AdminLayout */}
      <div className="fixed bottom-10 right-6 z-50">
        {/* Conversation or message view */}
        {isMessagingOpen && (
          <div className="absolute bottom-20 right-0 w-96 h-[500px] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
            {selectedConversation ? (
              <Messaging 
                targetUserId={selectedConversation} 
                onBack={handleBackToConversations}
                embedded={true}
              />
            ) : (
              <>
                <div className="p-4 border-b border-gray-200 bg-blue-600 text-white">
                  <h3 className="text-lg font-semibold">Messages</h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <ConversationList
                    endpoint="/api/messages/conversations"
                    backendUrl={backendUrl}
                    onSelectConversation={handleSelectConversation}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Floating action button */}
        <button
          onClick={() => setIsMessagingOpen(!isMessagingOpen)}
          className={`relative w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 ${
            isMessagingOpen ? 'rotate-45' : 'rotate-0'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default BOLayout;