import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/accounts/routes/dashboard/schoolExpenseRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const schoolExpense = {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  };
  return { prisma: { schoolExpense } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => { jest.resetAllMocks(); });

describe('SchoolExpense Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates school expense', async () => {
    (prisma.schoolExpense.create as jest.Mock).mockResolvedValue({ id: 'e1' });
    const res = await request(app).post('/school/expense').send({
      categoryId: 'cat1',
      date: new Date().toISOString(),
      amount: 10,
      description: 'paper',
      invoiceNumber: '123',
      paymentMethod: 'CASH',
      schoolId: 'school1'
    });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe('e1');
  });

  it('fails when body invalid', async () => {
    const res = await request(app).post('/school/expense').send({});
    expect(res.status).toBe(400);
  });
});
