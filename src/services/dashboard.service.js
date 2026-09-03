const prisma = require('../../prisma');

/**
 *  agregasi statistik  Admin Dashboard
 */
const getAdminStats = async () => {
  const totalUsers = await prisma.user.count();
  const activeVendors = await prisma.user.count({ where: { role: 'VENDOR' } });
  const totalSpaces = await prisma.space.count();
  const totalReservations = await prisma.reservation.count();


  const revenueAgg = await prisma.reservation.aggregate({
    where: { status: 'CONFIRMED' },
    _sum: { totalPrice: true },
  });

  return {
    totalUsers,
    activeVendors,
    totalSpaces,
    totalReservations,
    totalRevenue: revenueAgg._sum.totalPrice || 0,
  };
};

module.exports = {
  getAdminStats,
};
