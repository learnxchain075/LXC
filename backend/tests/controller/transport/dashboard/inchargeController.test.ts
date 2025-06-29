import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/transport/routes/dashboard/inchargeRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const incharge = { findMany: jest.fn() };
  return { prisma: { incharge } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Incharge routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets incharges', async () => {
    (prisma.incharge.findMany as jest.Mock).mockResolvedValue([{ id: 'i1' }]);
    const res = await request(app).get('/transport/school/incharges`');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'i1' }]);
  });

  it('handles db error', async () => {
    (prisma.incharge.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/transport/school/incharges`');
    expect(res.status).toBe(500);
  });
});
