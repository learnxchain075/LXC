import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/teacher/routes/dashboard/subjectRoute';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const subject = { findMany: jest.fn() };
  return { prisma: { subject } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Subject routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets subjects', async () => {
    (prisma.subject.findMany as jest.Mock).mockResolvedValue([{ id: 'sub1' }]);
    const res = await request(app).get('/teacher/subject');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'sub1' }]);
  });

  it('handles failure', async () => {
    (prisma.subject.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/teacher/subject');
    expect(res.status).toBe(500);
  });
});
