import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/teacher/routes/dashboard/sectionRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const section = { findMany: jest.fn() };
  return { prisma: { section } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Section routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets sections', async () => {
    (prisma.section.findMany as jest.Mock).mockResolvedValue([{ id: 'sec1' }]);
    const res = await request(app).get('/school/class/cls1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'sec1' }]);
  });

  it('handles errors', async () => {
    (prisma.section.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school/class/cls1');
    expect(res.status).toBe(500);
  });
});
