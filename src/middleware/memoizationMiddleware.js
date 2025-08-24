/**
 * Middleware de Memoização com suporte a LRU Cache
 * @module memoizationMiddleware
 */

class LRUCache {
  /**
   * Cria uma nova instância do cache LRU
   * @param {Object} options - Opções de configuração
   * @param {number} options.max - Número máximo de itens no cache
   * @param {number} options.maxAge - Tempo de expiração em milissegundos
   */
  constructor({ max = 100, maxAge = 30000 } = {}) {
    this.max = max;
    this.maxAge = maxAge;
    this.cache = new Map();
    this.accessTimes = new Map();
  }

  /**
   * Gera uma chave única para o cache baseada na requisição
   * @private
   * @param {Object} req - Objeto de requisição do Express
   * @returns {string} Chave de cache
   */
  generateKey(req) {
    const { method, originalUrl, query, body } = req;
    return `${method}:${originalUrl}:${JSON.stringify(query)}:${JSON.stringify(body)}`;
  }

  /**
   * Verifica se um item do cache expirou
   * @private
   * @param {string} key - Chave do item de cache
   * @returns {boolean} Verdadeiro se o item expirou
   */
  hasExpired(key) {
    const accessTime = this.accessTimes.get(key);
    if (!accessTime) return true;
    return (Date.now() - accessTime) > this.maxAge;
  }

  /**
   * Remove o item menos recentemente usado
   * @private
   */
  removeLRU() {
    if (this.cache.size === 0) return;

    // Encontra a chave com o menor tempo de acesso
    let lruKey;
    let oldestTime = Date.now();

    for (const [key, time] of this.accessTimes.entries()) {
      if (time < oldestTime) {
        oldestTime = time;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
      this.accessTimes.delete(lruKey);
    }
  }

  /**
   * Limpa itens expirados do cache
   * @private
   */
  cleanup() {
    for (const [key] of this.cache) {
      if (this.hasExpired(key)) {
        this.cache.delete(key);
        this.accessTimes.delete(key);
      }
    }
  }

  /**
   * Obtém um valor do cache
   * @param {string} key - Chave do cache
   * @returns {any|null} Valor em cache ou null se não existir ou tiver expirado
   */
  get(key) {
    if (!this.cache.has(key) || this.hasExpired(key)) {
      this.cache.delete(key);
      this.accessTimes.delete(key);
      return null;
    }

    // Atualiza o tempo de acesso
    this.accessTimes.set(key, Date.now());
    return this.cache.get(key);
  }

  /**
   * Define um valor no cache
   * @param {string} key - Chave do cache
   * @param {any} value - Valor a ser armazenado
   */
  set(key, value) {
    // Remove itens expirados antes de adicionar
    this.cleanup();

    // Remove o LRU se atingir o limite
    if (this.cache.size >= this.max) {
      this.removeLRU();
    }

    this.cache.set(key, value);
    this.accessTimes.set(key, Date.now());
  }
}

/**
 * Middleware de memoização
 * @param {Object} [options={}] - Opções de configuração
 * @param {number} [options.max=100] - Número máximo de itens no cache
 * @param {number} [options.maxAge=30000] - Tempo de expiração em milissegundos (padrão: 30s)
 * @param {Function} [options.keyGenerator] - Função personalizada para gerar chaves de cache
 * @returns {Function} Middleware do Express
 */
const memoizationMiddleware = (options = {}) => {
  const {
    max = 100,
    maxAge = 30000,
    keyGenerator = (req) => {
      const { method, originalUrl, query, body } = req;
      return `${method}:${originalUrl}:${JSON.stringify(query)}:${JSON.stringify(body)}`;
    }
  } = options;

  const cache = new LRUCache({ max, maxAge });

  return (req, res, next) => {
    // Apenas cache para requisições GET
    if (req.method !== 'GET') {
      return next();
    }

    const key = keyGenerator(req);
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      // Responde com os dados em cache
      return res.status(cachedResponse.status).json(cachedResponse.data);
    }

    // Sobrescreve o método res.json para capturar a resposta
    const originalJson = res.json;
    res.json = function (data) {
      // Armazena no cache apenas se for uma resposta de sucesso (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(key, {
          status: res.statusCode,
          data: JSON.parse(JSON.stringify(data)) // Deep clone para evitar referências
        });
      }
      originalJson.call(this, data);
    };

    next();
  };
};

module.exports = memoizationMiddleware;
