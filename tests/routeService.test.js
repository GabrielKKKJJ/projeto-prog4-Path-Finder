const { createRoute, getRoute, deleteRoute } = require('../src/services/routeService');
const { Route } = require('../src/models');

jest.mock('../src/models');

describe('Route Service CRUD', () => {
  let fakeRoute;

  beforeEach(() => {
    jest.clearAllMocks();
    fakeRoute = {
      id: 1,
      mapId: 2,
      startX: 0,
      startY: 0,
      endX: 10,
      endY: 10,
      distance: 42,
      destroy: jest.fn(),
    };
  });

  describe('createRoute', () => {
    it('cria uma nova rota com sucesso', async () => {
      Route.create.mockResolvedValue(fakeRoute);
      const result = await createRoute({ mapId: 2, start: { x: 0, y: 0 }, end: { x: 10, y: 10 }, distance: 42 });
      expect(result).toMatchObject({
        id: fakeRoute.id,
        mapId: fakeRoute.mapId,
        start: { x: fakeRoute.startX, y: fakeRoute.startY },
        end: { x: fakeRoute.endX, y: fakeRoute.endY },
        distance: fakeRoute.distance,
      });
    });
  });

  describe('getRoute', () => {
    it('retorna uma rota existente', async () => {
      Route.findByPk.mockResolvedValue(fakeRoute);
      const result = await getRoute(1);
      expect(result).toMatchObject({
        id: fakeRoute.id,
        mapId: fakeRoute.mapId,
        start: { x: fakeRoute.startX, y: fakeRoute.startY },
        end: { x: fakeRoute.endX, y: fakeRoute.endY },
        distance: fakeRoute.distance,
      });
    });
    it('retorna null se rota não existir', async () => {
      Route.findByPk.mockResolvedValue(null);
      const result = await getRoute(999);
      expect(result).toBeNull();
    });
  });

  describe('deleteRoute', () => {
    it('deleta rota existente', async () => {
      Route.findByPk.mockResolvedValue(fakeRoute);
      await deleteRoute(1);
      expect(fakeRoute.destroy).toHaveBeenCalled();
    });
    it('não faz nada se rota não existir', async () => {
      Route.findByPk.mockResolvedValue(null);
      await expect(deleteRoute(999)).resolves.toBe(false);
    });
  });
});
