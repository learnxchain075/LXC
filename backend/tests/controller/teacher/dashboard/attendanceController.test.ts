import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/teacher/routes/dashboard/attendanceRoute';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const attendance = { findMany: jest.fn() };
  return { prisma: { attendance } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Attendance routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lists attendance records', async () => {
    (prisma.attendance.findMany as jest.Mock).mockResolvedValue([{ id: 'att1' }]);
    const res = await request(app).get('/teacher/attendance');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'att1' }]);
  });

  it('handles errors', async () => {
    (prisma.attendance.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/teacher/attendance');
    expect(res.status).toBe(500);
  });
});
