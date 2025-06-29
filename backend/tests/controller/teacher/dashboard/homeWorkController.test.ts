import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/teacher/routes/dashboard/homeWorkRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const homeWork = { findMany: jest.fn() };
  return { prisma: { homeWork } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Homework routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lists homework by class', async () => {
    (prisma.homeWork.findMany as jest.Mock).mockResolvedValue([{ id: 'h1' }]);
    const res = await request(app).get('/school/home-work/class/cls1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'h1' }]);
  });

  it('handles error', async () => {
    (prisma.homeWork.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school/home-work/class/cls1');
    expect(res.status).toBe(500);
  });
});
