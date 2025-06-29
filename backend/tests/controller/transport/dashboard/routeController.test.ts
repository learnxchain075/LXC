import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/transport/routes/dashboard/busrouteRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const route = { findMany: jest.fn() };
  return { prisma: { route } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Route routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets routes', async () => {
    (prisma.route.findMany as jest.Mock).mockResolvedValue([{ id: 'r1' }]);
    const res = await request(app).get('/school/transport/school/bus-routes');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'r1' }]);
  });

  it('handles errors', async () => {
    (prisma.route.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school/transport/school/bus-routes');
    expect(res.status).toBe(500);
  });
});
