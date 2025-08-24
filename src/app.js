// Main Express app entry point
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const memoizationMiddleware = require('./middleware/memoizationMiddleware');
const testCacheRoute = require('./routes/testCacheRoute');

const app = express();

// Configuração do middleware de memoização
const cacheOptions = {
  max: 100,                // Máximo de 100 itens no cache
  maxAge: 30000,           // Tempo de expiração de 30 segundos
  keyGenerator: (req) => {
    // Gera uma chave baseada no método, URL, query params e body
    return `${req.method}:${req.originalUrl}:${JSON.stringify(req.query)}`;
  }
};

// Aplica o middleware de memoização globalmente para requisições GET
app.use((req, res, next) => {
  if (req.method === 'GET') {
    return memoizationMiddleware(cacheOptions)(req, res, next);
  }
  next();
});

app.use(bodyParser.json());

// Rotas principais da API
app.use('/api', routes);

// Rotas de teste (apenas para desenvolvimento)
app.use('/test', testCacheRoute);

// Error handler
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;