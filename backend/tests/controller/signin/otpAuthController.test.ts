import request from 'supertest';
import express from 'express';
import routes from '../../../src/routes/signin/otpRoute';
import { prisma } from '../../../src/db/prisma';

jest.mock('../../../src/db/prisma', () => {
  const user = { findUnique: jest.fn() };
  const otpToken = { create: jest.fn(), findFirst: jest.fn(), update: jest.fn(), deleteMany: jest.fn() };
  return { prisma: { user, otpToken } };
});

jest.mock('../../../src/services/notification', () => ({
  sendSMS: jest.fn(),
  sendEmail: jest.fn(),
}));

jest.mock('../../../src/utils/mailer', () => ({
  renderAndSendEmail: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('h'),
  compare: jest.fn().mockResolvedValue(true),
}));

jest.mock('../../../src/utils/jwt_utils', () => ({
  getJwtToken: jest.fn().mockReturnValue('token'),
}));

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

const { user, otpToken } = prisma as any;

describe('OTP auth routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('sends otp', async () => {
    user.findUnique.mockResolvedValue({ id: 'u1', email: 'e', phone: '1' });
    const res = await request(app).post('/request-otp').send({ email: 'e' });
    expect(res.status).toBe(200);
    expect(otpToken.create).toHaveBeenCalled();
  });

  it('handles missing user on request', async () => {
    user.findUnique.mockResolvedValue(null);
    const res = await request(app).post('/request-otp').send({ email: 'e' });
    expect(res.status).toBe(404);
  });

  it('logs in with otp', async () => {
    user.findUnique.mockResolvedValue({ id: 'u1', email: 'e', role: 'admin', school: { id: 's1' } });
    otpToken.findFirst.mockResolvedValue({ id: 'o1', otpHash: 'h' });
    const res = await request(app).post('/login-otp').send({ email: 'e', otp: '1234' });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBe('token');
  });

  it('handles invalid otp', async () => {
    user.findUnique.mockResolvedValue({ id: 'u1', email: 'e' });
    otpToken.findFirst.mockResolvedValue(null);
    const res = await request(app).post('/login-otp').send({ email: 'e', otp: '1234' });
    expect(res.status).toBe(400);
  });
});
