import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/teacher/routes/dashboard/resultRoute';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const result = { findMany: jest.fn() };
  return { prisma: { result } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Result routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets results', async () => {
    (prisma.result.findMany as jest.Mock).mockResolvedValue([{ id: 'r1' }]);
    const res = await request(app).get('/school/teacher/result');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'r1' }]);
  });

  it('handles errors', async () => {
    (prisma.result.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school/teacher/result');
    expect(res.status).toBe(500);
  });
});
