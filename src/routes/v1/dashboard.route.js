const express = require('express');
const auth = require('../../middlewares/auth');
const dashboardController = require('../../controllers/dashboard.controller');

const router = express.Router();

router.route('/').get(auth('manageUsers'), dashboardController.getAdminStats);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Admin dashboard statistics and aggregations
 */

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get global platform statistics
 *     description: Retrieve total users, spaces, reservations, and revenue. Only accessible by admins.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   example: 150
 *                 activeVendors:
 *                   type: integer
 *                   example: 25
 *                 totalSpaces:
 *                   type: integer
 *                   example: 40
 *                 totalReservations:
 *                   type: integer
 *                   example: 320
 *                 totalRevenue:
 *                   type: integer
 *                   example: 45000000
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */