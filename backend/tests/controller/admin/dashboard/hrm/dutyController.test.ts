import request from 'supertest';
import express from 'express';
import routes from '../../../../../src/modules/admin/routes/dashboard/hrm/dutiesRoutes';
import { prisma } from '../../../../../src/db/prisma';

jest.mock('../../../../../src/db/prisma', () => {
  const duty = {
    findMany: jest.fn(),
  };
  return { prisma: { duty } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Duties routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns duties list', async () => {
    (prisma.duty.findMany as jest.Mock).mockResolvedValue([{ id: 'd1' }]);
    const res = await request(app).get('/school/s1/duties');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'd1' }]);
  });

  it('handles db error', async () => {
    (prisma.duty.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school/s1/duties');
    expect(res.status).toBe(500);
  });
});
