const { chat, oneToOnChat } = require('../models');
const { Server } = require("socket.io");
const { Op } = require('sequelize');

function createSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:8101', 'http://localhost:8100', 'http://localhost:8102', 'http://localhost:8103'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });
  
  io.on('connection', (socket) => {
    socket.on('join', (data) => {
      console.log('HELLO neeraj',data)
      if(data.groupId){
        const roomId = `room-${data.groupId}`;
        console.log('joined group room:', roomId);
        socket.join(roomId);
      }
      else{
         const roomId =`room-${data.senderID}-${data.reciverId}`;
         console.log('joined room:', roomId);
         socket.join(roomId);
      }
  
    });
    socket.on('chat_message', async (msg) => {
      try {
        const roomId = `room-${msg.reciverId}-${msg.senderID}`;
        const messageToSend = { ...msg };
        console.log('bhai code yaha pr h', messageToSend)
        io.to(roomId).emit('chat_message', messageToSend);
        console.log('Message saved:', messageToSend);
      } catch (error) {
        console.error('Error saving or emitting message:', error);
      }
    });
    socket.on('group_message', async (data) => {
      try {
        console.log('hello abhi abhi verma',data)
        const { groupId, userId, message } = data;

        const roomId = `room-${groupId}`;
        console.log('hello group message',roomId)
        io.to(roomId).emit('group_message', data);
      } catch (error) {
        console.error(error);
      }
    });
  });
}
module.exports = { createSocketServer };