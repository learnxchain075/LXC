import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/hostel/routes/dashboard/hostelFeesRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const hostelFee = { findMany: jest.fn(), create: jest.fn() };
  return { prisma: { hostelFee } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Hostel fee routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns fees', async () => {
    (prisma.hostelFee.findMany as jest.Mock).mockResolvedValue([{ id: 'f1' }]);
    const res = await request(app).get('/hostel/fee');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'f1' }]);
  });

  it('creates fee', async () => {
    (prisma.hostelFee.create as jest.Mock).mockResolvedValue({ id: 'f1' });
    const payload = { hostelId: 'h1', amount: 25 };
    const res = await request(app).post('/hostel/fee').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 'f1' });
  });

  it('handles errors', async () => {
    (prisma.hostelFee.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/hostel/fee');
    expect(res.status).toBe(500);
  });
});
