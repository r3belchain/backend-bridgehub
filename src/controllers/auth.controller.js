const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');

/**
 * Register (CUSTOMER, VENDOR, ADMIN)
 */
const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);

  delete user.password;

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

  res.status(200).send({ user, tokens });
});

/**
 * Logout user
 */
const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body?.refreshToken);

  res.status(204).send();
});

/**
 * Forgot password
 */
const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(204).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(204).send();
});

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
