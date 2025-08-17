const { createObstacle, getObstacle, updateObstacle, deleteObstacle } = require('../src/services/obstacleService');
const { Obstacle, Map } = require('../src/models');

jest.mock('../src/models');

describe('Obstacle Service CRUD', () => {
  let fakeMap, fakeObstacle;

  beforeEach(() => {
    jest.clearAllMocks();
    fakeMap = { id: 1 };
    fakeObstacle = {
      id: 2,
      mapId: 1,
      positionX: 10,
      positionY: 20,
      size: 5,
      save: jest.fn(),
      destroy: jest.fn(),
    };
  });

  describe('createObstacle', () => {
    it('cria um novo obstáculo com sucesso', async () => {
      Map.findByPk.mockResolvedValue(fakeMap);
      Obstacle.create.mockResolvedValue(fakeObstacle);
      const result = await createObstacle({ mapId: 1, position: { x: 10, y: 20 }, size: 5 });
      expect(result).toMatchObject({
        id: fakeObstacle.id,
        mapId: fakeObstacle.mapId,
        position: { x: fakeObstacle.positionX, y: fakeObstacle.positionY },
        size: fakeObstacle.size,
      });
    });
    it('lança erro se mapId não existir', async () => {
      Map.findByPk.mockResolvedValue(null);
      await expect(createObstacle({ mapId: 999, position: { x: 10, y: 20 }, size: 5 })).rejects.toThrow('Map not found');
    });
    it('lança erro se dados obrigatórios faltarem', async () => {
      await expect(createObstacle({ position: { x: 10, y: 20 }, size: 5 })).rejects.toThrow('mapId is required');
      await expect(createObstacle({ mapId: 1, size: 5 })).rejects.toThrow('position is required');
      await expect(createObstacle({ mapId: 1, position: { x: 10, y: 20 } })).rejects.toThrow('size is required');
    });
  });

  describe('getObstacle', () => {
    it('retorna um obstáculo existente', async () => {
      Obstacle.findByPk.mockResolvedValue(fakeObstacle);
      const result = await getObstacle(2);
      expect(result).toMatchObject({
        id: fakeObstacle.id,
        mapId: fakeObstacle.mapId,
        position: { x: fakeObstacle.positionX, y: fakeObstacle.positionY },
        size: fakeObstacle.size,
      });
    });
    it('retorna null se obstáculo não existir', async () => {
      Obstacle.findByPk.mockResolvedValue(null);
      const result = await getObstacle(999);
      expect(result).toBeNull();
    });
  });

  describe('updateObstacle', () => {
    it('atualiza posição e tamanho', async () => {
      Obstacle.findByPk.mockResolvedValue(fakeObstacle);
      const result = await updateObstacle(2, { position: { x: 30, y: 40 }, size: 10 });
      expect(fakeObstacle.save).toHaveBeenCalled();
      expect(result.position).toEqual({ x: 30, y: 40 });
      expect(result.size).toBe(10);
    });
    it('retorna null se obstáculo não existir', async () => {
      Obstacle.findByPk.mockResolvedValue(null);
      const result = await updateObstacle(999, { position: { x: 30, y: 40 }, size: 10 });
      expect(result).toBeNull();
    });
  });

  describe('deleteObstacle', () => {
    it('deleta obstáculo existente', async () => {
      Obstacle.findByPk.mockResolvedValue(fakeObstacle);
      await deleteObstacle(2);
      expect(fakeObstacle.destroy).toHaveBeenCalled();
    });
    it('não faz nada se obstáculo não existir', async () => {
      Obstacle.findByPk.mockResolvedValue(null);
      await expect(deleteObstacle(999)).resolves.toBe(false);
    });
  });
});
