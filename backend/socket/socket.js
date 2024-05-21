import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  corse: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const getReceiverSocketId = (recieverId) => {
  return userSocketMap[recieverId];
};
const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId !== undefined) {
    userSocketMap[userId] = socket.id;
  }
  console.log(Object.keys(userSocketMap).length, "client connected", socket.id);

  io.emit("getOnlineUsers", Object.keys(userSocketMap)); //taking the keys of userSocketMap (userIds) and converting it into an array

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
    delete userSocketMap[userId];
  });
});

export { io, app, server, getReceiverSocketId };
