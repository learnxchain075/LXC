import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/student/routes/dashboard/studentAllRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const quizResult = { groupBy: jest.fn() };
  const newspaperSubmission = { groupBy: jest.fn() };
  const answer = { groupBy: jest.fn() };
  const user = { findUnique: jest.fn() };
  return { prisma: { quizResult, newspaperSubmission, answer, user } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Monthly leaderboard route', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns leaderboard', async () => {
    (prisma.quizResult.groupBy as jest.Mock).mockResolvedValue([{ userId: 'u1', _sum: { score: 1 } }]);
    (prisma.newspaperSubmission.groupBy as jest.Mock).mockResolvedValue([]);
    (prisma.answer.groupBy as jest.Mock).mockResolvedValue([]);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ name: 'A' });
    const res = await request(app).get('/leaderboard/monthly');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('handles error', async () => {
    (prisma.quizResult.groupBy as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/leaderboard/monthly');
    expect(res.status).toBe(500);
  });
});
