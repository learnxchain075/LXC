import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/student/routes/dashboard/studentAllRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const student = { findUnique: jest.fn() };
  const lesson = { findMany: jest.fn() };
  return { prisma: { student, lesson } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

beforeAll(() => {});
afterAll(() => {
  jest.resetAllMocks();
});

describe('Student lessons route', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns lessons', async () => {
    (prisma.student.findUnique as jest.Mock).mockResolvedValue({ classId: 'c1' });
    (prisma.lesson.findMany as jest.Mock).mockResolvedValue([{ id: 'l1' }]);
    const res = await request(app).get('/student/1/lessons');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, lessons: [{ id: 'l1' }] });
  });

  it('handles failure', async () => {
    (prisma.student.findUnique as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/student/1/lessons');
    expect(res.status).toBe(500);
  });
});
