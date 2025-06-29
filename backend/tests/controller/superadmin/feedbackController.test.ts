import request from 'supertest';
import express from 'express';
import routes from '../../../src/modules/superadmin/routes/dashboard/feedbackRoutes';
import { prisma } from '../../../src/db/prisma';

jest.mock('../../../src/db/prisma', () => {
  const feedback = { findMany: jest.fn() };
  return { prisma: { feedback } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Feedback routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns feedback list', async () => {
    (prisma.feedback.findMany as jest.Mock).mockResolvedValue([{ id: 'f1' }]);
    const res = await request(app).get('/get-feedbacks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'f1' }]);
  });

  it('handles failure', async () => {
    (prisma.feedback.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/get-feedbacks');
    expect(res.status).toBe(500);
  });
});
