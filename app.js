const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const userRoute = require("./routes/userRoute");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", userRoute);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const prisma = new PrismaClient();

const allUser = {};

io.on("connection", (socket) => {
  // When a new user connects
  socket.on("new-user", (userId) => {
    allUser[userId] = socket.id; // Map user ID to socket ID
  });

  socket.on("send-chat-message", async (data) => {
    const { content, recipientId, senderId } = data; // Assuming senderId is now part of the data sent from the client

    const newMessage = await prisma.message.create({
      data: {
        senderId: senderId,
        receiverId: recipientId,
        content: content,
      },
    });

    // Check if the recipient is online by checking their socket ID
    const recipientSocketId = allUser[recipientId];

    if (recipientSocketId) {
      // If the recipient is online, send the message to their socket
      io.to(recipientSocketId).emit("chat-message", newMessage);
    } else {
      console.log("Recipient not online.");
    }
  });
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
