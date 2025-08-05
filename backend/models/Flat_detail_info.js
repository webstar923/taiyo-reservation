const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Flat = require('./Flat');

const FlatDetailInfo = sequelize.define('FlatDetailInfo', {
  parking_location: {
    type: DataTypes.STRING(250),
    allowNull: true,
  },
  machine_location: {
    type: DataTypes.STRING(250),
    allowNull: true,
  },
  water_tap_location: {
    type: DataTypes.STRING(250),
    allowNull: true,
  },
  building_structure: {
    type: DataTypes.ENUM('横移動可', '横移動不可'),
    allowNull: true,
  },
  auto_lock_number: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  key_box_exists: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  key_box_location: {
    type: DataTypes.STRING(250),
    allowNull: true,
  },
  manager_work_days: {
    type: DataTypes.STRING(250),
    allowNull: true,
  },
  start_time: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  end_time: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tel_number: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fax_number: {
    type: DataTypes.STRING(250),
    allowNull: true,
  },
  flat_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Flat,
      key: 'id',
    },
    onDelete: 'CASCADE', // ✅ Ensures related FlatDetailInfo is deleted when Flat is deleted
  },
}, {
  timestamps: false,
  tableName: 'flat_detail_info',
});

// ✅ Define associations
Flat.hasOne(FlatDetailInfo, {
  foreignKey: 'flat_id',
  as: 'detailInfo',
  onDelete: 'CASCADE', // ✅ Ensures correct behavior in Sequelize
});

FlatDetailInfo.belongsTo(Flat, {
  foreignKey: 'flat_id',
  as: 'flat',
});

module.exports = FlatDetailInfo;
