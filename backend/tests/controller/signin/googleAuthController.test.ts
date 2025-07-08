import request from 'supertest';
import express from 'express';
import routes from '../../../src/routes/signin/googleAuthRoute';
import { prisma } from '../../../src/db/prisma';

jest.mock('google-auth-library', () => {
  return { OAuth2Client: jest.fn().mockImplementation(() => ({
      verifyIdToken: jest.fn().mockResolvedValue({ getPayload: () => ({ email: 'e@test.com' }) })
  })) };
});

jest.mock('../../../src/db/prisma', () => {
  const user = { findUnique: jest.fn() };
  return { prisma: { user } };
});

jest.mock('../../../src/utils/jwt_utils', () => ({ getJwtToken: jest.fn().mockReturnValue('token') }));

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

const { user } = prisma as any;

describe('Google auth route', () => {
  beforeEach(() => jest.clearAllMocks());

  it('signs in with google', async () => {
    user.findUnique.mockResolvedValue({ id: 'u1', email: 'e@test.com', role: 'admin', school: { id: 's1' } });
    const res = await request(app).post('/google-signin').send({ idToken: 'x' });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBe('token');
  });

  it('returns 404 if user missing', async () => {
    user.findUnique.mockResolvedValue(null);
    const res = await request(app).post('/google-signin').send({ idToken: 'x' });
    expect(res.status).toBe(404);
  });
});
