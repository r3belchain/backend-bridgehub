const catchAsync = require('../utils/catchAsync');
const spaceService = require('../services/space.service');

const createSpace = catchAsync(async (req, res) => {
  // Pass req.user.id sebagai vendorId pembuat ruangan
  const space = await spaceService.createSpace(req.body, req.user.id);
  res.status(201).send(space);
});

const getSpaces = catchAsync(async (req, res) => {
  const result = await spaceService.querySpaces(req.query);
  res.status(200).send(result);
});

const getSpace = catchAsync(async (req, res) => {
  const space = await spaceService.getSpaceById(req.params.spaceId);
  res.status(200).send(space);
});

const updateSpace = catchAsync(async (req, res) => {
  // Pass req.user ke service untuk pengecekan hak kepemilikan ruangan
  const space = await spaceService.updateSpaceById(req.params.spaceId, req.body, req.user);
  res.status(200).send(space);
});

const deleteSpace = catchAsync(async (req, res) => {
  await spaceService.deleteSpaceById(req.params.spaceId, req.user);
  res.status(204).send();
});

module.exports = {
  createSpace,
  getSpaces,
  getSpace,
  updateSpace,
  deleteSpace,
};
