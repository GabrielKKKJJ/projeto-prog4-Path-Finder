const express = require('express');
const mapController = require('../controllers/mapController');
const router = express.Router();

router.post('/', mapController.createMap);
router.get('/:id', mapController.getMap);
router.put('/:id', mapController.updateMap);
router.delete('/:id', mapController.deleteMap);

module.exports = router;
