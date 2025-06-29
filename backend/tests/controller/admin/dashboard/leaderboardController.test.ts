import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/admin/routes/dashboard/leaderboardRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const leaderboard = { findMany: jest.fn() };
  return { prisma: { leaderboard } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Leaderboard routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns leaderboard list', async () => {
    (prisma.leaderboard.findMany as jest.Mock).mockResolvedValue([{ id: 'l1' }]);
    const res = await request(app).get('/leaderboard');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'l1' }]);
  });

  it('handles db error', async () => {
    (prisma.leaderboard.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/leaderboard');
    expect(res.status).toBe(500);
  });
});
