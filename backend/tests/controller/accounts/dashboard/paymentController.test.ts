import request from 'supertest';
import express from 'express';
import paymentRoutes from '../../../../src/modules/accounts/routes/dashboard/paymentRoutes';
import { prisma } from '../../../../src/db/prisma';
import { sendInvoiceEmail } from '../../../../src/utils/mailer';

jest.mock('../../../../src/utils/mailer', () => ({ sendInvoiceEmail: jest.fn() }));

jest.mock('../../../../src/db/prisma', () => {
  const fee = { findUnique: jest.fn() };
  const payment = {
    create: jest.fn(),
    aggregate: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  };
  const student = { findUnique: jest.fn() };
  return { prisma: { fee, payment, student } };
});

const app = express();
app.use(express.json());
app.use('/', paymentRoutes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Payment Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('records cash payment successfully', async () => {
    (prisma.fee.findUnique as jest.Mock).mockResolvedValue({ id: 'fee1', amount: 100, studentId: 'stu1', schoolId: 'school1' });
    (prisma.payment.create as jest.Mock).mockResolvedValue({ id: 'pay1' });
    (prisma.payment.aggregate as jest.Mock).mockResolvedValue({ _sum: { amount: 100 } });
    (prisma.student.findUnique as jest.Mock).mockResolvedValue({ guardianEmail: 'g@test.com' });

    const res = await request(app).post('/cash').send({ feeId: 'fee1', amount: 100 });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 'pay1' });
    expect(prisma.payment.create).toHaveBeenCalled();
  });

  it('returns 404 if fee does not exist', async () => {
    (prisma.fee.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await request(app).post('/cash').send({ feeId: 'bad', amount: 10 });
    expect(res.status).toBe(404);
  });
});
