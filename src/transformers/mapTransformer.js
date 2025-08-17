const toMapOutput = (map) => ({
  id: map.id,
  name: map.name,
  dimensions: {
    width: map.width,
    height: map.height
  }
});

const toMapInput = ({ dimensions, ...rest }) => ({
  ...rest,
  width: dimensions?.width,
  height: dimensions?.height
});

module.exports = {
  toMapOutput,
  toMapInput
};
