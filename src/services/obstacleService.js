const Obstacle = require('../models/Obstacle');
const Map = require('../models/Map');

const toObstacleOutput = (obstacle) => ({
  id: obstacle.id,
  mapId: obstacle.mapId,
  position: {
    x: obstacle.positionX,
    y: obstacle.positionY
  },
  size: obstacle.size
});

const createObstacle = async ({ mapId, position, size }) => {
  const obstacle = await Obstacle.create({
    mapId,
    positionX: position.x,
    positionY: position.y,
    size
  });
  return toObstacleOutput(obstacle);
};

const getObstacle = async (id) => {
  const obstacle = await Obstacle.findByPk(id);
  if (!obstacle) return null;
  return toObstacleOutput(obstacle);
};

const updateObstacle = async (id, { position, size }) => {
  const obstacle = await Obstacle.findByPk(id);
  if (!obstacle) return null;
  if (position) {
    obstacle.positionX = position.x;
    obstacle.positionY = position.y;
  }
  if (size !== undefined) obstacle.size = size;
  await obstacle.save();
  return toObstacleOutput(obstacle);
};

const deleteObstacle = async (id) => {
  const obstacle = await Obstacle.findByPk(id);
  if (!obstacle) return false;
  await obstacle.destroy();
  return true;
};

module.exports = {
  createObstacle,
  getObstacle,
  updateObstacle,
  deleteObstacle
};
