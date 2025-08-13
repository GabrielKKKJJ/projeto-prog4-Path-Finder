const express = require('express');
const routeController = require('../controllers/routeController');
const router = express.Router();

router.post('/', routeController.createRoute);
router.get('/:id', routeController.getRoute);
router.delete('/:id', routeController.deleteRoute);

module.exports = router;
