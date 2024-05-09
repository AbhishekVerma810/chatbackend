const { normalize } = require('path');
const { chat, oneToOnChat, group, GroupChats, groupUsers, userData } = require('../models')
const { Op, where } = require('sequelize'); // Import the Op object from Sequelize
const { time } = require('console');
const { title } = require('process');
const { response } = require('..');
const tokenArray = [];
exports.storeMessage = async (req, res, next) => {
  try {
    console.log('bhai code yaha pr h')
    const { message, audio, file, images, reciverId, senderID, sender } = req.body;
    console.log('message,audio,file,images,receiverId,senderID,sender=>', message, audio, file, images, reciverId, senderID, sender)
    const newChat = await chat.create({
      message: message,
      audio: audio,
      file: file,
      images: images,
      receiverId: reciverId,
      senderId: senderID
    });
    const oneToOneRecord = await oneToOnChat.create({
      chatId: newChat.id,
      senderId: senderID,
      reciverID: reciverId,
      sender: sender
    });
    return res.json('sucessfully')
  } catch (error) {
    console.error('Error saving or emitting message:', error);
  }
}


exports.createGroup = async (req, res, next) => {
  try {

    const { groupName, creatorId, userId } = req.body;
    console.log('heloo000000 abhi',)
    const groupData = await group.create({ creatorId, groupName });
    const groupId = groupData.id;
    const groupUserss = userId.length > 0 ? userId.map(userId => ({ userId: userId.id, groupId })) : [];
    console.log('groupUsers==>', groupUserss)
    await groupUsers.bulkCreate(groupUserss);
    return res.status(201).json({ groupData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
exports.getGroups = async (req, res, next) => {
  try {
    const userId = req.params.id;
    // const userId = '4';
    console.log('hello abhi how are you', userId)
    const groupsdata = await groupUsers.findAll({ where: { userId } });
    console.log('hello abhi how are you', groupsdata)
    const groupIds = groupsdata.map(group => group.dataValues.groupId);

    const data = await groupUsers.findAll({
      where: { userId },
      include: [
        {
          model: group,
          where: { id: groupIds },
          attributes: ['id', 'groupName', 'creatorId']
        },
        {
          model: userData,
          where: { id: userId },
          attributes: ['id', 'name', 'last_seen', 'online_status', 'profile_picture', 'contact_number']
        }
      ],
    });
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
exports.getGroupMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log('Received', id);
    const messages = await GroupChats.findAll({
      where: { group_id: id },
      include: [{ model: chat, as: 'chat' }],
      order: [['createdAt', 'ASC']],
    });
    console.log('messages===>', messages);
    res.json(messages);
  } catch (error) {
    console.error('Error getting chat messages:', error);
    res.status(500).json({ error: 'Error getting chat messages' });
  }
};
exports.getMessage = async (req, res, next) => {
  const { senderId, reciverID } = req.query;
  console.log('Received query params:', { senderId, reciverID });
  try {
    const messages = await oneToOnChat.findAll({
      where: {
        [Op.or]: [
          { senderId, reciverID },
          { senderId: reciverID, reciverID: senderId },
        ],
      },
      include: [{ model: chat, as: 'chat' }],
      attributes: ['id', 'message_seen', 'reciverID', 'senderId'],
      order: [['createdAt', 'ASC']],
    });

    res.json(messages);
  } catch (error) {
    console.error('Error getting chat messages:', error);
    res.status(500).json({ error: 'Error getting chat messages' });
  }
};

exports.updateMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message, date, audio, file, images } = req.body;
    const chatMessage = await ChatMessage.findByPk(id);
    if (!chatMessage) {
      return res.status(404).json({ error: 'Chat message not found' });
    }
    chatMessage.message = message;
    chatMessage.date = date;
    chatMessage.audio = audio;
    chatMessage.file = file;
    chatMessage.images = images;
    await chatMessage.save();
    res.status(200).json(chatMessage);
  } catch (err) {
    next(err);
  }
};
exports.deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const chatMessage = await ChatMessage.findByPk(id);
    if (!chatMessage) {
      return res.status(404).json({ error: 'Chat message not found' });
    }
    await chatMessage.destroy();
    return res.status(200).json({ success: 'Message deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
exports.sendMessage = async (req, res, next) => {
  try {
    if (!tokenArray.length) {
      return res.status(200).json({});
    }
    const message = {
      Notification: {
        title: "Your Notification Title",
        body: 'You notification body',
      },
      token: tokenArray(),
    };
    admin.messaging().send(message).then(res => {
      console.log("successfully sent message", response);
      return res.status(200).json({ msg: "send token" });
    })
  }
  catch (err) {
    console.log("successfully sent  message ", response);
    return res.status(400).json({ error });
  }
}
exports.submitToken = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }
    tokenArray.push(token);
    return res.json({ msg: "Token recieved successfully" });

  } catch (err) {
    console.log('helo', err)
    return res.json({ err: "Token not recieved successfully" });
  }
}
exports.storeGroupMessage = async (req, res, next) => {
  try {
    const { message, audio, file, images, receiverId, senderId, group_id } = req.body;
    console.log('message, audio, file, images, receiverId, senderId, group_id =>', message, audio, file, images, receiverId, senderId, group_id);

    const newChat = await chat.create({
      message: message,
      audio: audio,
      file: file,
      images: images,
      receiverId: receiverId,
      senderId: senderId
    });
  console.log('haabhi',newChat)
    const oneToOneRecord = await GroupChats.create({
      chatId: newChat.id,
      senderId: senderId,
      group_id: group_id
    });

    return res.status(201).json({ success: true, message: 'Group message stored successfully' });
  } catch (err) {
    console.error('Error storing group message:', err);
    return res.status(400).json({ error: err.message });
  }
};


