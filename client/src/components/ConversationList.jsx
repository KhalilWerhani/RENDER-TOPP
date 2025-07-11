import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContent } from "../context/AppContext";

const ConversationList = ({ endpoint, backendUrl, onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const { userData } = useContext(AppContent);
  const currentUserId = userData?._id || userData?.id;

  useEffect(() => {
    fetchConversations();
  }, [page]);

  const fetchConversations = async () => {
    try {
      setIsFetching(true);
      const { data } = await axios.get(`${backendUrl}${endpoint}?page=${page}&limit=20`, {
        withCredentials: true,
      });
      setConversations((prev) => [...prev, ...(data.conversations || [])]);
      if ((data.conversations || []).length < 20) setHasMore(false);
    } catch (err) {
      console.error("Error fetching conversations", err);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
  const contact = conv.user || conv.sender || conv.receiver || {};
  const name = contact?.name?.toLowerCase() || "";
  return name.includes(search.toLowerCase());
});


  const handleConversationClick = (contactId) => {
    axios.patch(`${backendUrl}/api/messages/conversation/${contactId}/read`, {}, {
      withCredentials: true,
    });
    onSelectConversation(contactId);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Search Header */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loading && page === 1 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-10 w-10"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-10 w-10"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6">
            <svg className="h-16 w-16 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-center">No conversations found</p>
            <p className="text-sm mt-1">Start a new conversation</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredConversations.map((conv) => {
              const contact = conv.user;
              if (!contact?._id) return null;

              return (
                <li
                  key={conv._id}
                  className="px-4 py-3 hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
                  onClick={() => handleConversationClick(contact._id)}
                >
                  <ConversationItem contact={contact} conv={conv} currentUserId={currentUserId} />
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Load More Button */}
      {!loading && hasMore && (
        <div className="p-4 border-t border-gray-100 bg-white">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={isFetching}
            className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
              isFetching
                ? 'bg-gray-100 text-gray-400'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700'
            }`}
          >
            {isFetching ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              'Load more conversations'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

const ConversationItem = ({ contact, conv, currentUserId }) => {
  const lastMsg = conv.lastMessage || conv;
  const isUnread =
    lastMsg?.read === false &&
    lastMsg?.senderId &&
    lastMsg.senderId !== currentUserId;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

const getInitials = (contact) => {
  const base = contact?.name || "U";
  return base
    .split(" ")
    .map(word => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};




  return (
    <div className="flex items-center space-x-3">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
          {getInitials(contact)}

        </div>
        {contact.isOnline && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
        )}
      </div>

      {/* Conversation Details */}
      <div className="flex-1 min-w-0">
       <div className="flex justify-between items-center">
  <div className="flex items-center gap-2">
    <h3 className="text-sm font-medium text-gray-900 truncate">
      {contact?.name || "Nom inconnu"}
    </h3>
    <span
      className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${
        contact.role === "admin"
          ? "bg-red-100 text-red-600"
          : contact.role === "BO"
          ? "bg-yellow-100 text-yellow-600"
          : "bg-green-100 text-green-600"
      }`}
    >
      {contact.role || "?"}
    </span>
  </div>

  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
    {formatDate(lastMsg?.createdAt || conv.createdAt)}
  </span>
</div>


        <div className="flex justify-between items-center mt-1">
          <p className={`text-sm truncate ${isUnread ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
            {lastMsg?.content || "No messages yet"}
          </p>
          {isUnread && (
            <span className="ml-2 flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-white text-xs font-medium">
              1
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationList;