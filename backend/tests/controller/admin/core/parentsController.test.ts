import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/admin/routes/core/parentRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const parent = { findMany: jest.fn() };
  return { prisma: { parent } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

beforeAll(() => {});
afterAll(() => { jest.resetAllMocks(); });

describe('Parent routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets parents by school', async () => {
    (prisma.parent.findMany as jest.Mock).mockResolvedValue([{ id: 'p1' }]);
    const res = await request(app).get('/schools/1/parents');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: [{ id: 'p1' }] });
  });

  it('db error', async () => {
    (prisma.parent.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/schools/1/parents');
    expect(res.status).toBe(500);
  });
});
