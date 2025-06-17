const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Work = sequelize.define('work', {
  work_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  flat_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  room_num: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
  },
  hose_length: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  required_tools: {
    type: DataTypes.STRING(250),
    allowNull: true,
  },
  team_size: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  work_duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  key_management: {
    type: DataTypes.ENUM('事前用意', '弊社管理'),
    allowNull: true,
  },
  notes: {
    type: DataTypes.STRING(250),
    allowNull: true,
  },
  hose_placement: {
    type: DataTypes.STRING(250),
    allowNull: true,
  },
  checkbox_list: {
    type: DataTypes.STRING(250),
    allowNull: true,
  },
}, {
  timestamps: false,
  underscored: true, 
});
module.exports = Work;