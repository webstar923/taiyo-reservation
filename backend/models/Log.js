const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Log = sequelize.define('Log', {
  level: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  readStatus: {
    type: DataTypes.STRING,
    defaultValue: 'unread', 
    allowNull: false,
  },
  request_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  endpoint: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  method: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
    },
  { 
    timestamps: false,
  });;

module.exports = Log;
