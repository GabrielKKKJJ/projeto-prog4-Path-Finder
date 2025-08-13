const waypointService = require('../services/waypointService');

module.exports = {
  createWaypoint: async (req, res, next) => {
    try {
      const waypoint = await waypointService.createWaypoint(req.body);
      res.status(201).json(waypoint);
    } catch (err) {
      next(err);
    }
  },
  getWaypoint: async (req, res, next) => {
    try {
      const waypoint = await waypointService.getWaypoint(req.params.id);
      if (!waypoint) return res.status(404).json({ error: 'Waypoint not found' });
      res.json(waypoint);
    } catch (err) {
      next(err);
    }
  },
  updateWaypoint: async (req, res, next) => {
    try {
      const waypoint = await waypointService.updateWaypoint(req.params.id, req.body);
      if (!waypoint) return res.status(404).json({ error: 'Waypoint not found' });
      res.json(waypoint);
    } catch (err) {
      next(err);
    }
  },
  deleteWaypoint: async (req, res, next) => {
    try {
      const deleted = await waypointService.deleteWaypoint(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Waypoint not found' });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
};
