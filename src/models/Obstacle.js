const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Map = require('./Map');

const Obstacle = sequelize.define('Obstacle', {
  positionX: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  positionY: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'obstacles',
  timestamps: false
});

Obstacle.belongsTo(Map, { foreignKey: 'mapId', onDelete: 'CASCADE' });
Map.hasMany(Obstacle, { foreignKey: 'mapId' });

module.exports = Obstacle;
