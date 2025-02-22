import { useState, useEffect } from "react";
import { FaPaperPlane, FaUserCircle, FaSearch } from "react-icons/fa";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:9000", { withCredentials: true });

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser?.username) {
            setUsername(storedUser.username);
        }
    }, []);

    useEffect(() => {
        const fetchSenderId = async () => {
            try {
                if (!username) return;
                const response = await axios.get(`http://localhost:9000/api/user/getUserId/${username}`);
                setCurrentUserId(response.data.userId);
            } catch (error) {
                console.error("Error fetching sender ID:", error);
            }
        };
        fetchSenderId();
    }, [username]);

    useEffect(() => {
        if (!selectedUser) return;
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/api/messages/${selectedUser._id}`);
                setMessages(response.data.messages);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        fetchMessages();
    }, [selectedUser]);

    useEffect(() => {
        const handleReceiveMessage = (message) => {
            if (
                message.senderId === selectedUser?._id ||
                (message.receiverId === selectedUser?._id && message.senderId === currentUserId)
            ) {
                setMessages((prev) => [...prev, message]);
            }
        };

        socket.on("receiveMessage", handleReceiveMessage);
        return () => socket.off("receiveMessage", handleReceiveMessage);
    }, [selectedUser, currentUserId]);

    const handleSearch = async () => {
        if (!search.trim()) return;
        try {
            const response = await axios.get(`http://localhost:9000/api/user/search?username=${search}`);
            setUsers(response.data.users);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleSelectUser = async (user) => {
        try {
            const response = await axios.get(`http://localhost:9000/api/user/getUserId/${user.username}`);
            setSelectedUser({ ...user, _id: response.data.userId });
        } catch (error) {
            console.error("Error fetching receiver ID:", error);
        }
        
        setSearch("");
    };

    const sendMessage = async () => {
        if (!input.trim() || !selectedUser || !currentUserId) {
            return;
        }

        const messageData = {
            senderId: currentUserId,
            receiverId: selectedUser._id,
            text: input.trim(),
        };

        try {
            const response = await axios.post("http://localhost:9000/api/messages/send", messageData, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.data.success) {
                const savedMessage = response.data.data;
                socket.emit("sendMessage", savedMessage);
                setMessages((prev) => [...prev, savedMessage]);
                setInput("");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            <div className="w-1/4 bg-gray-800 p-4 flex flex-col">
                <h2 className="text-xl font-bold mb-4">Chats</h2>
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

            <div className="flex-1 flex flex-col">
                <div className="bg-gray-800 p-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold">{selectedUser ? `Chat with ${selectedUser.username}` : "Select a user to chat"}</h2>
                    <div className="flex items-center gap-2">
                        <FaUserCircle className="text-2xl" />
                        <span>{username}</span>
                    </div>
                </div>
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