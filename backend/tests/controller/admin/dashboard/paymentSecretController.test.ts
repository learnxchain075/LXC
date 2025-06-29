import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/admin/routes/dashboard/paymentSecretRoute';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const paymentSecret = { findMany: jest.fn() };
  return { prisma: { paymentSecret } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Payment secret routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns secrets list', async () => {
    (prisma.paymentSecret.findMany as jest.Mock).mockResolvedValue([{ id: 's1' }]);
    const res = await request(app).get('/school/admin/payment-secrets');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 's1' }]);
  });

  it('handles db error', async () => {
    (prisma.paymentSecret.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school/admin/payment-secrets');
    expect(res.status).toBe(500);
  });
});
