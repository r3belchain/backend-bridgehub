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
