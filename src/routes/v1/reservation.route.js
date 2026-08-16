const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const reservationValidation = require('../../validations/reservation.validation');
const reservationController = require('../../controllers/reservation.controller');

const router = express.Router();

router
  .route('/')
  .post(
    auth('createReservation'),
    validate(reservationValidation.createReservation),
    reservationController.createReservation,
  )
  .get(auth('getReservations'), validate(reservationValidation.getReservations), reservationController.getReservations);

router
  .route('/:reservationId')
  .get(auth('getReservations'), validate(reservationValidation.getReservation), reservationController.getReservation);

router
  .route('/:reservationId/status')
  .patch(
    auth('manageReservations'),
    validate(reservationValidation.updateReservationStatus),
    reservationController.updateStatus,
  );

module.exports = router;
