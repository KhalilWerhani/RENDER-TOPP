import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import { assets } from "../assets/assets.js";

const Messaging = ({ targetUserId, onBack, embedded = false }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [receiverName, setReceiverName] = useState("");
    const [receiverAvatar, setReceiverAvatar] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    const [isReceiverOnline, setIsReceiverOnline] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [lastLogin, setLastLogin] = useState(null);

    const { backendUrl, userData, socket } = useContext(AppContent);
    const userId = userData?._id || userData?.id;

    useEffect(() => {
        if (userId && targetUserId) {
            fetchMessages();
            fetchReceiverInfo();
            markConversationAsRead();
        }
    }, [userId, targetUserId]);

    const fetchMessages = async () => {
        try {
            const endpoint =
                userData.role === "user"
                    ? `${backendUrl}/api/messages/conversation/${targetUserId}`
                    : `${backendUrl}/api/messages/${userId}/${targetUserId}`;
            const { data } = await axios.get(endpoint, { withCredentials: true });
            setMessages(data.messages || []);
        } catch (err) {
            toast.error("Erreur lors du chargement des messages");
        }
    };

    const fetchReceiverInfo = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/get-by-id/${targetUserId}`, {
                withCredentials: true,
            });
            setReceiverName(data.user?.name || "Utilisateur");
            setReceiverAvatar(data.user?.avatar || "/default-avatar.png");
setLastLogin(data.user?.lastLogin || null);
        } catch (err) {
            setReceiverName("Utilisateur");
            setReceiverAvatar("/default-avatar.png");
            setLastLogin(null); // fallback

        }
    };

    const markConversationAsRead = async () => {
        try {
            await axios.patch(
                `${backendUrl}/api/messages/conversation/${targetUserId}/read`,
                {},
                { withCredentials: true }
            );
        } catch (error) {
            console.error("Erreur marquage conversation comme lue", error);
        }
    };

    useEffect(() => {
        const checkReceiverOnline = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/socket/status/${targetUserId}`);
                setIsReceiverOnline(data.online);
            } catch (err) {
                setIsReceiverOnline(false);
            }
        };

        if (targetUserId) {
            checkReceiverOnline();
        }
    }, [targetUserId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || isSending) return;
        setIsSending(true);

        try {
            console.log({ senderId: userId, receiverId: targetUserId, message: newMessage });
            const { data } = await axios.post(
                `${backendUrl}/api/messages/send`,
                {
                    sender: userId,
                    receiver: targetUserId,
                    content: newMessage,
                },
                { withCredentials: true }
            );

            setMessages((prev) => [...prev, data.message]);
            setNewMessage("");

            if (socket && data.message) {
                socket.emit("sendMessage", {
                    senderId: userId,
                    receiverId: targetUserId,
                    content: newMessage,
                });
            }
        } catch (err) {
            toast.error("Erreur lors de l'envoi du message");
        } finally {
            setIsSending(false);
        }
    };

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message) => {
            const senderId = message.sender?._id || message.sender;
            const receiverId = message.receiver?._id || message.receiver;

            if (senderId === targetUserId || receiverId === targetUserId) {
                setMessages((prev) => [...prev, message]);
            }
        };


        const handleTyping = (data) => {
            if (data.senderId === targetUserId) {
                setIsTyping(data.isTyping);
            }
        };

        socket.on("newMessage", handleNewMessage);
        socket.on("typing", handleTyping);

        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("typing", handleTyping);
        };
    }, [socket, targetUserId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);

        // Emit typing event
        if (socket) {
            socket.emit("typing", {
                senderId: userId,
                receiverId: targetUserId,
                isTyping: e.target.value.length > 0
            });
        }
    };

    return (
        <div className={`${embedded ? 'h-full flex flex-col' : 'p-0 max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden'} font-sans`}>
            {/* Header */}
            <div className={`flex items-center justify-between ${embedded ? 'p-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-blue-500 text-white' : 'p-6 border-b border-gray-100'}`}>
                <div className="flex items-center space-x-4">
                    {embedded ? (
                        <button
                            onClick={onBack}
                            className="text-white hover:text-blue-100 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    ) : (
                        <a href="/messages" className="text-blue-600 hover:text-blue-800 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                        </a>
                    )}

                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <img
                                src={assets.person_icon}
                                alt={receiverName}
                                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                            <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${isReceiverOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        </div>
                        <div>
                            <h2 className={`${embedded ? 'font-medium text-white' : 'text-lg font-semibold text-gray-800'}`}>
                                {receiverName}
                            </h2>
                            <p className={`text-xs ${embedded ? 'text-blue-100' : 'text-gray-500'}`}>
                                {isTyping
                                    ? "En train d'écrire..."
                                    : isReceiverOnline
                                        ? "En ligne"
                                        : lastLogin
                                            ? `Dernière connexion : ${new Date(lastLogin).toLocaleString("fr-FR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}`
                                            : "Hors ligne"}
                            </p>
                        </div>
                    </div>
                </div>

                {!embedded && (
                    <button className="text-gray-500 hover:text-gray-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Messages Area */}
            <div className={`${embedded ? 'flex-1 overflow-y-auto p-4 bg-gray-50' : 'p-6 h-[400px] overflow-y-auto bg-gray-50'}`}>
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <p className="text-center">Aucun message dans cette conversation</p>
                        <p className="text-sm mt-1">Envoyez votre premier message</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {messages.map((msg) => {
                            const isSender = msg.sender === userId || msg.sender?._id === userId;
                            return (
                                <div
                                    key={msg._id}
                                    className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[75%] px-4 py-3 rounded-2xl ${isSender
                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                                            : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                                            } transition-all duration-200 transform hover:scale-[1.01]`}
                                    >
                                        <div className="whitespace-pre-wrap break-words">
                                            {msg.content}
                                        </div>
                                        <div className={`flex items-center justify-end mt-1 space-x-1 ${isSender ? 'text-blue-100' : 'text-gray-400'}`}>
                                            <span className="text-xs">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {isSender && (
                                                <span className="text-xs">
                                                    {msg.read ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M9.707 14.707a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414l1.293 1.293 4.293-4.293a1 1 0 011.414 1.414l-5 5z" clipRule="evenodd" fillRule="evenodd" />
                                                            <path d="M9.707 16.707a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414l1.293 1.293 4.293-4.293a1 1 0 011.414 1.414l-5 5z" clipRule="evenodd" fillRule="evenodd" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M9.707 14.707a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414l1.293 1.293 4.293-4.293a1 1 0 011.414 1.414l-5 5z" clipRule="evenodd" fillRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className={`${embedded ? 'p-3 border-t border-gray-100 bg-white' : 'p-4 border-t border-gray-100 bg-white'}`}>
                <div className="flex items-center space-x-2">
                    <button className="text-gray-500 hover:text-blue-600 p-2 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </button>

                    <div className="flex-1 relative">
                        <input
                            type="text"
                            className="w-full border border-gray-200 rounded-full py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Écrivez votre message..."
                            value={newMessage}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                        />
                        {newMessage && (
                            <button
                                onClick={() => setNewMessage("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>

                    <button
                        onClick={handleSendMessage}
                        disabled={isSending || !newMessage.trim()}
                        className={`p-3 rounded-full ${isSending || !newMessage.trim()
                            ? 'bg-gray-200 text-gray-400'
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200'}`}
                    >
                        {isSending ? (
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Messaging;