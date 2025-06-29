import request from 'supertest';
import express from 'express';
import routes from '../../../../../src/modules/admin/routes/core/schoolauthroutes/transportRoutes';
import { prisma } from '../../../../../src/db/prisma';

jest.mock('../../../../../src/db/prisma', () => {
  const user = { findMany: jest.fn() };
  return { prisma: { user } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

beforeAll(() => {});
afterAll(() => { jest.resetAllMocks(); });

describe('Transport routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns transports', async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValue([{ id: 'tr1' }]);
    const res = await request(app).get('/transport');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'tr1' }]);
  });

  it('db error', async () => {
    (prisma.user.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/transport');
    expect(res.status).toBe(500);
  });
});
