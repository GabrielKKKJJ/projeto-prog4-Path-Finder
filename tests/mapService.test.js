const { createMap, getMap, updateMap, deleteMap } = require('../src/services/mapService');
const { Map } = require('../src/models');

jest.mock('../src/models');

describe('Map Service CRUD', () => {
  let fakeMap;

  beforeEach(() => {
    jest.clearAllMocks();
    fakeMap = {
      id: 1,
      name: 'Mapa Teste',
      width: 100,
      height: 200,
      save: jest.fn(),
      destroy: jest.fn(),
    };
  });

  describe('createMap', () => {
    it('cria um novo mapa com sucesso', async () => {
      Map.create.mockResolvedValue(fakeMap);
      const result = await createMap({ name: 'Mapa Teste', dimensions: { width: 100, height: 200 } });
      expect(result).toMatchObject({
        id: fakeMap.id,
        name: fakeMap.name,
        dimensions: { width: fakeMap.width, height: fakeMap.height }
      });
    });
    it('lança erro se dados obrigatórios faltarem', async () => {
      Map.create.mockRejectedValue(new Error('name is required'));
      await expect(createMap({ dimensions: { width: 100, height: 200 } })).rejects.toThrow();
    });
  });

  describe('getMap', () => {
    it('retorna um mapa existente', async () => {
      Map.findByPk.mockResolvedValue(fakeMap);
      const result = await getMap(1);
      expect(result).toMatchObject({
        id: fakeMap.id,
        name: fakeMap.name,
        dimensions: { width: fakeMap.width, height: fakeMap.height }
      });
    });
    it('retorna null se mapa não existir', async () => {
      Map.findByPk.mockResolvedValue(null);
      const result = await getMap(999);
      expect(result).toBeNull();
    });
  });

  describe('updateMap', () => {
    it('atualiza nome e dimensões', async () => {
      Map.findByPk.mockResolvedValue(fakeMap);
      const result = await updateMap(1, { name: 'Novo Nome', dimensions: { width: 150, height: 250 } });
      expect(fakeMap.save).toHaveBeenCalled();
      expect(result.name).toBe('Novo Nome');
      expect(result.dimensions).toEqual({ width: 150, height: 250 });
    });
    it('retorna null se mapa não existir', async () => {
      Map.findByPk.mockResolvedValue(null);
      const result = await updateMap(999, { name: 'Novo Nome', width: 150, height: 250 });
      expect(result).toBeNull();
    });
  });

  describe('deleteMap', () => {
    it('deleta mapa existente', async () => {
      Map.findByPk.mockResolvedValue(fakeMap);
      await deleteMap(1);
      expect(fakeMap.destroy).toHaveBeenCalled();
    });
    it('não faz nada se mapa não existir', async () => {
      Map.findByPk.mockResolvedValue(null);
      await expect(deleteMap(999)).resolves.toBe(false);
    });
  });
});
