import { useState, useEffect } from "react";
import { FaPaperPlane, FaUserCircle, FaSearch, FaBell, FaSignOutAlt } from "react-icons/fa";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [notifications, setNotifications] = useState({});
    const [socket, setSocket] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const username = sessionStorage.getItem("username");
    const currentUserId = sessionStorage.getItem("userId");

    useEffect(() => {
        if (!username || !currentUserId) {
            navigate("/login");
        }
    }, [username, currentUserId, navigate]);

    useEffect(() => {
        if (!currentUserId) return;

        const newSocket = io("https://chat-pr.onrender.com", {
            withCredentials: true,
            query: { userId: currentUserId },
        });

        setSocket(newSocket);
        newSocket.emit("join", currentUserId);

        return () => {
            newSocket.disconnect();
        };
    }, [currentUserId]);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message) => {
            if (selectedUser?._id === message.senderId) {
                setMessages((prev) => [...prev, message]);
            }
            if (selectedUser?._id !== message.senderId) {
                setNotifications((prev) => ({
                    ...prev,
                    [message.senderId]: (prev[message.senderId] || 0) + 1,
                }));
            }
        };

        socket.on("receiveMessage", handleReceiveMessage);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
        };
    }, [socket, selectedUser]);

    const handleSearch = async () => {
        if (!search.trim()) {
            setUsers([]);
            return;
        }

        try {
            const response = await axios.get(
                `https://chat-pr.onrender.com/api/user/search?username=${search}`
            );
            setUsers(response.data.users.filter((user) => user._id !== currentUserId));
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || !selectedUser || !currentUserId) return;

        const messageData = {
            senderId: currentUserId,
            receiverId: selectedUser._id,
            text: input.trim(),
        };

        try {
            const response = await axios.post(
                "https://chat-pr.onrender.com/api/messages/send", 
                messageData
            );

            if (response.data.success) {
                socket.emit("sendMessage", response.data.data);
                setMessages((prev) => [...prev, response.data.data]);
                setInput("");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleLogout = () => {
        socket?.disconnect();
        sessionStorage.clear();
        navigate("/login");
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            {/* Left Sidebar */}
            <div className="w-1/4 bg-gray-800/90 backdrop-blur-sm p-6 flex flex-col border-r border-gray-700/50 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Messages
                    </h2>
                    <div className="relative group">
                        <FaBell className="text-xl text-gray-400 hover:text-cyan-400 cursor-pointer transition-colors" />
                        {Object.values(notifications).some(count => count > 0) && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 py-1 rounded-full">
                                {Object.values(notifications).reduce((a, b) => a + b, 0)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="w-full bg-gray-700/50 border border-gray-600/30 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent placeholder-gray-400"
                        placeholder="Search contacts..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                </div>

                {/* Contacts List */}
                <div className="overflow-y-auto space-y-1.5">
                    {users.map((user) => (
                        <div 
                            key={user._id}
                            className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                                selectedUser?._id === user._id 
                                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30"
                                    : "hover:bg-gray-700/50 border border-transparent"
                            } cursor-pointer group`}
                            onClick={() => setSelectedUser(user)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <FaUserCircle className="text-2xl text-cyan-400/80" />
                                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-gray-900"></span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-100">{user.username}</h3>
                                    <p className="text-xs text-gray-400">Active now</p>
                                </div>
                            </div>
                            {notifications[user._id] > 0 && (
                                <span className="bg-red-500 text-xs px-2 py-1 rounded-full min-w-[24px] flex items-center justify-center">
                                    {notifications[user._id]}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Chat Area */}
            <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-900/80 to-gray-800/80">
                {/* Chat Header */}
                <div className="bg-gray-800/70 backdrop-blur-sm p-4 flex items-center justify-between border-b border-gray-700/50">
                    <div className="flex items-center gap-3">
                        {selectedUser ? (
                            <>
                                <FaUserCircle className="text-2xl text-cyan-400" />
                                <div>
                                    <h2 className="font-bold text-gray-100">{selectedUser.username}</h2>
                                    <p className="text-xs text-cyan-400">Online</p>
                                </div>
                            </>
                        ) : (
                            <h2 className="text-lg font-semibold text-gray-300">Select a contact to start chatting</h2>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-gray-700/50 px-4 py-2 rounded-xl">
                            <span className="text-sm text-cyan-400">{username && `@${username}`}</span>
                            <button 
                                onClick={handleLogout}
                                className="text-gray-300 hover:text-cyan-400 transition-colors"
                            >
                                <FaSignOutAlt className="text-lg" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    {messages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`max-w-md p-4 rounded-2xl ${
                                msg.senderId === currentUserId 
                                    ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
                                    : "bg-gray-700/60 backdrop-blur-sm"
                            } shadow-lg transition-all duration-300 hover:shadow-xl`}>
                                <p className="text-sm">{msg.text}</p>
                                <p className="text-xs mt-1 opacity-70 text-right">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message Input */}
                <div className="bg-gray-800/70 backdrop-blur-sm p-4 border-t border-gray-700/50">
                    <div className="flex items-center gap-3 bg-gray-700/50 rounded-xl p-2 shadow-lg">
                        <input
                            type="text"
                            className="flex-1 bg-transparent px-4 py-3 focus:outline-none placeholder-gray-400"
                            placeholder="Type your message here..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                            disabled={!selectedUser}
                        />
                        <button
                            onClick={sendMessage}
                            className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                            disabled={!selectedUser || !input.trim()}
                        >
                            <FaPaperPlane className="text-lg" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;