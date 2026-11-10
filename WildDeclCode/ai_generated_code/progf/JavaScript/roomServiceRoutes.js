// Assisted using common GitHub development utilities
import express from 'express';
import { createRoomService, updateRoomServiceStatus } from '../controllers/roomServiceController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';

const router = express.Router();

router.post('/', authMiddleware, authorizeRole(['admin', 'receptionist']), createRoomService);
router.patch('/:id/status', authMiddleware, authorizeRole(['admin', 'receptionist']), updateRoomServiceStatus);

export default router;
