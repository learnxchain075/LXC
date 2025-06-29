import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/teacher/routes/dashboard/classRoute';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const classModel = { findMany: jest.fn() };
  return { prisma: { class: classModel } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Class routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lists classes', async () => {
    (prisma.class.findMany as jest.Mock).mockResolvedValue([{ id: 'c1' }]);
    const res = await request(app).get('/school/classes');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'c1' }]);
  });

  it('handles db errors', async () => {
    (prisma.class.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school/classes');
    expect(res.status).toBe(500);
  });
});
