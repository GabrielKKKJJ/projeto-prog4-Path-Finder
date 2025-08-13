const mapService = require('../services/mapService');

module.exports = {
  createMap: async (req, res, next) => {
    try {
      const map = await mapService.createMap(req.body);
      res.status(201).json(map);
    } catch (err) {
      next(err);
    }
  },
  getMap: async (req, res, next) => {
    try {
      const map = await mapService.getMap(req.params.id);
      if (!map) return res.status(404).json({ error: 'Map not found' });
      res.json(map);
    } catch (err) {
      next(err);
    }
  },
  updateMap: async (req, res, next) => {
    try {
      const map = await mapService.updateMap(req.params.id, req.body);
      if (!map) return res.status(404).json({ error: 'Map not found' });
      res.json(map);
    } catch (err) {
      next(err);
    }
  },
  deleteMap: async (req, res, next) => {
    try {
      const deleted = await mapService.deleteMap(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Map not found' });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
};
