import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/teacher/routes/dashboard/examRoute';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const exam = { findMany: jest.fn() };
  return { prisma: { exam } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Exam routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets exams by class', async () => {
    (prisma.exam.findMany as jest.Mock).mockResolvedValue([{ id: 'e1' }]);
    const res = await request(app).get('/school/teacher/exam/cls1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'e1' }]);
  });

  it('handles errors', async () => {
    (prisma.exam.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school/teacher/exam/cls1');
    expect(res.status).toBe(500);
  });
});
