import request from 'supertest';
import express from 'express';
import routes from '../../../../../src/modules/admin/routes/dashboard/visitor/visitorRoutes';
import { prisma } from '../../../../../src/db/prisma';

jest.mock('../../../../../src/db/prisma', () => {
  const visitor = { findMany: jest.fn() };
  return { prisma: { visitor } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Visitor routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns visitors list', async () => {
    (prisma.visitor.findMany as jest.Mock).mockResolvedValue([{ id: 'v1' }]);
    const res = await request(app).get('/school/s1/visitors');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'v1' }]);
  });

  it('handles db error', async () => {
    (prisma.visitor.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school/s1/visitors');
    expect(res.status).toBe(500);
  });
});
