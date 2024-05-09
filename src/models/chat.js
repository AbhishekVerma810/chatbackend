'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // chat.belongsTo(models.oneToOnChat, { foreignKey: 'chatId' });
    }
  }
  chat.init({
    message: DataTypes.STRING,
    file: DataTypes.STRING,
    images: DataTypes.TEXT,
    audio: DataTypes.STRING,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'chat',
  });
  return chat;
};