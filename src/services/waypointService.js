const Waypoint = require('../models/Waypoint');
const { validateWaypointCreation, validateWaypointUpdate } = require('../validators/waypointValidator');
const { toWaypointOutput, toWaypointInput } = require('../transformers/waypointTransformer');

class WaypointService {
  static async createWaypoint(waypointData) {
    await validateWaypointCreation(waypointData);
    
    const dbWaypoint = await Waypoint.create({
      ...toWaypointInput(waypointData),
      mapId: waypointData.mapId,
      name: waypointData.name
    });
    
    return toWaypointOutput(dbWaypoint);
  }

  static async getWaypoint(id) {
    const waypoint = await Waypoint.findByPk(id);
    if (!waypoint) return null;
    return toWaypointOutput(waypoint);
  }

  static async updateWaypoint(id, updateData) {
    await validateWaypointUpdate(id, updateData);
    
    const waypoint = await Waypoint.findByPk(id);
    if (!waypoint) return null;
    
    const updates = toWaypointInput(updateData);
    await waypoint.update(updates);
    
    return toWaypointOutput(waypoint);
  }

  static async deleteWaypoint(id) {
    const waypoint = await Waypoint.findByPk(id);
    if (!waypoint) return false;
    
    await waypoint.destroy();
    return true;
  }
}

module.exports = WaypointService;
