const express = require('express');
const mapRoutes = require('./mapRoutes');
const obstacleRoutes = require('./obstacleRoutes');
const waypointRoutes = require('./waypointRoutes');
const routeRoutes = require('./routeRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

router.use('/maps', mapRoutes);
router.use('/obstacles', obstacleRoutes);
router.use('/waypoints', waypointRoutes);
router.use('/routes', routeRoutes);
router.use('/users', userRoutes);

module.exports = router;
