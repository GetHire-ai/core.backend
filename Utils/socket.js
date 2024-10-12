const socketIo = require("socket.io");
const Chat = require("../Model/ChatModel");
const Conversation = require("../Model/ConversationModel");
const AdminChat = require("../Model/AdminChatModel");
const AdminConversation = require("../Model/AdminConversationModel");
const CompanyModel = require("../Model/CompanyModel");
const StudentModel = require("../Model/StudentModel");
let onlineUsers = [];

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
      if (!onlineUsers.some((user) => user.userId === userId)) {
        onlineUsers.push({ userId, socketId: socket.id });
        io.emit("userStatus", { userId, online: true });
      }
      console.log("connected", onlineUsers);
    });

    socket.on("userDisconnected", () => {
      const userIndex = onlineUsers.findIndex(
        (user) => user.socketId === socket.id
      );
      if (userIndex !== -1) {
        const [removedUser] = onlineUsers.splice(userIndex, 1);
        io.emit("userStatus", { userId: removedUser.userId, online: false });
      }
      console.log("disconnected", onlineUsers);
    });

    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
    });

    socket.on("getConversations", async (userId) => {
      try {
        const conversations = await Conversation.find({
          participants: userId,
        }).populate({
          path: "lastMessage",
          populate: [{ path: "senderId", model: "Student" }],
        });

        const updatedConversations = await Promise.all(
          conversations.map(async (conversation) => {
            const participantDetails = {
              company: null,
              student: null,
            };

            await Promise.all(
              conversation?.participants?.map(async (participantId) => {
                let student = await StudentModel.findById(participantId);
                if (student) {
                  participantDetails.student = student;
                }
                let company = await CompanyModel.findById(participantId);
                if (company) {
                  participantDetails.company = company;
                }
              })
            );

            const conversationCopy = {
              ...conversation.toObject(),
              participantDetails,
            };
            return conversationCopy;
          })
        );
        socket.emit("conversationsList", updatedConversations);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    });

    socket.on("getConversationMessages", async (conversationId) => {
      try {
        const messages = await Chat.find({ conversationId });
        socket.emit("conversationMessages", messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    });

    socket.on("sendMessage", async (data) => {
      const { conversationId, senderId, senderType, message } = data;
      const chatMessage = new Chat(data);

      try {
        const saved = await chatMessage.save();
        const conversation = await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: chatMessage._id,
          lastMessageTime: chatMessage.timestamp,
        }, { new: true });
        if (conversation && saved) {
          io.to(conversationId).emit("receiveMessage", chatMessage, conversation);
          io.emit("userStatus", { userId: senderId, online: true });
        }
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

    socket.on("disconnect", () => {
      const userIndex = onlineUsers.findIndex(
        (user) => user.socketId === socket.id
      );
      if (userIndex !== -1) {
        const [removedUser] = onlineUsers.splice(userIndex, 1);
        io.emit("userStatus", { userId: removedUser.userId, online: false });
      }
      console.log("disconnected", onlineUsers);
    });
  });
};
