import request from 'supertest';
import express from 'express';
import routes from '../../../src/routes/paymenthandler/feeHandlerRoutes';
import { prisma } from '../../../src/db/prisma';

jest.mock('razorpay', () => {
  return jest.fn().mockImplementation(() => ({ orders: { create: jest.fn().mockResolvedValue({ id: 'r1' }) } }));
});

jest.mock('../../../src/db/prisma', () => {
  const fee = { findUnique: jest.fn() };
  const paymentSecret = { findUnique: jest.fn() };
  const payment = { create: jest.fn() };
  return { prisma: { fee, paymentSecret, payment } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

beforeAll(() => {});
afterAll(() => {
  jest.resetAllMocks();
});

describe('Fee payment routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates razorpay order', async () => {
    (prisma.fee.findUnique as jest.Mock).mockResolvedValue({ id: 'f1', schoolId: 's1' });
    (prisma.paymentSecret.findUnique as jest.Mock).mockResolvedValue({ keyId: 'k', keySecret: 's' });
    (prisma.payment.create as jest.Mock).mockResolvedValue({});
    const res = await request(app)
      .post('/school/fee/create-order')
      .send({ feeId: 'f1', amount: 10 });
    expect(res.status).toBe(201);
    expect(res.body.orderId).toBe('r1');
  });

  it('handles failure', async () => {
    (prisma.fee.findUnique as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app)
      .post('/school/fee/create-order')
      .send({ feeId: 'f1', amount: 10 });
    expect(res.status).toBe(500);
  });
});
