import request from 'supertest';
import express from 'express';
import routes from '../../../../../../src/modules/admin/routes/dashboard/hrm/payrollRoutes';
import { prisma } from '../../../../../../src/db/prisma';

jest.mock('../../../../../../src/db/prisma', () => {
  const payroll = { findMany: jest.fn() };
  return { prisma: { payroll } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Payroll routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns payrolls list', async () => {
    (prisma.payroll.findMany as jest.Mock).mockResolvedValue([{ id: 'p1' }]);
    const res = await request(app).get('/school1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'p1' }]);
  });

  it('handles db error', async () => {
    (prisma.payroll.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school1');
    expect(res.status).toBe(500);
  });
});
