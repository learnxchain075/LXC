import request from 'supertest';
import express from 'express';
import feeRoutes from '../../../../src/modules/accounts/routes/dashboard/feesRoutes';
import { prisma } from '../../../../src/db/prisma';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; schoolId: string };
    }
  }
}

jest.mock('../../../../src/db/prisma', () => {
  const fee = {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  return { prisma: { fee } };
});

const app = express();
app.use(express.json());
app.use((req, _res, next) => {
  req.user = { id: 'user1', schoolId: 'school1' } as any;
  next();
});
app.use('/', feeRoutes);

beforeAll(() => {
  // setup if needed
});

afterAll(() => {
  jest.resetAllMocks();
});

describe('Fee Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates a fee successfully', async () => {
    (prisma.fee.create as jest.Mock).mockResolvedValue({ id: 'fee1' });

    const res = await request(app).post('/student/create-fee').send({
      studentId: 'stu1',
      amount: 100,
      category: 'Tuition',
      paymentDate: new Date().toISOString(),
      discount: 0,
      scholarship: 0,
      schoolId: 'school1',
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 'fee1' });
    expect(prisma.fee.create).toHaveBeenCalled();
  });

  it('fails validation when body is incomplete', async () => {
    const res = await request(app).post('/student/create-fee').send({ amount: 10 });
    expect(res.status).toBe(400);
  });

  it('returns 404 when fee not found', async () => {
    (prisma.fee.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get('/student/create/unknown');
    expect(res.status).toBe(404);
  });
});
