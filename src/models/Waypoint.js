const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Map = require('./Map');

const Waypoint = sequelize.define('Waypoint', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  positionX: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  positionY: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'waypoints',
  timestamps: false
});

Waypoint.belongsTo(Map, { foreignKey: 'mapId', onDelete: 'CASCADE' });
Map.hasMany(Waypoint, { foreignKey: 'mapId' });

module.exports = Waypoint;
