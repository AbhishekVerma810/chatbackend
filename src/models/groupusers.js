'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class groupUsers extends Model {
    static associate(models) {
      groupUsers.belongsTo(models.userData, { foreignKey: 'userId' });
      groupUsers.belongsTo(models.group, { foreignKey: 'groupId' });
    }
  }

  groupUsers.init(
    {
      userId: DataTypes.STRING,
      groupId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'groupUsers',
    }
  );

  return groupUsers;
};