import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/teacher/routes/dashboard/marksheetRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const result = { groupBy: jest.fn() };
  return { prisma: { result } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Marksheet routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets topper list', async () => {
    (prisma.result.groupBy as jest.Mock).mockResolvedValue([{ studentId: 's1' }]);
    const res = await request(app).get('/school/teacher/marksheet/topper/cls1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ studentId: 's1' }]);
  });

  it('handles errors', async () => {
    (prisma.result.groupBy as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school/teacher/marksheet/topper/cls1');
    expect(res.status).toBe(500);
  });
});
