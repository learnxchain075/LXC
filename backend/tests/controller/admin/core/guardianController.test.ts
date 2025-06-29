import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/admin/routes/core/guardianRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const student = { findMany: jest.fn() };
  return { prisma: { student } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

beforeAll(() => {});
afterAll(() => { jest.resetAllMocks(); });

describe('Guardian routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets guardians', async () => {
    (prisma.student.findMany as jest.Mock).mockResolvedValue([{ id: 'g1' }]);
    const res = await request(app).get('/admin/school/guardians');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'g1' }]);
  });

  it('handles db error', async () => {
    (prisma.student.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/admin/school/guardians');
    expect(res.status).toBe(500);
  });
});
