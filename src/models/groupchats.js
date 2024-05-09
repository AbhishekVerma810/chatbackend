'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupChats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GroupChats.belongsTo(models.chat, { foreignKey: 'chatId' });
    }
  }
  GroupChats.init({
    group_id: DataTypes.STRING,
    senderId: DataTypes.STRING,
    chatId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'GroupChats',
  });
  return GroupChats;
};