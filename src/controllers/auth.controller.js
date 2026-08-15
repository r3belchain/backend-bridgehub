const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../services');

/**
 * Register user baru (CUSTOMER, VENDOR, ADMIN)
 */
const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);

  // Hapus password dari object response demi keamanan
  delete user.password;

  // Menggunakan angka status 201 (Created) secara langsung agar aman dari undefined
  res.status(201).send({ user, tokens });
});

/**
 * Login user
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);

  delete user.password;

  // Menggunakan angka status 200 (OK) secara langsung
  res.status(200).send({ user, tokens });
});

/**
 * Logout user
 */
const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body?.refreshToken);

  // Menggunakan angka status 204 (No Content) secara langsung
  res.status(204).send();
});

module.exports = {
  register,
  login,
  logout,
};
