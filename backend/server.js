require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const  Message = require(`../backend/models/MessaegModel`)

const Userroute = require("./routes/UserRoutes");
const Messageroute = require("./routes/messageRoutes");

const app = express();
const port = process.env.PORT || 4000;

// Create HTTP server for WebSocket
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Fixed trailing slash
    credentials: true, // ✅ Required for authentication & sessions
  })
);

// Routes
app.use("/api/user", Userroute);
app.use("/api/messages", Messageroute);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    server.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  });

// ======================  Socket.io Setup  ======================
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // ✅ Fixed trailing slash
    methods: ["GET", "POST"],
    credentials: true, // ✅ Allow credentials (important for auth)
  },
});

// ✅ Store `io` in the app instance
app.set("io", io);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // When a user logs in, join their unique room
  socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their personal room`);
  });

  // Handle message sending
  socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
      try {
          // Save message to database
          const newMessage = new Message({ senderId, receiverId, text, isRead: false });
          await newMessage.save();

          // ✅ Emit real-time message to receiver's room
          io.to(receiverId).emit("receiveMessage", newMessage);

          // ✅ Send notification to receiver (even if chat isn't open)
          io.to(receiverId).emit("newNotification", {
              senderId,
              text,
              timestamp: newMessage.createdAt,
          });

      } catch (error) {
          console.error("Error sending message:", error);
      }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
  });
});


