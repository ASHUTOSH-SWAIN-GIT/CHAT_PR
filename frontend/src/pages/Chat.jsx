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
    
    const navigate = useNavigate();
    const username = sessionStorage.getItem("username");
    const currentUserId = sessionStorage.getItem("userId");

    useEffect(() => {
        if (!username || !currentUserId) navigate("/login");
    }, [username, currentUserId, navigate]);

    useEffect(() => {
        if (!currentUserId) return;

        const newSocket = io("https://chat-pr.onrender.com", {
            withCredentials: true,
            query: { userId: currentUserId },
        });

        setSocket(newSocket);
        newSocket.emit("join", currentUserId);

        return () => newSocket.disconnect();
    }, [currentUserId]);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message) => {
            if (selectedUser?._id === message.senderId) {
                setMessages(prev => [...prev, message]);
            } else {
                setNotifications(prev => ({
                    ...prev,
                    [message.senderId]: (prev[message.senderId] || 0) + 1,
                }));
            }
        };

        socket.on("receiveMessage", handleReceiveMessage);
        return () => socket.off("receiveMessage", handleReceiveMessage);
    }, [socket, selectedUser]);

    const handleSearch = async () => {
        if (!search.trim()) return setUsers([]);
        
        try {
            const response = await axios.get(
                `https://chat-pr.onrender.com/api/user/search?username=${search}`
            );
            setUsers(response.data.users.filter(user => user._id !== currentUserId));
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
                setMessages(prev => [...prev, response.data.data]);
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
        <div className="flex h-screen bg-gray-900 text-white">
            {/* Left Sidebar */}
            <div className="w-1/4 bg-gray-800 flex flex-col border-r border-gray-700">
                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-blue-400">Chats</h2>
                        <div className="relative">
                            <FaBell className="text-gray-400 hover:text-blue-400 cursor-pointer" />
                            {Object.values(notifications).some(count => count > 0) && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 py-1 rounded-full">
                                    {Object.values(notifications).reduce((a, b) => a + b, 0)}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                        />
                    </div>
                </div>

                {/* User List */}
                <div className="flex-1 overflow-y-auto p-2">
                    {users.map(user => (
                        <div
                            key={user._id}
                            className={`flex items-center justify-between p-3 rounded-lg mb-2 cursor-pointer ${
                                selectedUser?._id === user._id 
                                    ? "bg-blue-500 bg-opacity-20"
                                    : "hover:bg-gray-700"
                            }`}
                            onClick={() => setSelectedUser(user)}
                        >
                            <div className="flex items-center gap-3">
                                <FaUserCircle className="text-2xl text-blue-400" />
                                <div>
                                    <h3 className="font-semibold">{user.username}</h3>
                                    <p className="text-xs text-gray-400">Active now</p>
                                </div>
                            </div>
                            {notifications[user._id] > 0 && (
                                <span className="bg-red-500 text-xs px-2 py-1 rounded-full">
                                    {notifications[user._id]}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-800">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {selectedUser ? (
                            <>
                                <FaUserCircle className="text-2xl text-blue-400" />
                                <div>
                                    <h2 className="font-bold">{selectedUser.username}</h2>
                                    <p className="text-xs text-blue-400">Online</p>
                                </div>
                            </>
                        ) : (
                            <h2 className="text-gray-300">Select a user to chat</h2>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-blue-400">@{username}</span>
                        <button 
                            onClick={handleLogout}
                            className="text-gray-300 hover:text-blue-400"
                        >
                            <FaSignOutAlt className="text-xl" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map(msg => (
                        <div
                            key={msg._id}
                            className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`max-w-md p-3 rounded-lg ${
                                msg.senderId === currentUserId 
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-700"
                            }`}>
                                <p className="text-sm">{msg.text}</p>
                                <p className="text-xs mt-1 text-gray-300 text-right">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            className="flex-1 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none text-white"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                            disabled={!selectedUser}
                        />
                        <button
                            onClick={sendMessage}
                            className="p-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 disabled:opacity-50"
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