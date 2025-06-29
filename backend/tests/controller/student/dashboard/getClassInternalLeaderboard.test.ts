import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/student/routes/dashboard/studentAllRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const homeworkSubmission = { groupBy: jest.fn() };
  const result = { groupBy: jest.fn() };
  const student = { findUnique: jest.fn(), findMany: jest.fn() };
  return { prisma: { homeworkSubmission, result, student } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Class internal leaderboard route', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns leaderboard', async () => {
    (prisma.homeworkSubmission.groupBy as jest.Mock).mockResolvedValue([]);
    (prisma.result.groupBy as jest.Mock).mockResolvedValue([]);
    (prisma.student.findUnique as jest.Mock).mockResolvedValue({ user: { name: 'A' } });
    const res = await request(app).get('/class/1/internal');
    expect(res.status).toBe(200);
    expect(res.body.leaderboard).toBeDefined();
  });

  it('handles error', async () => {
    (prisma.homeworkSubmission.groupBy as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/class/1/internal');
    expect(res.status).toBe(500);
  });
});
