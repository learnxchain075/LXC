import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/teacher/routes/dashboard/assignmentRoute';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const assignment = { findMany: jest.fn() };
  return { prisma: { assignment } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Assignment routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets assignments', async () => {
    (prisma.assignment.findMany as jest.Mock).mockResolvedValue([{ id: 'a1' }]);
    const res = await request(app).get('/school/teacher/assignment');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'a1' }]);
  });

  it('handles errors', async () => {
    (prisma.assignment.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school/teacher/assignment');
    expect(res.status).toBe(500);
  });
});
