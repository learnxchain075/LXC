import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/teacher/routes/dashboard/lessonRoute';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const lesson = { findMany: jest.fn() };
  return { prisma: { lesson } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Lesson routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets lessons', async () => {
    (prisma.lesson.findMany as jest.Mock).mockResolvedValue([{ id: 'l1' }]);
    const res = await request(app).get('/teacher/lesson');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'l1' }]);
  });

  it('handles failure', async () => {
    (prisma.lesson.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/teacher/lesson');
    expect(res.status).toBe(500);
  });
});
