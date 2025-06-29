import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/admin/routes/dashboard/feeRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const fee = { findMany: jest.fn() };
  return { prisma: { fee } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Fee routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns fees list', async () => {
    (prisma.fee.findMany as jest.Mock).mockResolvedValue([{ id: 'f1' }]);
    const res = await request(app).get('/school/fees');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'f1' }]);
  });

  it('handles db error', async () => {
    (prisma.fee.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school/fees');
    expect(res.status).toBe(500);
  });
});
