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

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Reservation and booking management
 */

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create a reservation
 *     description: Customers can book a coworking space. Requires 'createReservation' permission.
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - spaceId
 *               - startTime
 *               - endTime
 *             properties:
 *               spaceId:
 *                 type: string
 *                 description: ID of the Space being booked
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Booking start time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: Booking end time
 *             example:
 *               spaceId: "60d0fe4f5311236168a109ca"
 *               startTime: "2026-09-10T09:00:00.000Z"
 *               endTime: "2026-09-10T12:00:00.000Z"
 *     responses:
 *       "201":
 *         description: Created
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all reservations
 *     description: Customers see their own bookings. Vendors see bookings for their spaces. Admins see all. Requires 'getReservations' permission.
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status (e.g., PENDING, CONFIRMED, CANCELLED)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. createdAt:desc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of records per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /reservations/{reservationId}:
 *   get:
 *     summary: Get a specific reservation
 *     description: Fetch details of a single reservation. Requires 'getReservations' permission.
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /reservations/{reservationId}/status:
 *   patch:
 *     summary: Update reservation status
 *     description: Vendors/Admins can approve or cancel a booking. Requires 'manageReservations' permission.
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, CANCELLED]
 *             example:
 *               status: "CONFIRMED"
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */