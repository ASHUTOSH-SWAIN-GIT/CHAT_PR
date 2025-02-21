require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const Userroute = require("./routes/UserRoutes");
const Messageroute = require("./routes/messageRoutes");

const app = express();
const port = process.env.PORT || 4000;

// Create HTTP server for WebSocket
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

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
    console.log(" Connected to MongoDB");
    server.listen(port, () => {
      console.log(` Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(" Database connection error:", err);
    process.exit(1);
  });

// ======================  Socket.io Setup  ======================
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

  // Handle incoming messages
  socket.on("sendMessage", (data) => {
    console.log(" Message received:", data);
    io.emit("receiveMessage", data); // Send message to all users
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(` User disconnected: ${socket.id}`);
  });
});
