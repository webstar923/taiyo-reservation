const { Sequelize,DataTypes } = require('sequelize');
require('dotenv').config();
const DB_NAME = process.env.DB_NAME || "taiyo_db";
const DB_USER = process.env.DB_USER || "root";
const DB_PASS = process.env.DB_PASS || "";

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: '127.0.0.1',
  port:3306,
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
