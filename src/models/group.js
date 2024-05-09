'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class group extends Model {
    static associate(models) {
      // group.belongsTo(models.groupUsers, { foreignKey: 'creatorId' });
    }
  }
  group.init({
    groupName: DataTypes.STRING,
    creatorId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'group',
  });
  return group;
};