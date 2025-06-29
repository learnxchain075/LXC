import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/transport/routes/dashboard/busStopRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const busStop = { findMany: jest.fn() };
  return { prisma: { busStop } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Bus stop routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets bus stops', async () => {
    (prisma.busStop.findMany as jest.Mock).mockResolvedValue([{ id: 'bs1' }]);
    const res = await request(app).get('/school/transport/school/bus-stops');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'bs1' }]);
  });

  it('handles error', async () => {
    (prisma.busStop.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school/transport/school/bus-stops');
    expect(res.status).toBe(500);
  });
});
