const socketIo = require("socket.io");
const Chat = require("../Model/ChatModel");
const Conversation = require("../Model/ConversationModel");
const AdminChat = require("../Model/AdminChatModel");
const AdminConversation = require("../Model/AdminConversationModel");

let onlineUsers = {};

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: [
        process.env.student,
        process.env.hiring,
        "http://localhost:3000",
        "http://localhost:3001",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    socket.on("userConnected", (userId) => {
      onlineUsers[userId] = socket.id;
      io.emit("userStatus", { userId, online: true });
      console.log("conntected", onlineUsers);
    });

    socket.on("userDisconnected", () => {
      const userId = Object.keys(onlineUsers).find(
        (key) => onlineUsers[key] === socket.id
      );
      if (userId) {
        delete onlineUsers[userId];
        io.emit("userStatus", { userId, online: false });
      }
      console.log("dis-conntected", onlineUsers);
    });

    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
    });

    socket.on("getConversations", async (userId) => {
      try {
        const conversations = await Conversation.find({
          participants: userId,
        }).populate("lastMessage");
        socket.emit("conversationsList", conversations);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    });
    socket.on("getMessages", async (conversationId) => {
      try {
        const messages = await Chat.find({ conversationId });
        socket.emit("messagesList", messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    });

    socket.on("sendMessage", async (data) => {
      const { conversationId, senderId, senderType, message } = data;
      const chatMessage = new Chat({
        conversationId,
        senderId,
        senderType,
        message,
      });
      try {
        console.log(data);
        await chatMessage.save();
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: chatMessage._id,
          lastMessageTime: chatMessage.timestamp,
        });
        io.to(conversationId).emit("receiveMessage", chatMessage);
        io.emit("userStatus", { userId: senderId, online: true });
      } catch (error) {
        console.error("Error saving message to database:", error);
      }
    });
    socket.on("sendMessageAdmin", async (data) => {
      const { conversationId, senderId, senderType, message } = data;
      const chatMessage = new AdminChat({
        conversationId,
        senderId,
        senderType,
        message,
      });
      try {
        await chatMessage.save();
        await AdminConversation.findByIdAndUpdate(conversationId, {
          lastMessage: chatMessage._id,
          lastMessageTime: chatMessage.timestamp,
        });
        io.to(conversationId).emit("receiveMessage", chatMessage);
      } catch (error) {
        console.error("Error saving message to database:", error);
      }
    });

    socket.on("disconnect", () => {});
  });
};
