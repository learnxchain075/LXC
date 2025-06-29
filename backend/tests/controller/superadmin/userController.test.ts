import request from 'supertest';
import express from 'express';
import routes from '../../../src/modules/superadmin/routes/core/userRoutes';
import { prisma } from '../../../src/db/prisma';

jest.mock('../../../src/db/prisma', () => {
  const user = { findMany: jest.fn() };
  return { prisma: { user } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('User routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns users', async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValue([{ id: 'u1' }]);
    const res = await request(app).get('/user/get-all');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'u1' }]);
  });

  it('handles error', async () => {
    (prisma.user.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/user/get-all');
    expect(res.status).toBe(500);
  });
});
