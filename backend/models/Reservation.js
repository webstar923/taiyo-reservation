const { DataTypes, TIME, ENUM } = require('sequelize');
const sequelize = require('./index');

const Reservation = sequelize.define('Reservation', {
  flat_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  room_num:{
    type:DataTypes.INTEGER,
  },
  work_name:{
    type:DataTypes.STRING,
  },
  reservation_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  division:{
    type:DataTypes.STRING,
    allowNull: false,
    defaultValue:"morning"
  },},
  { 
    timestamps: false,
  });;

module.exports = Reservation;
