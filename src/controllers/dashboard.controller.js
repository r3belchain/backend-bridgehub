const catchAsync = require('../utils/catchAsync');
const dashboardService = require('../services/dashboard.service');

const getAdminStats = catchAsync(async (req, res) => {
  const stats = await dashboardService.getAdminStats();
  res.status(200).send(stats);
});

module.exports = {
  getAdminStats,
};
