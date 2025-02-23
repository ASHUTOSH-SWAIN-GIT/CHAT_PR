import { useState, useEffect } from "react";
import { FaPaperPlane, FaUserCircle, FaSearch, FaBell } from "react-icons/fa";
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

    // Authentication and redirect
    useEffect(() => {
        if (!username || !currentUserId) {
            navigate("/login");
        }
    }, [username, currentUserId, navigate]);

    // Socket connection management
    useEffect(() => {
        if (!currentUserId) return;

        const newSocket = io("http://localhost:9000", {
            withCredentials: true,
            query: { userId: currentUserId },
        });

        setSocket(newSocket);

        // Join the user's room
        newSocket.emit("join", currentUserId);

        // Cleanup on unmount
        return () => {
            newSocket.disconnect();
        };
    }, [currentUserId]);

    // Handle receiving messages
    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message) => {
            console.log("New message received:", message);

            // If the message is from the selected user, add it to the chat
            if (selectedUser?._id === message.senderId) {
                setMessages((prev) => [...prev, message]);
            }

            // Update notification count for unseen messages
            if (selectedUser?._id !== message.senderId) {
                setNotifications((prev) => ({
                    ...prev,
                    [message.senderId]: (prev[message.senderId] || 0) + 1,
                }));
            }
        };

        // Handle new notifications
        const handleNewNotification = (notification) => {
            console.log("New notification:", notification);

            // Update notification count for the sender
            setNotifications((prev) => ({
                ...prev,
                [notification.senderId]: (prev[notification.senderId] || 0) + 1,
            }));
        };

        // Handle updating the chat list
        const handleUpdateChatList = (newUser) => {
            console.log("Updating chat list with:", newUser);

            // Check if the user is already in the chat list
            const userExists = users.some((user) => user._id === newUser.senderId);

            if (!userExists) {
                // Add the new user to the chat list
                setUsers((prev) => [
                    ...prev,
                    { _id: newUser.senderId, username: newUser.username },
                ]);
            }
        };

        socket.on("receiveMessage", handleReceiveMessage);
        socket.on("newNotification", handleNewNotification);
        socket.on("updateChatList", handleUpdateChatList);

        // Cleanup listeners
        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("newNotification", handleNewNotification);
            socket.off("updateChatList", handleUpdateChatList);
        };
    }, [socket, selectedUser, users]);

    // Fetch messages when a user is selected
    useEffect(() => {
        if (!selectedUser || !currentUserId) return;

        const abortController = new AbortController();
        
        const fetchMessages = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(
                    `http://localhost:9000/api/messages/${selectedUser._id}`,
                    { signal: abortController.signal }
                );

                if (response.data.success) {
                    const sortedMessages = response.data.messages.sort(
                        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                    );
                    setMessages(sortedMessages);

                    // Mark messages as read
                    if (response.data.messages.some((msg) => !msg.isRead)) {
                        await axios.post(
                            `http://localhost:9000/api/messages/markAsRead`,
                            { 
                                senderId: selectedUser._id,
                                receiverId: currentUserId,
                            }
                        );
                    }
                    setNotifications((prev) => ({ ...prev, [selectedUser._id]: 0 }));
                }
            } catch (error) {
                if (!abortController.signal.aborted) {
                    console.error("Error fetching messages:", error);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
        return () => abortController.abort();
    }, [selectedUser, currentUserId]);

    // Search for users
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

    // Send message
    const sendMessage = async () => {
        if (!input.trim() || !selectedUser || !currentUserId) return;

        const messageData = {
            senderId: currentUserId,
            receiverId: selectedUser._id,
            text: input.trim(),
        };

        try {
            // Save message to the database
            const response = await axios.post(
                "http://localhost:9000/api/messages/send", 
                messageData
            );

            if (response.data.success) {
                // Emit the message via Socket.IO
                socket.emit("sendMessage", response.data.data);

                // Add the message to the local state
                setMessages((prev) => [...prev, response.data.data]);
                setInput("");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // Logout handler
    const handleLogout = () => {
        socket?.disconnect();
        sessionStorage.clear();
        navigate("/login");
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            {/* Left Sidebar */}
            <div className="w-1/4 bg-gray-800 p-4 flex flex-col">
                <h2 className="text-xl font-bold mb-4">Chats</h2>
                <div className="flex items-center bg-gray-700 p-2 rounded mb-4">
                    <input 
                        type="text" 
                        className="flex-1 bg-transparent border-none focus:outline-none text-white"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button 
                        onClick={handleSearch} 
                        className="ml-2 text-gray-400 hover:text-white"
                    >
                        <FaSearch />
                    </button>
                </div>
                {users.map((user) => (
                    <div 
                        key={user._id}
                        className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-600 ${
                            selectedUser?._id === user._id ? "bg-gray-600" : "bg-gray-700"
                        }`}
                        onClick={() => setSelectedUser(user)}
                    >
                        <div className="flex items-center gap-2">
                            <FaUserCircle className="text-2xl" />
                            <span>{user.username}</span>
                        </div>
                        {notifications[user._id] > 0 && (
                            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                                {notifications[user._id]}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col">
                <div className="bg-gray-800 p-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold">
                        {selectedUser 
                            ? `Chat with ${selectedUser.username}`
                            : "Select a user to chat"}
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="text-white font-semibold">
                            {username && `Logged in as: ${username}`}
                        </span>
                        <button 
                            onClick={handleLogout}
                            className="bg-red-500 px-3 py-1 rounded text-white text-sm hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto">
                    {isLoading ? (
                        <div className="text-center text-gray-400">Loading messages...</div>
                    ) : messages.length === 0 ? (
                        <div className="text-center text-gray-400">
                            {selectedUser ? "No messages yet" : "Select a user to start chatting"}
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg._id}
                                className={`mb-2 p-2 rounded max-w-[70%] ${
                                    msg.senderId === currentUserId 
                                        ? "bg-blue-500 ml-auto" 
                                        : "bg-gray-700"
                                }`}
                            >
                                {msg.text}
                                <div className="text-xs mt-1 opacity-70">
                                    {new Date(msg.createdAt).toLocaleTimeString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="bg-gray-800 p-4 flex items-center">
                    <input
                        type="text"
                        className="flex-1 bg-gray-700 p-2 rounded text-white focus:outline-none"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        disabled={!selectedUser}
                    />
                    <button 
                        onClick={sendMessage}
                        className="ml-2 text-gray-400 hover:text-white"
                        disabled={!selectedUser}
                    >
                        <FaPaperPlane />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;