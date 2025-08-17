const Map = require('./Map');
const Obstacle = require('./Obstacle');
const Waypoint = require('./Waypoint');
const Route = require('./Route');
const User = require('./User');

// Defina as associações aqui, se necessário
// Exemplo:
// Map.hasMany(Obstacle, { foreignKey: 'mapId' });
// Map.hasMany(Waypoint, { foreignKey: 'mapId' });
// Map.hasMany(Route, { foreignKey: 'mapId' });

module.exports = {
  Map,
  Obstacle,
  Waypoint,
  Route,
  User
};
