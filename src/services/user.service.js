const prisma = require('../../prisma');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');

/**
 * Membikin user baru (Register)
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  // Cek apakah email sudah terdaftar
  const existingUser = await getUserByEmail(userBody.email);
  if (existingUser) {
    throw new ApiError(400, 'Email already taken');
  }

  // Hash password sebelum disimpan
  userBody.password = bcrypt.hashSync(userBody.password, 8);

  // Simpan ke database
  return prisma.user.create({
    data: userBody,
  });
};

const getUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

const queryUsers = async () => {
  return prisma.user.findMany();
};

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (updateBody.password) {
    updateBody.password = bcrypt.hashSync(updateBody.password, 8);
  }

  return prisma.user.update({
    where: { id: userId },
    data: updateBody,
  });
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return prisma.user.delete({
    where: { id: userId },
  });
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
