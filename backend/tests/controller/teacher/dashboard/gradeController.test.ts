import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/teacher/routes/dashboard/gradeRoute';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const grade = { findMany: jest.fn() };
  return { prisma: { grade } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Grade routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets grades', async () => {
    (prisma.grade.findMany as jest.Mock).mockResolvedValue([{ id: 'g1' }]);
    const res = await request(app).get('/school/teacher/grade');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'g1' }]);
  });

  it('handles error', async () => {
    (prisma.grade.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school/teacher/grade');
    expect(res.status).toBe(500);
  });
});
