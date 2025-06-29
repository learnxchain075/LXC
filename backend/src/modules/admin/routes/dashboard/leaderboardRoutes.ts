import express from 'express';
import { getLeaderboard, getLeaderboardById, createLeaderboard, updateLeaderboard, deleteLeaderboard } from '../../controllers/dashboard/leaderboardController';


const router = express.Router();    



router.get('/leaderboard', getLeaderboard);
router.get('/leaderboard/:id', getLeaderboardById);
router.post('/leaderboard', createLeaderboard);
router.put('/leaderboard/:id', updateLeaderboard);
router.delete('/leaderboard/:id', deleteLeaderboard);

export default router;
