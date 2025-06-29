import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/transport/routes/dashboard/busRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const bus = { findMany: jest.fn() };
  return { prisma: { bus } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Bus routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets buses', async () => {
    (prisma.bus.findMany as jest.Mock).mockResolvedValue([{ id: 'b1' }]);
    const res = await request(app).get('/school/transport/school/buses');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'b1' }]);
  });

  it('handles error', async () => {
    (prisma.bus.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school/transport/school/buses');
    expect(res.status).toBe(500);
  });
});
