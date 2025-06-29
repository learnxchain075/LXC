import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/student/routes/dashboard/studentAllRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const student = { findMany: jest.fn() };
  const roadmap = { findMany: jest.fn() };
  return { prisma: { student, roadmap } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Roadmap leaderboard route', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns leaderboard', async () => {
    (prisma.student.findMany as jest.Mock).mockResolvedValue([{ id: 's1', userId: 'u1', user: { name: 'A' } }]);
    (prisma.roadmap.findMany as jest.Mock).mockResolvedValue([{ progress: 0, topics: [] }]);
    const res = await request(app).get('/class/1/roadmap');
    expect(res.status).toBe(200);
    expect(res.body.leaderboard).toBeDefined();
  });

  it('handles error', async () => {
    (prisma.student.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/class/1/roadmap');
    expect(res.status).toBe(500);
  });
});
