import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/hostel/routes/dashboard/roomRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const room = { findMany: jest.fn(), create: jest.fn() };
  return { prisma: { room } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Room routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns rooms', async () => {
    (prisma.room.findMany as jest.Mock).mockResolvedValue([{ id: 'r1' }]);
    const res = await request(app).get('/hostel/room');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'r1' }]);
  });

  it('creates a room', async () => {
    (prisma.room.create as jest.Mock).mockResolvedValue({ id: 'r1' });
    const payload = { number: '101', type: 'SINGLE', hostelId: 'h1' };
    const res = await request(app).post('/hostel/room').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 'r1' });
  });

  it('handles errors', async () => {
    (prisma.room.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/hostel/room');
    expect(res.status).toBe(500);
  });
});
