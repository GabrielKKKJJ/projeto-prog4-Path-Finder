const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /test/cache:
 *   get:
 *     summary: Rota de teste para o middleware de cache
 *     description: Retorna um timestamp atual para testar o funcionamento do cache
 *     tags: [Test]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nome opcional para personalizar a resposta
 *     responses:
 *       200:
 *         description: Retorna o timestamp atual e informações de cache
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp atual do servidor
 *                 message:
 *                   type: string
 *                   description: Mensagem de resposta
 *                 cacheInfo:
 *                   type: string
 *                   description: Informações sobre o cache
 */
router.get('/cache', (req, res) => {
  const response = {
    timestamp: new Date().toISOString(),
    message: `Olá${req.query.name ? `, ${req.query.name}` : ''}! Esta resposta está em cache.`,
    cacheInfo: 'Esta resposta deve ser armazenada em cache por 30 segundos. Atualize a página para ver o mesmo timestamp.'
  };
  
  res.json(response);
});

module.exports = router;
