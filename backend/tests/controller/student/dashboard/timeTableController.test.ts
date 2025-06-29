import request from 'supertest';
import express from 'express';
import * as controller from '../../../../src/modules/student/controllers/dashboard/timeTableController';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const lesson = { findMany: jest.fn() };
  return { prisma: { lesson } };
});

const app = express();
app.use(express.json());
app.get('/class/:classId/lessons', controller.getLessonByClassId);

afterAll(() => jest.resetAllMocks());

describe('TimeTable route', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns lessons', async () => {
    (prisma.lesson.findMany as jest.Mock).mockResolvedValue([{ id: 'l1' }]);
    const res = await request(app).get('/class/1/lessons');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'l1' }]);
  });

  it('handles db error', async () => {
    (prisma.lesson.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/class/1/lessons');
    expect(res.status).toBe(500);
  });
});
