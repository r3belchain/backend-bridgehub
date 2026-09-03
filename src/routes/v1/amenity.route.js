const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const amenityValidation = require('../../validations/amenity.validation');
const amenityController = require('../../controllers/amenity.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageAmenities'), validate(amenityValidation.createAmenity), amenityController.createAmenity)
  .get(validate(amenityValidation.getAmenities), amenityController.getAmenities);

router
  .route('/:amenityId')
  .get(validate(amenityValidation.getAmenity), amenityController.getAmenity)
  .patch(auth('manageAmenities'), validate(amenityValidation.updateAmenity), amenityController.updateAmenity)
  .delete(auth('manageAmenities'), validate(amenityValidation.deleteAmenity), amenityController.deleteAmenity);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Amenities
 *   description: Amenity management and retrieval
 */

/**
 * @swagger
 * /amenities:
 *   post:
 *     summary: Create an amenity
 *     description: Only admins can create amenities.
 *     tags: [Amenities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               icon:
 *                 type: string
 *             example:
 *               name: "WiFi Kecepatan Tinggi"
 *               icon: "wifi-outline"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 icon:
 *                   type: string
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all amenities
 *     description: Retrieve all amenities. Accessible by anyone (Public).
 *     tags: [Amenities]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by amenity name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of amenities per page
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       icon:
 *                         type: string
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 */

/**
 * @swagger
 * /amenities/{amenityId}:
 *   get:
 *     summary: Get a specific amenity
 *     description: Fetch details of a single amenity by its ID.
 *     tags: [Amenities]
 *     parameters:
 *       - in: path
 *         name: amenityId
 *         required: true
 *         schema:
 *           type: string
 *         description: Amenity ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 icon:
 *                   type: string
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update an amenity
 *     description: Only admins can update amenities.
 *     tags: [Amenities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: amenityId
 *         required: true
 *         schema:
 *           type: string
 *         description: Amenity ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               icon:
 *                 type: string
 *             example:
 *               name: "Proyektor 4K"
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete an amenity
 *     description: Only admins can delete amenities.
 *     tags: [Amenities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: amenityId
 *         required: true
 *         schema:
 *           type: string
 *         description: Amenity ID
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */