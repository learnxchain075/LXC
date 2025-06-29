import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/hostel/routes/dashboard/accommodationRequestRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const accommodationRequest = { findMany: jest.fn(), create: jest.fn() };
  return { prisma: { accommodationRequest } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Accommodation request routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns requests', async () => {
    (prisma.accommodationRequest.findMany as jest.Mock).mockResolvedValue([{ id: 'a1' }]);
    const res = await request(app).get('/hostel/accommodation');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'a1' }]);
  });

  it('creates request', async () => {
    (prisma.accommodationRequest.create as jest.Mock).mockResolvedValue({ id: 'a1' });
    const payload = { studentId: 's1', hostelId: 'h1' };
    const res = await request(app).post('/hostel/accommodation').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 'a1' });
  });

  it('handles db error', async () => {
    (prisma.accommodationRequest.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/hostel/accommodation');
    expect(res.status).toBe(500);
  });
});
