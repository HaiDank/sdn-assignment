var express = require('express');
var router = express.Router();
const orchidController = require('../controllers/OrchidController')

const {ensureAuthenticated} = require('../config/auth')

/* GET home page. */
router.get('/', orchidController.getOrchidPage);
router.route('/:name').get(orchidController.getOrchidDetail).post(ensureAuthenticated, orchidController.createComment)

module.exports = router;
