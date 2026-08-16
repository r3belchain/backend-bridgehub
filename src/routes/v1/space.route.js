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
