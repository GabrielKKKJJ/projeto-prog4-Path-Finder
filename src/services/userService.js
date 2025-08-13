const User = require('../models/User');

const toUserOutput = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email
});

const createUser = async ({ username, email }) => {
  const user = await User.create({ username, email });
  return toUserOutput(user);
};

const getUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  return toUserOutput(user);
};

const updateUser = async (id, { username, email }) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  if (username !== undefined) user.username = username;
  if (email !== undefined) user.email = email;
  await user.save();
  return toUserOutput(user);
};

const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) return false;
  await user.destroy();
  return true;
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser
};
