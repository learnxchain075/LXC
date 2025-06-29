import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/admin/routes/dashboard/doubtRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const doubt = { findMany: jest.fn() };
  return { prisma: { doubt } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Doubt routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns doubts list', async () => {
    (prisma.doubt.findMany as jest.Mock).mockResolvedValue([{ id: 'd1' }]);
    const res = await request(app).get('/school/doubts');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'd1' }]);
  });

  it('handles db error', async () => {
    (prisma.doubt.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school/doubts');
    expect(res.status).toBe(500);
  });
});
