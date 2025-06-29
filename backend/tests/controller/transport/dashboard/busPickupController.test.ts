import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/transport/routes/dashboard/busPickUpRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const busPickup = { findMany: jest.fn() };
  return { prisma: { busPickup } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Bus pickup routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets pickup points', async () => {
    (prisma.pickUpPoint.findMany as jest.Mock).mockResolvedValue([{ id: 'p1' }]);
    const res = await request(app).get('/school/transport/school/bus-pickup/school/s1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'p1' }]);
  });

  it('handles db error', async () => {
    (prisma.pickUpPoint.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school/transport/school/bus-pickup/school/s1');
    expect(res.status).toBe(500);
  });
});
