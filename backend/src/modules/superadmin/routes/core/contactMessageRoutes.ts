import express from 'express';
import { createContactMessage, deleteContactMessage, getAllContactMessages, getContactMessageById, updateContactMessage } from '../../controllers/contactMessagesController';


const router = express.Router();

router.post('/contact-message', createContactMessage);
router.get('/contact-messages', getAllContactMessages);
router.get('/contact-message/:id', getContactMessageById);
router.put('/contact-message/:id', updateContactMessage);
router.delete('/contact-message/:id', deleteContactMessage);



export default router;


