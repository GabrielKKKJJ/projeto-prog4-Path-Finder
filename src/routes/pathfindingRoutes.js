const express = require('express');
const pathfindingController = require('../controllers/pathfindingController');
const router = express.Router();

/**
 * @swagger
 * /api/pathfinding/find:
 *   post:
 *     summary: Encontra o melhor caminho entre dois pontos em um mapa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mapId
 *               - start
 *               - end
 *             properties:
 *               mapId:
 *                 type: integer
 *                 description: ID do mapa
 *               start:
 *                 type: object
 *                 properties:
 *                   x:
 *                     type: integer
 *                   y:
 *                     type: integer
 *                 description: Ponto de partida {x, y}
 *               end:
 *                 type: object
 *                 properties:
 *                   x:
 *                     type: integer
 *                   y:
 *                     type: integer
 *                 description: Ponto de destino {x, y}
 *               waypointIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: IDs dos waypoints pelos quais o caminho deve passar
 *     responses:
 *       200:
 *         description: Caminho encontrado com sucesso
 *       400:
 *         description: Parâmetros inválidos
 *       404:
 *         description: Mapa não encontrado
 *       500:
 *         description: Erro ao buscar caminho
 */
router.post('/find', pathfindingController.findPath);

/**
 * @swagger
 * /api/pathfinding/validate:
 *   post:
 *     summary: Valida se um caminho é válido (não passa por obstáculos)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mapId
 *               - path
 *             properties:
 *               mapId:
 *                 type: integer
 *                 description: ID do mapa
 *               path:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     x:
 *                       type: integer
 *                     y:
 *                       type: integer
 *                 description: Array de pontos {x, y} que formam o caminho
 *     responses:
 *       200:
 *         description: Validação concluída com sucesso
 *       400:
 *         description: Parâmetros inválidos
 *       404:
 *         description: Mapa não encontrado
 *       500:
 *         description: Erro ao validar caminho
 */
router.post('/validate', pathfindingController.validatePath);

module.exports = router;
