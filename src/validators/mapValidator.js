const validateMapCreation = ({ name, dimensions }) => {
  if (!name) throw new Error('Map name is required');
  if (!dimensions) throw new Error('Dimensions are required');
  if (!dimensions.width || !dimensions.height) {
    throw new Error('Both width and height dimensions are required');
  }
  if (dimensions.width <= 0 || dimensions.height <= 0) {
    throw new Error('Dimensions must be positive numbers');
  }
};

const validateMapUpdate = (id, { name, dimensions }) => {
  if (!id) throw new Error('Map ID is required');
  if (dimensions && (!dimensions.width || !dimensions.height)) {
    throw new Error('Both width and height must be provided for dimensions');
  }
};

module.exports = {
  validateMapCreation,
  validateMapUpdate
};
