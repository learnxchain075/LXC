import request from 'supertest';
import express from 'express';
import reportRoutes from '../../../../src/modules/accounts/routes/dashboard/accountsReportRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const payment = { findMany: jest.fn() };
  const fee = { findMany: jest.fn() };
  const salaryPayment = { findMany: jest.fn() };
  return { prisma: { payment, fee, salaryPayment } };
});

const app = express();
app.use(express.json());
app.use('/', reportRoutes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Report Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns collected fees', async () => {
    (prisma.payment.findMany as jest.Mock).mockResolvedValue([{ amount: 50, fee: {} }]);
    const start = new Date().toISOString();
    const end = new Date().toISOString();
    const res = await request(app).get(`/fees-collected?startDate=${start}&endDate=${end}`);
    expect(res.status).toBe(200);
    expect(res.body.total).toBeDefined();
  });

  it('fails when missing query params', async () => {
    const res = await request(app).get('/fees-collected');
    expect(res.status).toBe(400);
  });
});
