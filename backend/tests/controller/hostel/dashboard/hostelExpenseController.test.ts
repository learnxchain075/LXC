import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/hostel/routes/dashboard/hostelExpenseRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const hostelExpense = { findMany: jest.fn(), create: jest.fn() };
  return { prisma: { hostelExpense } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Hostel expense routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns expenses', async () => {
    (prisma.hostelExpense.findMany as jest.Mock).mockResolvedValue([{ id: 'e1' }]);
    const res = await request(app).get('/hostel/expense');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'e1' }]);
  });

  it('creates expense', async () => {
    (prisma.hostelExpense.create as jest.Mock).mockResolvedValue({ id: 'e1' });
    const payload = { hostelId: 'h1', amount: 10 };
    const res = await request(app).post('/hostel/expense').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 'e1' });
  });

  it('handles errors', async () => {
    (prisma.hostelExpense.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/hostel/expense');
    expect(res.status).toBe(500);
  });
});
