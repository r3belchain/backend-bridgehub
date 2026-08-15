const catchAsync = require('../utils/catchAsync');
const amenityService = require('../services/amenity.service');

const createAmenity = catchAsync(async (req, res) => {
  const amenity = await amenityService.createAmenity(req.body);
  res.status(201).send(amenity);
});

const getAmenities = catchAsync(async (req, res) => {
  const result = await amenityService.queryAmenities();
  res.status(200).send(result);
});

const getAmenity = catchAsync(async (req, res) => {
  const amenity = await amenityService.getAmenityById(req.params.amenityId);
  res.status(200).send(amenity);
});

const updateAmenity = catchAsync(async (req, res) => {
  const amenity = await amenityService.updateAmenityById(req.params.amenityId, req.body);
  res.status(200).send(amenity);
});

const deleteAmenity = catchAsync(async (req, res) => {
  await amenityService.deleteAmenityById(req.params.amenityId);
  res.status(204).send();
});

module.exports = {
  createAmenity,
  getAmenities,
  getAmenity,
  updateAmenity,
  deleteAmenity,
};
