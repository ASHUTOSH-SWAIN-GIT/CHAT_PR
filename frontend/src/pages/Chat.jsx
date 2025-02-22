import { useState, useEffect } from "react";
import { FaPaperPlane, FaUserCircle, FaSearch } from "react-icons/fa";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:9000"); // Change to your backend URL

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const currentUserId = "currentUserId"; // Replace this with the logged-in user's ID

    // Load messages when a user is selected
    useEffect(() => {
        if (!selectedUser) return;

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/api/messages/${selectedUser.conversationId}`);
                setMessages(response.data.messages);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, [selectedUser]);

    // Listen for real-time messages
    useEffect(() => {
        socket.on("receive_message", (message) => {
            if (message.conversationId === selectedUser?.conversationId) {
                setMessages((prev) => [...prev, message]);
            }
        });

        return () => {
            socket.off("receive_message");
        };
    }, [selectedUser]);

    // Search users
    const handleSearch = async () => {
        if (!search.trim()) return;
        try {
            const response = await axios.get(`http://localhost:9000/api/user/search?username=${search}`);
            setUsers(response.data.users);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    // Select user and load messages
    const handleSelectUser = async (user) => {
        setSelectedUser(user);
        setMessages([]); // Clear previous messages
        setUsers([]); // Clear search results
        setSearch(""); // Clear search input

        try {
            const response = await axios.get(`http://localhost:9000/api/messages/${user.conversationId}`);
            setMessages(response.data.messages);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    // Send message and save it in DB
    const sendMessage = async () => {
        if (input.trim() === "" || !selectedUser) return;

        const messageData = {
            conversationId: selectedUser.conversationId,
            senderId: currentUserId,
            receiverId: selectedUser._id,
            text: input,
        };

        try {
            // Send message to backend
            const response = await axios.post("http://localhost:9000/api/messages/send", messageData);

            if (response.data.success) {
                const savedMessage = response.data.data;

                // Emit message to socket.io for real-time update
                socket.emit("send_message", savedMessage);

                // Update UI
                setMessages((prev) => [...prev, savedMessage]);
                setInput("");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            {/* Chat Sidebar */}
            <div className="w-1/4 bg-gray-800 p-4 flex flex-col">
                <h2 className="text-xl font-bold mb-4">Chats</h2>
                {/* Search Bar */}
                <div className="flex items-center bg-gray-700 p-2 rounded mb-4">
                    <input
                        type="text"
                        className="flex-1 bg-transparent border-none focus:outline-none text-white"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button onClick={handleSearch} className="ml-2 text-gray-400 hover:text-white">
                        <FaSearch />
                    </button>
                </div>
                {/* Display Users */}
                {users.map((user) => (
                    <div
                        key={user._id}
                        className="flex items-center gap-2 p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
                        onClick={() => handleSelectUser(user)}
                    >
                        <FaUserCircle className="text-2xl" />
                        <span>{user.username}</span>
                    </div>
                ))}
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="bg-gray-800 p-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold">{selectedUser ? `Chat with ${selectedUser.username}` : "Select a user to chat"}</h2>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-auto flex flex-col gap-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-3 max-w-xs rounded-lg ${msg.senderId === currentUserId ? "bg-blue-600 self-end" : "bg-gray-700 self-start"}`}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>

                {/* Input Field */}
                <div className="p-4 bg-gray-800 flex items-center gap-2">
                    <input
                        type="text"
                        className="flex-1 p-2 rounded bg-gray-700 border-none text-white focus:outline-none"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button onClick={sendMessage} className="p-2 bg-blue-600 rounded hover:bg-blue-500">
                        <FaPaperPlane className="text-xl" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
