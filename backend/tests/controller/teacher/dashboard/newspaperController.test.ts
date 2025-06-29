import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/teacher/routes/dashboard/newspaperRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const newspaper = { findMany: jest.fn() };
  return { prisma: { newspaper } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Newspaper routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lists newspapers', async () => {
    (prisma.newspaper.findMany as jest.Mock).mockResolvedValue([{ id: 'n1' }]);
    const res = await request(app).get('/school/newspapers');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'n1' }]);
  });

  it('handles db error', async () => {
    (prisma.newspaper.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school/newspapers');
    expect(res.status).toBe(500);
  });
});
