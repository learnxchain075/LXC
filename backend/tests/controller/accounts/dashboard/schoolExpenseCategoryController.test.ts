import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/accounts/routes/dashboard/schoolExpenseCategory';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const schoolExpenseCategory = {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  };
  return { prisma: { schoolExpenseCategory } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => { jest.resetAllMocks(); });

describe('SchoolExpenseCategory Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates category successfully', async () => {
    (prisma.schoolExpenseCategory.create as jest.Mock).mockResolvedValue({ id: 'c1' });
    const res = await request(app).post('/school/expense-category').send({ name: 'Stationery', schoolId: 'school1' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe('c1');
  });

  it('fails update with invalid body', async () => {
    const res = await request(app).put('/school/expense-category/id1').send({});
    expect(res.status).toBe(400);
  });
});
