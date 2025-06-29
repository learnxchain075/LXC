import express from 'express';
import { getTransactionsByUserId, getTransactionById, createTransaction, updateTransaction, deleteTransaction } from '../../controllers/dashboard/transactionController';

const router = express.Router();

router.get('/users/:userId/transactions', getTransactionsByUserId);
router.get('/transactions/:id', getTransactionById);
router.post('/transactions', createTransaction);
router.put('/transactions/:id', updateTransaction);
router.delete('/transactions/:id', deleteTransaction);

export default router;