import request from 'supertest';
import express from 'express';
import routes from '../../../../../../src/modules/admin/routes/dashboard/hrm/designationsRoutes';
import { prisma } from '../../../../../../src/db/prisma';

jest.mock('../../../../../../src/db/prisma', () => {
  const designation = { findMany: jest.fn() };
  return { prisma: { designation } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Designation routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns designations list', async () => {
    (prisma.designation.findMany as jest.Mock).mockResolvedValue([{ id: 'des1' }]);
    const res = await request(app).get('/school/s1/designations');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'des1' }]);
  });

  it('handles db error', async () => {
    (prisma.designation.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school/s1/designations');
    expect(res.status).toBe(500);
  });
});
