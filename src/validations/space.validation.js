const Joi = require('joi');

const createSpace = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    description: Joi.string().allow('', null),
    pricePerHour: Joi.number().positive().required(),
    capacity: Joi.number().integer().positive().required(),
    address: Joi.string().required().trim(),
    amenityIds: Joi.array().items(Joi.string()).default([]),
  }),
};

const getSpaces = {
  query: Joi.object().keys({
    name: Joi.string(),
    vendorId: Joi.string(),
    minPrice: Joi.number(),
    maxPrice: Joi.number(),
    minCapacity: Joi.number().integer(),
  }),
};

const getSpace = {
  params: Joi.object().keys({
    spaceId: Joi.string().required(),
  }),
};

const updateSpace = {
  params: Joi.object().keys({
    spaceId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().trim(),
      description: Joi.string().allow('', null),
      pricePerHour: Joi.number().positive(),
      capacity: Joi.number().integer().positive(),
      address: Joi.string().trim(),
      amenityIds: Joi.array().items(Joi.string()),
    })
    .min(1),
};

const deleteSpace = {
  params: Joi.object().keys({
    spaceId: Joi.string().required(),
  }),
};

module.exports = {
  createSpace,
  getSpaces,
  getSpace,
  updateSpace,
  deleteSpace,
};
