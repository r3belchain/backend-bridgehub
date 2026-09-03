const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

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
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const payload = jwt.verify(resetPasswordToken, config.jwt.secret);
    const userId = payload.sub; 

    const user = await userService.getUserById(userId);
    if (!user) {
      throw new Error();
    }

    await userService.updateUserById(userId, { password: newPassword });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Token reset password tidak valid atau sudah kedaluwarsa');
  }
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
  resetPassword,
};
