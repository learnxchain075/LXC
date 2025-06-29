import request from 'supertest';
import express from 'express';
import routes from '../../../src/routes/signin/signinRoute';
import { prisma } from '../../../src/db/prisma';

jest.mock('bcrypt', () => ({ compare: jest.fn().mockResolvedValue(true) }));
jest.mock('../../../src/utils/jwt_utils', () => ({ getJwtToken: jest.fn().mockReturnValue('token') }));

jest.mock('../../../src/db/prisma', () => {
  const user = { findUnique: jest.fn() };
  return { prisma: { user } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

beforeAll(() => {});
afterAll(() => {
  jest.resetAllMocks();
});

describe('Signin routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('signs in user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'u1', email: 'e', password: 'h', role: 'admin', school: { id: 's1' } });
    const res = await request(app).post('/sign-in').send({ email: 'e', password: 'p' });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBe('token');
  });

  it('handles auth error', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await request(app).post('/sign-in').send({ email: 'e', password: 'p' });
    expect(res.status).toBe(404);
  });
});
