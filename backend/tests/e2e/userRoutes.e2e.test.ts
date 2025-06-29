import request from 'supertest';
import express from 'express';

import signinRoute from '../src/routes/signin/signinRoute';
import userRoutes from '../src/modules/superadmin/routes/core/userRoutes';
import { authenticateToken } from '../src/utils/jwt_utils';
import { prisma } from '../src/db/prisma';

jest.mock('../src/db/prisma', () => {
  const user = { findUnique: jest.fn(), findMany: jest.fn() };
  return { prisma: { user } };
});

jest.mock('../src/utils/jwt_utils', () => {
  const original = jest.requireActual('../src/utils/jwt_utils');
  return {
    ...original,
    getJwtToken: jest.fn().mockResolvedValue('token'),
    decodeJwtToken: jest.fn().mockResolvedValue({ userId: 'u1' }),
  };
});

jest.mock('bcrypt', () => ({ compare: jest.fn().mockResolvedValue(true) }));

const app = express();
app.use(express.json());
app.use('/auth', signinRoute);
app.use('/', authenticateToken, userRoutes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('User routes e2e', () => {
  beforeEach(() => jest.clearAllMocks());

  it('signs in and fetches users with token', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'u1', email: 'e', password: 'h', role: 'admin' });
    (prisma.user.findMany as jest.Mock).mockResolvedValue([{ id: 'u1' }]);

    const loginRes = await request(app).post('/auth/sign-in').send({ email: 'e', password: 'p' });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.accessToken).toBe('token');

    const res = await request(app).get('/user/get-all').set('auth-token', 'token');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: [{ id: 'u1' }] });
  });
});
