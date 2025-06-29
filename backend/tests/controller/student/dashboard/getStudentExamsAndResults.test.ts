import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/student/routes/dashboard/studentAllRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const student = { findUnique: jest.fn() };
  const exam = { findMany: jest.fn() };
  return { prisma: { student, exam } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Student exams and results route', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns exams', async () => {
    (prisma.student.findUnique as jest.Mock).mockResolvedValue({ classId: 'c1' });
    (prisma.exam.findMany as jest.Mock).mockResolvedValue([{ id: 'e1' }]);
    const res = await request(app).get('/student/1/exams-results');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, exams: [{ id: 'e1' }] });
  });

  it('handles db error', async () => {
    (prisma.student.findUnique as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/student/1/exams-results');
    expect(res.status).toBe(500);
  });
});
