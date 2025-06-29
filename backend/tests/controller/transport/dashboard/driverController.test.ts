import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/transport/routes/dashboard/driverRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const driver = { findMany: jest.fn() };
  return { prisma: { driver } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Driver routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets drivers', async () => {
    (prisma.driver.findMany as jest.Mock).mockResolvedValue([{ id: 'd1' }]);
    const res = await request(app).get('/school/transport/school/drivers');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'd1' }]);
  });

  it('handles errors', async () => {
    (prisma.driver.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school/transport/school/drivers');
    expect(res.status).toBe(500);
  });
});
