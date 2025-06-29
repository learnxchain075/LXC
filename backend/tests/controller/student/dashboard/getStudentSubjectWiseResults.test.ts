import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/student/routes/dashboard/studentAllRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const result = { findMany: jest.fn() };
  return { prisma: { result } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Student subject wise results route', () => {
  beforeEach(() => jest.clearAllMocks());

  it('no results found', async () => {
    (prisma.result.findMany as jest.Mock).mockResolvedValue([]);
    const res = await request(app).get('/student/1/results-summary');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, message: 'No results found for this student', subjectWise: [], overall: {} });
  });

  it('handles db error', async () => {
    (prisma.result.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/student/1/results-summary');
    expect(res.status).toBe(500);
  });
});
