const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');

/**
 * Login dengan email dan password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);

  // Cek keberadaan user terlebih dahulu sebelum membandingkan password
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED || 401, 'Incorrect email or password');
  }

  return user;
};

/**
 * Logout (Stateless JWT)
 */
const logout = async (refreshToken) => {

  return true;
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
};
