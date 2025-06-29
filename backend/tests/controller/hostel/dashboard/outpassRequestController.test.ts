import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/hostel/routes/dashboard/outpassRequestRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const outpassRequest = { findMany: jest.fn() };
  return { prisma: { outpassRequest } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Outpass request routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns outpass requests list', async () => {
    (prisma.outpassRequest.findMany as jest.Mock).mockResolvedValue([{ id: 'o1' }]);
    const res = await request(app).get('/hostel/outpass-requests');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'o1' }]);
  });

  it('handles db error', async () => {
    (prisma.outpassRequest.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/hostel/outpass-requests');
    expect(res.status).toBe(500);
  });
});
