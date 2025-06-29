import request from 'supertest';
import express from 'express';
import routes from '../../../src/modules/superadmin/routes/core/superAdminRoute';
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

describe('SuperAdmin routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('fetches super admins', async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValue([{ id: 'u1' }]);
    const res = await request(app).get('/get-all');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'u1' }]);
  });

  it('handles errors', async () => {
    (prisma.user.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/get-all');
    expect(res.status).toBe(500);
  });
});
