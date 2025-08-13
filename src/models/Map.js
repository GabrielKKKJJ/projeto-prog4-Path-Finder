const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Map = sequelize.define('Map', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  width: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'maps',
  timestamps: false
});

module.exports = Map;
