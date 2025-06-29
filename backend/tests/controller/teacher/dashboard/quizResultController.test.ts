import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/teacher/routes/dashboard/quizresultRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const quizResult = { findMany: jest.fn() };
  return { prisma: { quizResult } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Quiz result routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets results by user', async () => {
    (prisma.quizResult.findMany as jest.Mock).mockResolvedValue([{ id: 'r1' }]);
    const res = await request(app).get('/users/u1/quiz-results');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'r1' }]);
  });

  it('handles failures', async () => {
    (prisma.quizResult.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/users/u1/quiz-results');
    expect(res.status).toBe(500);
  });
});
