import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/admin/routes/dashboard/transactionRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const transaction = { findMany: jest.fn() };
  return { prisma: { transaction } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Transaction routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns transactions list', async () => {
    (prisma.transaction.findMany as jest.Mock).mockResolvedValue([{ id: 't1' }]);
    const res = await request(app).get('/transactions');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 't1' }]);
  });

  it('handles db error', async () => {
    (prisma.transaction.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/transactions');
    expect(res.status).toBe(500);
  });
});
