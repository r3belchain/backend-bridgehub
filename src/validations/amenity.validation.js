const Joi = require('joi');

const createAmenity = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    icon: Joi.string().allow('', null),
  }),
};

const getAmenities = {
  query: Joi.object().keys({
    name: Joi.string(),
  }),
};

const getAmenity = {
  params: Joi.object().keys({
    amenityId: Joi.string().required(),
  }),
};

const updateAmenity = {
  params: Joi.object().keys({
    amenityId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().trim(),
      icon: Joi.string().allow('', null),
    })
    .min(1),
};

const deleteAmenity = {
  params: Joi.object().keys({
    amenityId: Joi.string().required(),
  }),
};

module.exports = {
  createAmenity,
  getAmenities,
  getAmenity,
  updateAmenity,
  deleteAmenity,
};
