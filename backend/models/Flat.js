const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Flat = sequelize.define('Flat', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  timestamps: false,
  tableName: 'Flats',
});

module.exports = Flat;
