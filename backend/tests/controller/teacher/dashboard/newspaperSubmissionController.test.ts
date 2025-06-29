import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/teacher/routes/dashboard/newspaperSubmissionRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const newspaperSubmission = { findMany: jest.fn() };
  return { prisma: { newspaperSubmission } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Newspaper submission routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets submissions by newspaper', async () => {
    (prisma.newspaperSubmission.findMany as jest.Mock).mockResolvedValue([{ id: 's1' }]);
    const res = await request(app).get('/school/newspaper/submission/newspaper/n1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 's1' }]);
  });

  it('handles errors', async () => {
    (prisma.newspaperSubmission.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school/newspaper/submission/newspaper/n1');
    expect(res.status).toBe(500);
  });
});
