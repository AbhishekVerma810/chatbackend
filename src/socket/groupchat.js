const { chat, GroupChats } = require('../models'); 
const { Server } = require("socket.io");
const { Op } = require('sequelize'); 

function createGroupSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:8101', 'http://localhost:8100', 'http://localhost:8102', 'http://localhost:8103'],
      methods: ['GET', 'POST'],
      credentials: true
     }
  });
//   io.on('connection', (socket) => {
   
//     console.log('hello groupid');
//     socket.on('joinGroup', (groupId) => {
//      console.log('hello groupid',groupId)
//       socket.join(groupId); 
//       console.log('hello groupid2',groupId)
//       console.log('hello abhi you joined group')

//       console.log(`Socket ${socket.id} joined group ${groupId}`);
//     });
io.on('connection', (socket) => {
    socket.on('joinGroup', (data) =>{
    console.log('joined room:',data);
      const roomId = `room-${data.groupId}`;
      console.log('joined room:', roomId);
      socket.join(roomId);
  });
    socket.on('group_message', async (data) => {
      try {
        console.log('hello abhi abhi verma',data)
        const { groupId, userId, message } = data;
        const newChat = await chat.create({
          message: data.message,
          audio: data.audio,
          file: data.file,
          images: data.images,
          receiverId: data.receiverId,
          senderId: data.senderId
        });
        const oneToOneRecord = await GroupChats.create({
          chatId: newChat.id,
          senderId: data.senderID,
          group_id: data.group_id,
        });
        const roomId = `room-${data.groupId}`;
        io.to(roomId).emit('message', data);
      } catch (error) {
        console.error(error);
      }
    });
  
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
}
module.exports = { createGroupSocketServer };