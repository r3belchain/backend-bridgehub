const prisma = require('../../prisma');
const ApiError = require('../utils/ApiError');

/**
 * Membuat reservasi baru oleh Customer 
 */
const createReservation = async (reservationBody, customerId) => {
  const { spaceId, startTime, endTime } = reservationBody;
  const start = new Date(startTime);
  const end = new Date(endTime);

  const space = await prisma.space.findUnique({
    where: { id: spaceId },
  });
  if (!space) {
    throw new ApiError(404, 'Space not found');
  }

  // Detection Overlap 
  const overlappingReservation = await prisma.reservation.findFirst({
    where: {
      spaceId,
      status: { not: 'CANCELLED' },
      AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }],
    },
  });

  if (overlappingReservation) {
    throw new ApiError(400, 'Space is already booked for the selected time slot');
  }


  const durationInHours = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60)));
  const totalPrice = durationInHours * space.pricePerHour;


  return prisma.reservation.create({
    data: {
      spaceId,
      customerId,
      startTime: start,
      endTime: end,
      totalPrice,
      status: 'PENDING',
    },
    include: {
      space: {
        select: {
          id: true,
          name: true,
          address: true,
          pricePerHour: true,
          vendor: { select: { id: true, name: true } },
        },
      },
      customer: { select: { id: true, name: true, email: true } },
    },
  });
};

/**
 * Mengambil daftar reservasi
 */
const queryReservations = async (filter, user) => {
  const where = {};

  if (filter.status) {
    where.status = filter.status;
  }
  if (filter.spaceId) {
    where.spaceId = filter.spaceId;
  }

 
  if (user.role === 'CUSTOMER') {
    where.customerId = user.id; 
  } else if (user.role === 'VENDOR') {
    where.space = { vendorId: user.id }; 
  }


  return prisma.reservation.findMany({
    where,
    include: {
      space: {
        select: {
          id: true,
          name: true,
          vendor: { select: { id: true, name: true } },
        },
      },
      customer: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Mengambil detail 1 reservasi
 */
const getReservationById = async (id, user) => {
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      space: {
        select: {
          id: true,
          name: true,
          address: true,
          vendorId: true,
          vendor: { select: { id: true, name: true, email: true } },
        },
      },
      customer: { select: { id: true, name: true, email: true } },
    },
  });

  if (!reservation) {
    throw new ApiError(404, 'Reservation not found');
  }

  // Otorisasi: Hanya Customer pemesan, Vendor pemilik space, atau Admin yang boleh melihat
  if (
    user.role === 'CUSTOMER' &&
    reservation.customerId !== user.id &&
    user.role === 'VENDOR' &&
    reservation.space.vendorId !== user.id &&
    user.role !== 'ADMIN'
  ) {
    throw new ApiError(403, 'Forbidden: You do not have access to this reservation');
  }

  return reservation;
};

/**
 * Update Status Reservasi oleh Vendor atau Admin
 */
const updateReservationStatus = async (id, status, user) => {
  const reservation = await getReservationById(id, user);

  // vendor pemilik dan admin only yang boleh update status
  if (user.role !== 'ADMIN' && reservation.space.vendorId !== user.id) {
    throw new ApiError(403, 'Forbidden: Only the space owner can update reservation status');
  }

  return prisma.reservation.update({
    where: { id },
    data: { status },
    include: {
      space: { select: { id: true, name: true } },
      customer: { select: { id: true, name: true, email: true } },
    },
  });
};

module.exports = {
  createReservation,
  queryReservations,
  getReservationById,
  updateReservationStatus,
};
