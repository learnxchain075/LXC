import request from 'supertest';
import express from 'express';
import routes from '../../../../../src/modules/admin/routes/core/schoolauthroutes/accountRoutes';
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

describe('Account routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retrieves accounts successfully', async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValue([{ id: 'a1' }]);
    const res = await request(app).get('/account');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'a1' }]);
  });

  it('handles errors', async () => {
    (prisma.user.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/account');
    expect(res.status).toBe(500);
  });
});
