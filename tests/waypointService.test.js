const { createWaypoint, getWaypoint, updateWaypoint, deleteWaypoint } = require('../src/services/waypointService');
const { Map, Waypoint } = require('../src/models');

jest.mock('../src/models');

describe('Waypoint Service CRUD', () => {
  let fakeMap, fakeWaypoint;

  beforeEach(() => {
    jest.clearAllMocks();
    fakeMap = { id: 1 };
    fakeWaypoint = {
      id: 2,
      mapId: 1,
      positionX: 10,
      positionY: 20,
      name: 'Ponto A',
      save: jest.fn(),
    };
  });

  describe('createWaypoint', () => {
    it('cria um novo waypoint com sucesso', async () => {
      Map.findByPk.mockResolvedValue(fakeMap);
      Waypoint.create.mockResolvedValue(fakeWaypoint);
      const result = await createWaypoint(1, { position: { x: 10, y: 20 }, name: 'Ponto A' });
      expect(result).toMatchObject({
        id: fakeWaypoint.id,
        mapId: fakeWaypoint.mapId,
        position: { x: fakeWaypoint.positionX, y: fakeWaypoint.positionY },
        name: fakeWaypoint.name,
      });
    });
    it('lança erro se mapId não existir', async () => {
      Map.findByPk.mockResolvedValue(null);
      await expect(createWaypoint(999, { position: { x: 10, y: 20 }, name: 'Ponto A' })).rejects.toThrow('Map not found');
    });
    it('lança erro se nome não for fornecido', async () => {
      await expect(createWaypoint(1, { position: { x: 10, y: 20 } })).rejects.toThrow('name is required');
    });
  });

  describe('getWaypoint', () => {
    it('retorna um waypoint existente', async () => {
      Waypoint.findByPk.mockResolvedValue(fakeWaypoint);
      const result = await getWaypoint(2);
      expect(result).toMatchObject({
        id: fakeWaypoint.id,
        mapId: fakeWaypoint.mapId,
        position: { x: fakeWaypoint.positionX, y: fakeWaypoint.positionY },
        name: fakeWaypoint.name,
      });
    });
    it('retorna null se waypoint não existir', async () => {
      Waypoint.findByPk.mockResolvedValue(null);
      const result = await getWaypoint(999);
      expect(result).toBeNull();
    });
  });

  describe('updateWaypoint', () => {
    it('atualiza posição e nome', async () => {
      Waypoint.findByPk.mockResolvedValue(fakeWaypoint);
      const result = await updateWaypoint(2, { position: { x: 30, y: 40 }, name: 'Ponto B' });
      expect(fakeWaypoint.save).toHaveBeenCalled();
      expect(result.position).toEqual({ x: 30, y: 40 });
      expect(result.name).toBe('Ponto B');
    });
    it('retorna null se waypoint não existir', async () => {
      Waypoint.findByPk.mockResolvedValue(null);
      const result = await updateWaypoint(999, { position: { x: 30, y: 40 }, name: 'Ponto B' });
      expect(result).toBeNull();
    });
  });

  describe('deleteWaypoint', () => {
    it('deleta waypoint existente', async () => {
      fakeWaypoint.destroy = jest.fn();
      Waypoint.findByPk.mockResolvedValue(fakeWaypoint);
      await deleteWaypoint(2);
      expect(fakeWaypoint.destroy).toHaveBeenCalled();
    });
    it('não faz nada se waypoint não existir', async () => {
      Waypoint.findByPk.mockResolvedValue(null);
      await expect(deleteWaypoint(999)).resolves.toBeUndefined();
    });
  });
});
