const Map = require('../models/Map');

const toMapOutput = (map) => ({
  id: map.id,
  name: map.name,
  dimensions: {
    width: map.width,
    height: map.height
  }
});

const createMap = async ({ name, dimensions }) => {
  const map = await Map.create({
    name,
    width: dimensions.width,
    height: dimensions.height
  });
  return toMapOutput(map);
};

const getMap = async (id) => {
  const map = await Map.findByPk(id);
  if (!map) return null;
  return toMapOutput(map);
};

const updateMap = async (id, { name, dimensions }) => {
  const map = await Map.findByPk(id);
  if (!map) return null;
  if (name !== undefined) map.name = name;
  if (dimensions) {
    map.width = dimensions.width;
    map.height = dimensions.height;
  }
  await map.save();
  return toMapOutput(map);
};

const deleteMap = async (id) => {
  const map = await Map.findByPk(id);
  if (!map) return false;
  await map.destroy();
  return true;
};

module.exports = {
  createMap,
  getMap,
  updateMap,
  deleteMap
};
