import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/teacher/routes/dashboard/quizRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const quiz = { findMany: jest.fn() };
  return { prisma: { quiz } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Quiz routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lists quizzes', async () => {
    (prisma.quiz.findMany as jest.Mock).mockResolvedValue([{ id: 'q1' }]);
    const res = await request(app).get('/school/quizzes');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'q1' }]);
  });

  it('handles failures', async () => {
    (prisma.quiz.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school/quizzes');
    expect(res.status).toBe(500);
  });
});
