const prisma = require('../../prisma');
const ApiError = require('../utils/ApiError');

/**
 * Membuat Amenity baru
 */
const createAmenity = async (amenityBody) => {
  const existingAmenity = await prisma.amenity.findFirst({
    where: { name: { equals: amenityBody.name, mode: 'insensitive' } },
  });

  if (existingAmenity) {
    throw new ApiError(400, 'Amenity already exists');
  }

  return prisma.amenity.create({
    data: amenityBody,
  });
};

/**
 * Mengambil semua daftar Amenity
 */
const queryAmenities = async () => {
  return prisma.amenity.findMany({
    orderBy: { name: 'asc' },
  });
};

/**
 * Mengambil Amenity berdasarkan ID
 */
const getAmenityById = async (id) => {
  const amenity = await prisma.amenity.findUnique({
    where: { id },
  });

  if (!amenity) {
    throw new ApiError(404, 'Amenity not found');
  }

  return amenity;
};

/**
 * Memperbarui Amenity berdasarkan ID
 */
const updateAmenityById = async (amenityId, updateBody) => {
  await getAmenityById(amenityId);

  if (updateBody.name) {
    const existingAmenity = await prisma.amenity.findFirst({
      where: {
        name: { equals: updateBody.name, mode: 'insensitive' },
        NOT: { id: amenityId },
      },
    });

    if (existingAmenity) {
      throw new ApiError(400, 'Amenity name already taken');
    }
  }

  return prisma.amenity.update({
    where: { id: amenityId },
    data: updateBody,
  });
};

/**
 * Menghapus Amenity berdasarkan ID
 */
const deleteAmenityById = async (amenityId) => {
  await getAmenityById(amenityId);

  return prisma.amenity.delete({
    where: { id: amenityId },
  });
};

module.exports = {
  createAmenity,
  queryAmenities,
  getAmenityById,
  updateAmenityById,
  deleteAmenityById,
};
