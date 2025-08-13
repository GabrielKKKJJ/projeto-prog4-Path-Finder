const express = require('express');
const obstacleController = require('../controllers/obstacleController');
const router = express.Router();

router.post('/', obstacleController.createObstacle);
router.get('/:id', obstacleController.getObstacle);
router.put('/:id', obstacleController.updateObstacle);
router.delete('/:id', obstacleController.deleteObstacle);

module.exports = router;
