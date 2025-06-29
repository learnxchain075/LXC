import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/accounts/routes/dashboard/schoolIncomeRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const schoolIncome = {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  return { prisma: { schoolIncome } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => { jest.resetAllMocks(); });

describe('SchoolIncome Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates school income', async () => {
    (prisma.schoolIncome.create as jest.Mock).mockResolvedValue({ id: 'i1' });
    const res = await request(app).post('/school/income').send({
      source: 'donation',
      date: new Date().toISOString(),
      amount: 20,
      description: 'desc',
      invoiceNumber: 'inv',
      paymentMethod: 'CASH',
      schoolId: 'school1'
    });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe('i1');
  });

  it('returns 404 for unknown id', async () => {
    (prisma.schoolIncome.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get('/school/income/bad');
    expect(res.status).toBe(404);
  });
});
