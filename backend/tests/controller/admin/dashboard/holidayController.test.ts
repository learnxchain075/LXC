import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/admin/routes/dashboard/holidayRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const holiday = { findMany: jest.fn() };
  return { prisma: { holiday } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Holiday routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns holidays list', async () => {
    (prisma.holiday.findMany as jest.Mock).mockResolvedValue([{ id: 'h1' }]);
    const res = await request(app).get('/admin/school/holidays');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'h1' }]);
  });

  it('handles db error', async () => {
    (prisma.holiday.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/admin/school/holidays');
    expect(res.status).toBe(500);
  });
});
