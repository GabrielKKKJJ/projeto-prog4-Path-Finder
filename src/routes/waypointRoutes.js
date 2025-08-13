const express = require('express');
const waypointController = require('../controllers/waypointController');
const router = express.Router();

router.post('/', waypointController.createWaypoint);
router.get('/:id', waypointController.getWaypoint);
router.put('/:id', waypointController.updateWaypoint);
router.delete('/:id', waypointController.deleteWaypoint);

module.exports = router;
