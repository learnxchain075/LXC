import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/teacher/routes/dashboard/payrollRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const teacher = { findUnique: jest.fn() };
  const payroll = { findMany: jest.fn() };
  return { prisma: { teacher, payroll } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Teacher payroll routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns payroll list for a teacher', async () => {
    (prisma.teacher.findUnique as jest.Mock).mockResolvedValue({ userId: 'u1' });
    (prisma.payroll.findMany as jest.Mock).mockResolvedValue([{ id: 'p1' }]);
    const res = await request(app).get('/teacher/payroll/t1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'p1' }]);
  });

  it('handles errors', async () => {
    (prisma.teacher.findUnique as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/teacher/payroll/t1');
    expect(res.status).toBe(500);
  });
});
