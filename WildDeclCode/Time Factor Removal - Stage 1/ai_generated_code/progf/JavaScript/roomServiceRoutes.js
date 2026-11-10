// Assisted using common GitHub development utilities
var express = require('express');
var createRoomService = require('../controllers/roomServiceController.js').createRoomService;
var updateRoomServiceStatus = require('../controllers/roomServiceController.js').updateRoomServiceStatus;
var authMiddleware = require('../middlewares/authMiddleware.js');
var authorizeRole = require('../middlewares/authorizeRole.js').authorizeRole;

var router = express.Router();

router.post('/', authMiddleware, authorizeRole(['admin', 'receptionist']), createRoomService);
router.patch('/:id/status', authMiddleware, authorizeRole(['admin', 'receptionist']), updateRoomServiceStatus);

module.exports = router;
