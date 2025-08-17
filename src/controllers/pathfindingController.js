const pathfindingService = require('../services/pathfindingService');
const Map = require('../models/Map');
const Obstacle = require('../models/Obstacle');
const Waypoint = require('../models/Waypoint');

/**
 * Controlador para operações relacionadas a busca de caminhos
 */
const pathfindingController = {
  /**
   * Encontra o melhor caminho entre dois pontos em um mapa, considerando obstáculos e waypoints
   * @param {Object} req - Requisição HTTP
   * @param {Object} res - Resposta HTTP
   */
  findPath: async (req, res, next) => {
    try {
      const { mapId, start, end, waypointIds = [] } = req.body;

      // Validação dos parâmetros
      if (!mapId || !start || !end || !start.x || !start.y || !end.x || !end.y) {
        return res.status(400).json({ 
          error: 'mapId, start (with x,y) and end (with x,y) are required' 
        });
      }

      // Busca o mapa e verifica se existe
      const map = await Map.findByPk(mapId);
      if (!map) {
        return res.status(404).json({ error: 'Map not found' });
      }

      // Busca os obstáculos do mapa
      const obstacles = await Obstacle.findAll({ 
        where: { mapId },
        raw: true
      });

      // Busca os waypoints, se houver
      let waypoints = [];
      if (waypointIds && waypointIds.length > 0) {
        waypoints = await Waypoint.findAll({
          where: { 
            id: waypointIds,
            mapId
          },
          raw: true
        });
      }

      // Converte os waypoints para o formato esperado
      const waypointPositions = waypoints.map(wp => ({
        x: wp.positionX,
        y: wp.positionY
      }));

      // Converte os obstáculos para o formato esperado
      const formattedObstacles = obstacles.map(obs => ({
        position: { x: obs.positionX, y: obs.positionY },
        size: obs.size
      }));

      // Encontra o caminho
      const result = await pathfindingService.findPath(
        { width: map.width, height: map.height },
        start,
        end,
        formattedObstacles,
        waypointPositions
      );

      res.json({
        success: true,
        path: result.path,
        distance: result.distance,
        waypointsOrder: waypointPositions.map(wp => ({
          x: wp.x,
          y: wp.y,
          name: waypoints.find(w => w.positionX === wp.x && w.positionY === wp.y)?.name || 'Unnamed'
        }))
      });
    } catch (error) {
      console.error('Error finding path:', error);
      res.status(500).json({ 
        success: false,
        error: error.message || 'Error finding path'
      });
    }
  },

  /**
   * Valida se um caminho é válido (não passa por obstáculos)
   * @param {Object} req - Requisição HTTP
   * @param {Object} res - Resposta HTTP
   */
  validatePath: async (req, res, next) => {
    try {
      const { mapId, path } = req.body;

      // Validação dos parâmetros
      if (!mapId || !path || !Array.isArray(path) || path.length < 2) {
        return res.status(400).json({ 
          error: 'mapId and a valid path (array with at least 2 points) are required' 
        });
      }

      // Busca o mapa e verifica se existe
      const map = await Map.findByPk(mapId);
      if (!map) {
        return res.status(404).json({ error: 'Map not found' });
      }

      // Busca os obstáculos do mapa
      const obstacles = await Obstacle.findAll({ 
        where: { mapId },
        raw: true
      });

      // Converte os obstáculos para o formato esperado
      const formattedObstacles = obstacles.map(obs => ({
        position: { x: obs.positionX, y: obs.positionY },
        size: obs.size
      }));

      // Valida cada segmento do caminho
      let isValid = true;
      let invalidSegment = null;

      for (let i = 0; i < path.length - 1; i++) {
        const start = path[i];
        const end = path[i + 1];

        // Verifica se os pontos estão dentro dos limites do mapa
        if (!pathfindingService.isWithinBounds(start, map.width, map.height) ||
            !pathfindingService.isWithinBounds(end, map.width, map.height)) {
          isValid = false;
          invalidSegment = { from: start, to: end, reason: 'Out of map bounds' };
          break;
        }

        // Verifica se o caminho entre os pontos é válido (sem obstáculos)
        const isClear = pathfindingService.isPathClear(start, end, formattedObstacles);
        if (!isClear) {
          isValid = false;
          invalidSegment = { from: start, to: end, reason: 'Path intersects with an obstacle' };
          break;
        }
      }

      res.json({
        isValid,
        ...(!isValid && { invalidSegment }),
        pathLength: path.length
      });
    } catch (error) {
      console.error('Error validating path:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error validating path'
      });
    }
  }
};

module.exports = pathfindingController;
