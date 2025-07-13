import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/teacher/routes/dashboard/leaveRequestRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const classModel = { findMany: jest.fn() };
  const studentModel = { findMany: jest.fn() };
  const leaveRequest = { findMany: jest.fn() };
  return { prisma: { class: classModel, student: studentModel, leaveRequest } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Teacher student leave requests route', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets leave requests', async () => {
    (prisma.class.findMany as jest.Mock).mockResolvedValue([{ id: 'c1' }]);
    (prisma.student.findMany as jest.Mock).mockResolvedValue([{ userId: 'u1' }]);
    (prisma.leaveRequest.findMany as jest.Mock).mockResolvedValue([{ id: 'l1' }]);

    const res = await request(app).get('/teacher/t1/student-leave-requests');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'l1' }]);
  });

  it('handles errors', async () => {
    (prisma.class.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/teacher/t1/student-leave-requests');
    expect(res.status).toBe(500);
  });
});
