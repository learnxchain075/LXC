import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/student/routes/dashboard/topicRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const topic = { findMany: jest.fn() };
  return { prisma: { topic } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Topic routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets topics of roadmap', async () => {
    (prisma.topic.findMany as jest.Mock).mockResolvedValue([{ id: 't1' }]);
    const res = await request(app).get('/roadmaps/1/topics');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 't1' }]);
  });

  it('handles db error', async () => {
    (prisma.topic.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/roadmaps/1/topics');
    expect(res.status).toBe(500);
  });
});
