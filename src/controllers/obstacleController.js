const obstacleService = require('../services/obstacleService');

module.exports = {
  createObstacle: async (req, res, next) => {
    try {
      const obstacle = await obstacleService.createObstacle(req.body);
      res.status(201).json(obstacle);
    } catch (err) {
      next(err);
    }
  },
  getObstacle: async (req, res, next) => {
    try {
      const obstacle = await obstacleService.getObstacle(req.params.id);
      if (!obstacle) return res.status(404).json({ error: 'Obstacle not found' });
      res.json(obstacle);
    } catch (err) {
      next(err);
    }
  },
  updateObstacle: async (req, res, next) => {
    try {
      const obstacle = await obstacleService.updateObstacle(req.params.id, req.body);
      if (!obstacle) return res.status(404).json({ error: 'Obstacle not found' });
      res.json(obstacle);
    } catch (err) {
      next(err);
    }
  },
  deleteObstacle: async (req, res, next) => {
    try {
      const deleted = await obstacleService.deleteObstacle(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Obstacle not found' });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
};
