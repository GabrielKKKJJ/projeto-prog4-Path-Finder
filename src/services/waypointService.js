const Waypoint = require('../models/Waypoint');

const toWaypointOutput = (waypoint) => ({
  id: waypoint.id,
  mapId: waypoint.mapId,
  position: {
    x: waypoint.positionX,
    y: waypoint.positionY
  },
  name: waypoint.name
});

const createWaypoint = async ({ mapId, position, name }) => {
  const waypoint = await Waypoint.create({
    mapId,
    positionX: position.x,
    positionY: position.y,
    name
  });
  return toWaypointOutput(waypoint);
};

const getWaypoint = async (id) => {
  const waypoint = await Waypoint.findByPk(id);
  if (!waypoint) return null;
  return toWaypointOutput(waypoint);
};

const updateWaypoint = async (id, { position, name }) => {
  const waypoint = await Waypoint.findByPk(id);
  if (!waypoint) return null;
  if (position) {
    waypoint.positionX = position.x;
    waypoint.positionY = position.y;
  }
  if (name !== undefined) waypoint.name = name;
  await waypoint.save();
  return toWaypointOutput(waypoint);
};

const deleteWaypoint = async (id) => {
  const waypoint = await Waypoint.findByPk(id);
  if (!waypoint) return false;
  await waypoint.destroy();
  return true;
};

module.exports = {
  createWaypoint,
  getWaypoint,
  updateWaypoint,
  deleteWaypoint
};
