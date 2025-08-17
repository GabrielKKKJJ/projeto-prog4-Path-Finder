const { Map } = require('../models');
const { validateMapCreation, validateMapUpdate } = require('../validators/mapValidator');
const { toMapOutput, toMapInput } = require('../transformers/mapTransformer');

class MapService {
  static async createMap(mapData) {
    await validateMapCreation(mapData);
    
    const dbMap = await Map.create({
      ...toMapInput(mapData),
      name: mapData.name
    });
    
    return toMapOutput(dbMap);
  }

  static async getMap(id) {
    const map = await Map.findByPk(id);
    if (!map) return null;
    return toMapOutput(map);
  }

  static async updateMap(id, updateData) {
    await validateMapUpdate(id, updateData);
    
    const map = await Map.findByPk(id);
    if (!map) return null;
    
    const updates = toMapInput(updateData);
    await map.update(updates);
    
    return toMapOutput(map);
  }

  static async deleteMap(id) {
    const map = await Map.findByPk(id);
    if (!map) return false;
    
    await map.destroy();
    return true;
  }
}

module.exports = MapService;
