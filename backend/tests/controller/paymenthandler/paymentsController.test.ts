import request from 'supertest';
import express from 'express';
import routes from '../../../src/routes/paymenthandler/paymentTransactionRoutes';
import { prisma } from '../../../src/db/prisma';

jest.mock('../../../src/db/prisma', () => {
  const payment = { findMany: jest.fn() };
  return { prisma: { payment } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

beforeAll(() => {});
afterAll(() => {
  jest.resetAllMocks();
});

describe('Payment transaction routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets transactions for student', async () => {
    (prisma.payment.findMany as jest.Mock).mockResolvedValue([{ id: 'p1' }]);
    const res = await request(app).get('/transactions/student/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: [{ id: 'p1' }] });
  });

  it('handles db error', async () => {
    (prisma.payment.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/transactions/student/1');
    expect(res.status).toBe(500);
  });
});
