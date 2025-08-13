const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Map = require('./Map');

const Route = sequelize.define('Route', {
  startX: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  startY: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  endX: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  endY: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  distance: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'routes',
  timestamps: false
});

Route.belongsTo(Map, { foreignKey: 'mapId', onDelete: 'CASCADE' });
Map.hasMany(Route, { foreignKey: 'mapId' });

module.exports = Route;
