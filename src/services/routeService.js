const Route = require('../models/Route');

const toRouteOutput = (route) => ({
  id: route.id,
  mapId: route.mapId,
  start: { x: route.startX, y: route.startY },
  end: { x: route.endX, y: route.endY },
  distance: route.distance
});

const createRoute = async ({ mapId, start, end, distance }) => {
  const route = await Route.create({
    mapId,
    startX: start.x,
    startY: start.y,
    endX: end.x,
    endY: end.y,
    distance
  });
  return toRouteOutput(route);
};

const getRoute = async (id) => {
  const route = await Route.findByPk(id);
  if (!route) return null;
  return toRouteOutput(route);
};

const deleteRoute = async (id) => {
  const route = await Route.findByPk(id);
  if (!route) return false;
  await route.destroy();
  return true;
};

module.exports = {
  createRoute,
  getRoute,
  deleteRoute
};
