'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class oneToOnChat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      oneToOnChat.belongsTo(models.chat, { foreignKey: 'chatId' });
    }
  }
  oneToOnChat.init({
    senderId: DataTypes.INTEGER,
    reciverID: DataTypes.INTEGER,
    chatId: DataTypes.INTEGER,
    message_seen: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'oneToOnChat',
  });
  return oneToOnChat;
};