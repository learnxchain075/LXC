import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/admin/routes/dashboard/answerRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const answer = { findMany: jest.fn() };
  return { prisma: { answer } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Answer routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns answers list', async () => {
    (prisma.answer.findMany as jest.Mock).mockResolvedValue([
      { id: 'a1', user: { name: 'User1' } },
    ]);
    const res = await request(app).get('/school/doubts/d1/answers');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'a1', user: { name: 'User1' } }]);
  });

  it('handles db error', async () => {
    (prisma.answer.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school/doubts/d1/answers');
    expect(res.status).toBe(500);
  });
});
