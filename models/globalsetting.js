'use strict';
module.exports = function(sequelize, DataTypes) {
  var GlobalSetting = sequelize.define('GlobalSetting', {
    title: DataTypes.STRING,
    value: DataTypes.STRING
  });

  return GlobalSetting;
};