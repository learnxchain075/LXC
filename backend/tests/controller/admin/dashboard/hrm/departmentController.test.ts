import request from 'supertest';
import express from 'express';
import routes from '../../../../../../src/modules/admin/routes/dashboard/hrm/departmentRoutes';
import { prisma } from '../../../../../../src/db/prisma';

jest.mock('../../../../../../src/db/prisma', () => {
  const department = { findMany: jest.fn() };
  return { prisma: { department } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Department routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns departments list', async () => {
    (prisma.department.findMany as jest.Mock).mockResolvedValue([{ id: 'd1' }]);
    const res = await request(app).get('/schools/s1/departments');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'd1' }]);
  });

  it('handles db error', async () => {
    (prisma.department.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/schools/s1/departments');
    expect(res.status).toBe(500);
  });
});
