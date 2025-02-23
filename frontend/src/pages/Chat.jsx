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

        const newSocket = io("http://localhost:9000", {
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
                `http://localhost:9000/api/user/search?username=${search}`
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
                "http://localhost:9000/api/messages/send", 
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
        <div className="flex h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-800 p-6 flex flex-col border-r border-gray-700">
                <h2 className="text-2xl font-bold mb-6 text-blue-400">Chats</h2>
                <div className="flex items-center bg-gray-700 p-3 rounded-lg mb-4 shadow-lg">
                    <input 
                        type="text" 
                        className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder-gray-400"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button onClick={handleSearch} className="ml-3 text-gray-400 hover:text-blue-400 transition-colors">
                        <FaSearch />
                    </button>
                </div>
                <div className="overflow-y-auto">
                    {users.map((user) => (
                        <div 
                            key={user._id}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition duration-300 transform hover:scale-105 ${
                                selectedUser?._id === user._id ? "bg-gray-600" : "bg-gray-700"
                            } mb-2 shadow-md`}
                            onClick={() => setSelectedUser(user)}
                        >
                            <div className="flex items-center gap-3">
                                <FaUserCircle className="text-2xl text-blue-400" />
                                <span className="font-semibold">{user.username}</span>
                            </div>
                            {notifications[user._id] > 0 && (
                                <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                                    {notifications[user._id]}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-gray-800 p-6 flex items-center justify-between shadow-lg">
                    <h2 className="text-lg font-bold text-blue-400">
                        {selectedUser ? `Chat with ${selectedUser.username}` : "Select a user to chat"}
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="text-white font-semibold">{username && `@${username}`}</span>
                        <button 
                            onClick={handleLogout} 
                            className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600 transition-colors"
                        >
                            <FaSignOutAlt />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-6 overflow-y-auto bg-gray-900">
                    {messages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`mb-3 p-3 rounded-lg max-w-xs text-white shadow-lg ${
                                msg.senderId === currentUserId ? "bg-blue-500 ml-auto" : "bg-gray-700"
                            }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="bg-gray-800 p-4 flex items-center shadow-lg">
                    <input
                        type="text"
                        className="flex-1 bg-gray-700 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        disabled={!selectedUser}
                    />
                    <button 
                        onClick={sendMessage} 
                        className="ml-3 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                        <FaPaperPlane />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;