const Joi = require('joi');

const createReservation = {
  body: Joi.object().keys({
    spaceId: Joi.string().required(),
    startTime: Joi.date().iso().required().greater('now'),
    endTime: Joi.date().iso().required().greater(Joi.ref('startTime')),
  }),
};

const getReservations = {
  query: Joi.object().keys({
    status: Joi.string().valid('PENDING', 'CONFIRMED', 'CANCELLED'),
    spaceId: Joi.string(),
  }),
};

const getReservation = {
  params: Joi.object().keys({
    reservationId: Joi.string().required(),
  }),
};

const updateReservationStatus = {
  params: Joi.object().keys({
    reservationId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    status: Joi.string().valid('CONFIRMED', 'CANCELLED').required(),
  }),
};

module.exports = {
  createReservation,
  getReservations,
  getReservation,
  updateReservationStatus,
};
