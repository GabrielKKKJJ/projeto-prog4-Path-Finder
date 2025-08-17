const { Map } = require('../models');

const validateWaypointCreation = async ({ mapId, position, name }) => {
  if (!mapId) throw new Error('Map ID is required');
  if (!position) throw new Error('Position is required');
  if (!position.x && position.x !== 0) throw new Error('Position X coordinate is required');
  if (!position.y && position.y !== 0) throw new Error('Position Y coordinate is required');
  if (!name) throw new Error('Name is required');
  
  const map = await Map.findByPk(mapId);
  if (!map) throw new Error('Map not found');
  
  if (position.x < 0 || position.x > map.width) {
    throw new Error(`X coordinate must be between 0 and ${map.width}`);
  }
  if (position.y < 0 || position.y > map.height) {
    throw new Error(`Y coordinate must be between 0 and ${map.height}`);
  }
};

const validateWaypointUpdate = async (id, { position, name }) => {
  if (!id) throw new Error('Waypoint ID is required');
  if (position && (position.x === undefined || position.y === undefined)) {
    throw new Error('Both X and Y coordinates must be provided for position');
  }
};

module.exports = {
  validateWaypointCreation,
  validateWaypointUpdate
};
