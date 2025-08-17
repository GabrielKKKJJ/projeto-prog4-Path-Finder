const toWaypointOutput = (waypoint) => ({
  id: waypoint.id,
  mapId: waypoint.mapId,
  position: {
    x: waypoint.positionX,
    y: waypoint.positionY
  },
  name: waypoint.name
});

const toWaypointInput = ({ position, ...rest }) => ({
  ...rest,
  positionX: position?.x,
  positionY: position?.y
});

module.exports = {
  toWaypointOutput,
  toWaypointInput
};
