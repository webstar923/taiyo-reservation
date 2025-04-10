const { DataTypes, TIME } = require('sequelize');
const sequelize = require('./index');
const bcrypt = require('bcryptjs');

const Work = sequelize.define('Work', {
  work_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  flat_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  room_num: {
    type: DataTypes.NUMBER,
    allowNull: false,
    unique: false,
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },},
  { 
    timestamps: false,
  });;

module.exports = Work;
