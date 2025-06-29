import request from 'supertest';
import express from 'express';
import routes from '../../../src/routes/paymenthandler/planHandlerRoutes';
import { prisma } from '../../../src/db/prisma';

jest.mock('../../../src/config/razorpay', () => ({
  razorpayInstance: { orders: { create: jest.fn().mockResolvedValue({ id: 'o1', amount: 100 }) } }
}));

jest.mock('../../../src/db/prisma', () => {
  const plan = { findUnique: jest.fn() };
  const subscription = { count: jest.fn() };
  const payment = { create: jest.fn() };
  return { prisma: { plan, subscription, payment } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

beforeAll(() => {});
afterAll(() => {
  jest.resetAllMocks();
});

describe('Plan payment routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates order', async () => {
    (prisma.plan.findUnique as jest.Mock).mockResolvedValue({ id: 'p1', price: 10, durationDays: 30 });
    (prisma.subscription.count as jest.Mock).mockResolvedValue(0);
    (prisma.payment.create as jest.Mock).mockResolvedValue({});
    const res = await request(app)
      .post('/school/create-order')
      .send({ planId: 'p1', schoolId: 's1' });
    expect(res.status).toBe(201);
    expect(res.body.orderId).toBe('o1');
  });

  it('handles error', async () => {
    (prisma.plan.findUnique as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app)
      .post('/school/create-order')
      .send({ planId: 'p1', schoolId: 's1' });
    expect(res.status).toBe(500);
  });
});
