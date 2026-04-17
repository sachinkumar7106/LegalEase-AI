import express from 'express';
import { getChats, saveChat } from '../controllers/chatController.js';
import requireAuth from '../middlewares/requireAuth.js';

const router = express.Router();

router.get('/', requireAuth, getChats);
router.post('/', requireAuth, saveChat);

export default router;
