const { createUser, getUser, updateUser, deleteUser } = require('../src/services/userService');
const { User } = require('../src/models');

jest.mock('../src/models');

describe('User Service CRUD', () => {
  let fakeUser;

  beforeEach(() => {
    jest.clearAllMocks();
    fakeUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      save: jest.fn(),
      destroy: jest.fn(),
    };
  });

  describe('createUser', () => {
    it('cria um novo usuário com sucesso', async () => {
      User.create.mockResolvedValue(fakeUser);
      const result = await createUser({ username: 'testuser', email: 'test@example.com' });
      expect(result).toMatchObject({
        id: fakeUser.id,
        username: fakeUser.username,
        email: fakeUser.email,
      });
    });
  });

  describe('getUser', () => {
    it('retorna um usuário existente', async () => {
      User.findByPk.mockResolvedValue(fakeUser);
      const result = await getUser(1);
      expect(result).toMatchObject({
        id: fakeUser.id,
        username: fakeUser.username,
        email: fakeUser.email,
      });
    });
    it('retorna null se usuário não existir', async () => {
      User.findByPk.mockResolvedValue(null);
      const result = await getUser(999);
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('atualiza username e email', async () => {
      User.findByPk.mockResolvedValue(fakeUser);
      const result = await updateUser(1, { username: 'newuser', email: 'new@example.com' });
      expect(fakeUser.save).toHaveBeenCalled();
      expect(result.username).toBe('newuser');
      expect(result.email).toBe('new@example.com');
    });
    it('retorna null se usuário não existir', async () => {
      User.findByPk.mockResolvedValue(null);
      const result = await updateUser(999, { username: 'newuser', email: 'new@example.com' });
      expect(result).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('deleta usuário existente', async () => {
      User.findByPk.mockResolvedValue(fakeUser);
      await deleteUser(1);
      expect(fakeUser.destroy).toHaveBeenCalled();
    });
    it('não faz nada se usuário não existir', async () => {
      User.findByPk.mockResolvedValue(null);
      await expect(deleteUser(999)).resolves.toBe(false);
    });
  });
});
