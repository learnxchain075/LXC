import request from 'supertest';
import express from 'express';
import routes from '../../../src/modules/superadmin/routes/dashboard/planRoutes';
import { prisma } from '../../../src/db/prisma';

jest.mock('../../../src/db/prisma', () => {
  const plan = { findMany: jest.fn() };
  return { prisma: { plan } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Plan routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('fetches plans successfully', async () => {
    (prisma.plan.findMany as jest.Mock).mockResolvedValue([{ id: 'p1' }]);
    const res = await request(app).get('/super/plans');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'p1' }]);
  });

  it('handles prisma failure', async () => {
    (prisma.plan.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/super/plans');
    expect(res.status).toBe(500);
  });
});
