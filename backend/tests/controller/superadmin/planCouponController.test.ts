import request from 'supertest';
import express from 'express';
import routes from '../../../src/modules/superadmin/routes/core/couponRoutes';
import { prisma } from '../../../src/db/prisma';

jest.mock('../../../src/db/prisma', () => {
  const coupon = { findMany: jest.fn() };
  return { prisma: { coupon } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Coupon routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lists coupons', async () => {
    (prisma.coupon.findMany as jest.Mock).mockResolvedValue([
      { id: 'c1', plan: { name: 'Basic' } },
    ]);
    const res = await request(app).get('/superadmin/getall-coupon');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'c1', planName: 'Basic' }]);
  });

  it('handles errors', async () => {
    (prisma.coupon.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/superadmin/getall-coupon');
    expect(res.status).toBe(500);
  });
});
