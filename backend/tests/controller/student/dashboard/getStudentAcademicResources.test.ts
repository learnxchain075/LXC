import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/student/routes/dashboard/studentAllRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const student = { findUnique: jest.fn() };
  const assignment = { findMany: jest.fn() };
  const homeWork = { findMany: jest.fn() };
  const pYQ = { findMany: jest.fn() };
  return { prisma: { student, assignment, homeWork, pYQ } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Student academic resources route', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns resources', async () => {
    (prisma.student.findUnique as jest.Mock).mockResolvedValue({ classId: 'c1' });
    (prisma.assignment.findMany as jest.Mock).mockResolvedValue([{ id: 'a1' }]);
    (prisma.homeWork.findMany as jest.Mock).mockResolvedValue([{ id: 'h1' }]);
    (prisma.pYQ.findMany as jest.Mock).mockResolvedValue([{ id: 'p1' }]);
    const res = await request(app).get('/student/1/resources');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, assignments: [{ id: 'a1' }], homeworks: [{ id: 'h1' }], pyqs: [{ id: 'p1' }] });
  });

  it('handles db error', async () => {
    (prisma.student.findUnique as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/student/1/resources');
    expect(res.status).toBe(500);
  });
});
