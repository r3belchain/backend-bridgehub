const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const spaceValidation = require('../../validations/space.validation');
const spaceController = require('../../controllers/space.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageSpaces'), validate(spaceValidation.createSpace), spaceController.createSpace)
  .get(validate(spaceValidation.getSpaces), spaceController.getSpaces);

router
  .route('/:spaceId')
  .get(validate(spaceValidation.getSpace), spaceController.getSpace)
  .patch(auth('manageSpaces'), validate(spaceValidation.updateSpace), spaceController.updateSpace)
  .delete(auth('manageSpaces'), validate(spaceValidation.deleteSpace), spaceController.deleteSpace);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Spaces
 *   description: Coworking space catalog and management
 */

/**
 * @swagger
 * /spaces:
 *   post:
 *     summary: Create a coworking space
 *     description: Vendors can register new spaces. Requires 'manageSpaces' permission.
 *     tags: [Spaces]
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
 *               - description
 *               - pricePerHour
 *               - address
 *               - capacity
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               pricePerHour:
 *                 type: number
 *               address:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of Amenity IDs
 *             example:
 *               name: "Executive Meeting Room"
 *               description: "Ruang rapat premium dengan proyektor 4K"
 *               pricePerHour: 150000
 *               address: "Gedung Cyber, Lt 3, Jakarta Selatan"
 *               capacity: 12
 *               amenities: ["60d0fe4f5311236168a109cb"]
 *     responses:
 *       "201":
 *         description: Created
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all coworking spaces
 *     description: Retrieve the catalog of all spaces. Accessible by anyone (Public).
 *     tags: [Spaces]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Search space by name
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price per hour
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price per hour
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. pricePerHour:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of spaces per page
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
 */

/**
 * @swagger
 * /spaces/{spaceId}:
 *   get:
 *     summary: Get a specific coworking space
 *     description: Fetch details of a single space by its ID. Accessible by anyone (Public).
 *     tags: [Spaces]
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Space ID
 *     responses:
 *       "200":
 *         description: OK
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a coworking space
 *     description: Vendors can update their own spaces. Admins can update any space. Requires 'manageSpaces' permission.
 *     tags: [Spaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Space ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               pricePerHour:
 *                 type: number
 *             example:
 *               pricePerHour: 175000
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
 *     summary: Delete a coworking space
 *     description: Vendors can delete their spaces. Admins can delete any space. Requires 'manageSpaces' permission.
 *     tags: [Spaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Space ID
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