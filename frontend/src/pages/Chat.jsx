import { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaUserCircle, FaSearch, FaBell, FaSignOutAlt } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
    // ... [Keep all the existing state and logic]

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // ... [Keep all existing useEffect hooks and functions]

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-800/80 backdrop-blur-lg p-6 flex flex-col border-r border-gray-700/50">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Messages
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">{username && `@${username}`}</span>
                        <button 
                            onClick={handleLogout}
                            className="p-2 rounded-lg hover:bg-gray-700/50 transition-all group relative"
                            title="Logout"
                        >
                            <FaSignOutAlt className="text-red-400 group-hover:text-red-300 transition-colors" />
                        </button>
                    </div>
                </div>

                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                    </div>
                    <input 
                        type="text" 
                        className="w-full bg-gray-700/50 backdrop-blur-sm py-3 pl-10 pr-4 rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all placeholder-gray-400"
                        placeholder="Search contacts..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                </div>

                <div className="overflow-y-auto space-y-1">
                    {users.map((user) => (
                        <div 
                            key={user._id}
                            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all group ${
                                selectedUser?._id === user._id 
                                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30"
                                : "hover:bg-gray-700/30 border border-transparent hover:border-gray-600/50"
                            }`}
                            onClick={() => setSelectedUser(user)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <FaUserCircle className="text-3xl text-blue-400/80 group-hover:text-blue-300 transition-colors" />
                                    {notifications[user._id] > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs animate-pulse">
                                            {notifications[user._id]}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-100">{user.username}</h3>
                                    <p className="text-xs text-gray-400">Last active recently</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-900/50 to-gray-800/50">
                {/* Header */}
                <div className="bg-gray-800/50 backdrop-blur-lg p-6 flex items-center justify-between border-b border-gray-700/50">
                    <div className="flex items-center gap-4">
                        {selectedUser ? (
                            <>
                                <FaUserCircle className="text-3xl text-purple-400" />
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-100">{selectedUser.username}</h2>
                                    <p className="text-sm text-gray-400">Online</p>
                                </div>
                            </>
                        ) : (
                            <h2 className="text-lg font-semibold text-gray-300">Select a contact to start chatting</h2>
                        )}
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    {messages.length === 0 && (
                        <div className="h-full flex items-center justify-center text-gray-400 text-lg">
                            No messages yet. Start the conversation!
                        </div>
                    )}
                    {messages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-md p-4 rounded-2xl shadow-lg ${
                                    msg.senderId === currentUserId 
                                    ? "bg-gradient-to-br from-blue-500 to-blue-600 ml-4"
                                    : "bg-gray-700/50 backdrop-blur-sm mr-4"
                                }`}
                            >
                                <p className="text-gray-100">{msg.text}</p>
                                <p className="text-xs mt-1.5 opacity-70">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-gray-800/50 backdrop-blur-lg p-6 border-t border-gray-700/50">
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            className="w-full bg-gray-700/50 backdrop-blur-sm py-3 px-4 rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all placeholder-gray-400 disabled:opacity-50"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                            disabled={!selectedUser}
                        />
                        <button 
                            onClick={sendMessage} 
                            className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 transition-all shadow-lg disabled:opacity-50"
                            disabled={!selectedUser || !input.trim()}
                        >
                            <IoMdSend className="text-xl text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;