import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/student/routes/dashboard/studentAllRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const attendance = { findMany: jest.fn() };
  const student = { findUnique: jest.fn() };
  const leaveRequest = { findMany: jest.fn() };
  return { prisma: { attendance, student, leaveRequest } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Student attendance and leave route', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns attendance and leaves', async () => {
    (prisma.attendance.findMany as jest.Mock).mockResolvedValue([{ id: 'a1' }]);
    (prisma.student.findUnique as jest.Mock).mockResolvedValue({ userId: 'u1' });
    (prisma.leaveRequest.findMany as jest.Mock).mockResolvedValue([{ id: 'l1' }]);
    const res = await request(app).get('/student/1/attendance-leaves');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, attendance: [{ id: 'a1' }], leaveRequests: [{ id: 'l1' }] });
  });

  it('handles db error', async () => {
    (prisma.attendance.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/student/1/attendance-leaves');
    expect(res.status).toBe(500);
  });
});
