import request from 'supertest';
import express from 'express';
import salaryRoutes from '../../../../src/modules/accounts/routes/dashboard/salaryRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const salaryPayment = { create: jest.fn(), findMany: jest.fn() };
  return { prisma: { salaryPayment } };
});

const app = express();
app.use(express.json());
app.use((req, _res, next) => { req.user = { schoolId: 'school1' } as any; next(); });
app.use('/', salaryRoutes);

afterAll(() => { jest.resetAllMocks(); });

describe('Salary Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('records salary payment', async () => {
    (prisma.salaryPayment.create as jest.Mock).mockResolvedValue({ id: 'sp1' });
    const res = await request(app).post('/pay').send({
      teacherId: 't1',
      amount: 100,
      period: 'Jan',
      method: 'CASH'
    });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe('sp1');
  });

  it('fails validation for missing data', async () => {
    const res = await request(app).post('/pay').send({});
    expect(res.status).toBe(400);
  });
});
