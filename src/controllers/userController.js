const userService = require('../services/userService');

module.exports = {
  createUser: async (req, res, next) => {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  },
  getUser: async (req, res, next) => {
    try {
      const user = await userService.getUser(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      next(err);
    }
  },
  updateUser: async (req, res, next) => {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      next(err);
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      const deleted = await userService.deleteUser(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'User not found' });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
};
