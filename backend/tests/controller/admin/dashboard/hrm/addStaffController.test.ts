import request from 'supertest';
import express from 'express';
import routes from '../../../../../src/modules/admin/routes/dashboard/hrm/addStaffRoutes';
import { prisma } from '../../../../../src/db/prisma';

jest.mock('../../../../../src/db/prisma', () => {
  const staff = {
    findMany: jest.fn(),
  };
  return { prisma: { staff } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Add staff routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns staff list', async () => {
    (prisma.staff.findMany as jest.Mock).mockResolvedValue([{ id: 's1' }]);
    const res = await request(app).get('/school/staff');
    expect(res.status).toBe(200);
  });

  it('handles db error', async () => {
    (prisma.staff.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school/staff');
    expect(res.status).toBe(500);
  });
});
