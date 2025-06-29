import request from 'supertest';
import express from 'express';
import routes from '../../../src/modules/superadmin/routes/dashboard/subscriptionRoutes';
import { prisma } from '../../../src/db/prisma';

jest.mock('../../../src/db/prisma', () => {
  const subscription = { findMany: jest.fn() };
  return { prisma: { subscription } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Subscription routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns subscriptions', async () => {
    (prisma.subscription.findMany as jest.Mock).mockResolvedValue([{ id: 'sub1' }]);
    const res = await request(app).get('/schools/subscription');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'sub1' }]);
  });

  it('handles failure', async () => {
    (prisma.subscription.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/schools/subscription');
    expect(res.status).toBe(500);
  });
});
