import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/student/routes/dashboard/roadmapRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const roadmap = { findMany: jest.fn() };
  return { prisma: { roadmap } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Roadmap routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets roadmaps', async () => {
    (prisma.roadmap.findMany as jest.Mock).mockResolvedValue([{ id: 'r1' }]);
    const res = await request(app).get('/roadmaps');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'r1' }]);
  });

  it('handles db error', async () => {
    (prisma.roadmap.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/roadmaps');
    expect(res.status).toBe(500);
  });
});
