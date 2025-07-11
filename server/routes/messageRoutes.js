import express from 'express';
import { sendMessage, getConversation, getAllConversations, markAsRead, markConversationAsRead, getMessagesBetweenUsers, getunreadconversation } from '../controllers/messageController.js';

import userAuth from '../middleware/userAuth.js';

const router = express.Router();

router.post('/send', userAuth, sendMessage);
router.get('/conversation/:userId', userAuth, getConversation);
router.get('/conversations', userAuth, getAllConversations);
router.patch('/read/:messageId', userAuth, markAsRead);
router.patch('/conversation/:userId/read', userAuth, markConversationAsRead);
router.get('/:userId1/:userId2', userAuth, getMessagesBetweenUsers);

router.get("/unread-count", userAuth, getunreadconversation);

export default router;
