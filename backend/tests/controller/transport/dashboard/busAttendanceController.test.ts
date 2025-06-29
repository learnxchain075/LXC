import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/transport/routes/dashboard/busAttendanceRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const busAttendance = { findMany: jest.fn() };
  return { prisma: { busAttendance } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Bus attendance routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets attendance list', async () => {
    (prisma.busAttendance.findMany as jest.Mock).mockResolvedValue([{ id: 'ba1' }]);
    const res = await request(app).get('/transport/school/bus-attendances');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'ba1' }]);
  });

  it('handles error', async () => {
    (prisma.busAttendance.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/transport/school/bus-attendances');
    expect(res.status).toBe(500);
  });
});
