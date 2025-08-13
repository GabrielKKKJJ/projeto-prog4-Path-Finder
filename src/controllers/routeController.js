const routeService = require('../services/routeService');

module.exports = {
  createRoute: async (req, res, next) => {
    try {
      const route = await routeService.createRoute(req.body);
      res.status(201).json(route);
    } catch (err) {
      next(err);
    }
  },
  getRoute: async (req, res, next) => {
    try {
      const route = await routeService.getRoute(req.params.id);
      if (!route) return res.status(404).json({ error: 'Route not found' });
      res.json(route);
    } catch (err) {
      next(err);
    }
  },
  deleteRoute: async (req, res, next) => {
    try {
      const deleted = await routeService.deleteRoute(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Route not found' });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
};
