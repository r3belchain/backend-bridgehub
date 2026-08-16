const catchAsync = require('../utils/catchAsync');
const reservationService = require('../services/reservation.service');

const createReservation = catchAsync(async (req, res) => {
  const reservation = await reservationService.createReservation(req.body, req.user.id);
  res.status(201).send(reservation);
});

const getReservations = catchAsync(async (req, res) => {
  const result = await reservationService.queryReservations(req.query, req.user);
  res.status(200).send(result);
});

const getReservation = catchAsync(async (req, res) => {
  const reservation = await reservationService.getReservationById(req.params.reservationId, req.user);
  res.status(200).send(reservation);
});

const updateStatus = catchAsync(async (req, res) => {
  const reservation = await reservationService.updateReservationStatus(req.params.reservationId, req.body.status, req.user);
  res.status(200).send(reservation);
});

module.exports = {
  createReservation,
  getReservations,
  getReservation,
  updateStatus,
};
