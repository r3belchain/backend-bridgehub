const prisma = require('../../prisma');
const ApiError = require('../utils/ApiError');

/**
 * Membuat ruangan baru (Terkunci pada VendorId pembuat)
 */
const createSpace = async (spaceBody, vendorId) => {
  const { amenityIds, ...spaceData } = spaceBody;

  // Validasi apakah seluruh amenityIds benar-benar ada di DB
  if (amenityIds && amenityIds.length > 0) {
    const count = await prisma.amenity.count({
      where: { id: { in: amenityIds } },
    });
    if (count !== amenityIds.length) {
      throw new ApiError(400, 'One or more amenityIds are invalid or do not exist');
    }
  }

  // Simpan data ruangan ke DB
  return prisma.space.create({
    data: {
      ...spaceData,
      vendorId,
      ...(amenityIds &&
        amenityIds.length > 0 && {
          amenities: {
            create: amenityIds.map((amenityId) => ({
              amenity: { connect: { id: amenityId } },
            })),
          },
        }),
    },
    include: {
      vendor: { select: { id: true, name: true, email: true } },
      amenities: { include: { amenity: true } },
    },
  });
};

/**
 * Mengambil semua ruangan (Publik dengan filter)
 */
const querySpaces = async (filter = {}) => {
  const where = {};

  if (filter.name) {
    where.name = { contains: filter.name, mode: 'insensitive' };
  }
  if (filter.vendorId) {
    where.vendorId = filter.vendorId;
  }
  if (filter.minPrice || filter.maxPrice) {
    where.pricePerHour = {};
    if (filter.minPrice) where.pricePerHour.gte = Number(filter.minPrice);
    if (filter.maxPrice) where.pricePerHour.lte = Number(filter.maxPrice);
  }
  if (filter.minCapacity) {
    where.capacity = { gte: Number(filter.minCapacity) };
  }

  return prisma.space.findMany({
    where,
    include: {
      vendor: { select: { id: true, name: true, email: true } },
      amenities: { include: { amenity: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Mengambil detail 1 ruangan berdasarkan ID
 */
const getSpaceById = async (id) => {
  const space = await prisma.space.findUnique({
    where: { id },
    include: {
      vendor: { select: { id: true, name: true, email: true } },
      amenities: { include: { amenity: true } },
    },
  });

  if (!space) {
    throw new ApiError(404, 'Space not found');
  }

  return space;
};

/**
 * Mengubah ruangan (Dengan isolasi data kepemilikan Vendor)
 */
const updateSpaceById = async (spaceId, updateBody, user) => {
  const space = await getSpaceById(spaceId);

  if (user.role !== 'ADMIN' && space.vendorId !== user.id) {
    throw new ApiError(403, 'Forbidden: You do not own this space');
  }

  const { amenityIds, ...spaceData } = updateBody;

  // Validasi amenityIds jika ada di request update
  if (amenityIds) {
    if (amenityIds.length > 0) {
      const count = await prisma.amenity.count({
        where: { id: { in: amenityIds } },
      });
      if (count !== amenityIds.length) {
        throw new ApiError(400, 'One or more amenityIds are invalid or do not exist');
      }
    }

    await prisma.spaceAmenity.deleteMany({
      where: { spaceId },
    });
  }

  return prisma.space.update({
    where: { id: spaceId },
    data: {
      ...spaceData,
      ...(amenityIds && {
        amenities: {
          create: amenityIds.map((amenityId) => ({
            amenity: { connect: { id: amenityId } },
          })),
        },
      }),
    },
    include: {
      vendor: { select: { id: true, name: true, email: true } },
      amenities: { include: { amenity: true } },
    },
  });
};

/**
 * Menghapus ruangan (Dengan isolasi data kepemilikan Vendor)
 */
const deleteSpaceById = async (spaceId, user) => {
  const space = await getSpaceById(spaceId);

  if (user.role !== 'ADMIN' && space.vendorId !== user.id) {
    throw new ApiError(403, 'Forbidden: You do not own this space');
  }

  await prisma.spaceAmenity.deleteMany({
    where: { spaceId },
  });

  return prisma.space.delete({
    where: { id: spaceId },
  });
};

module.exports = {
  createSpace,
  querySpaces,
  getSpaceById,
  updateSpaceById,
  deleteSpaceById,
};
